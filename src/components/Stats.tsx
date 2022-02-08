import { useQuery, gql } from "@apollo/client";
import { Stats as IStats, Stats_statistics } from "./__generated__/Stats";

const defaultFieldFormatter = (field: any) =>
  field === undefined ? "no data" : JSON.stringify(field);

interface StatFields {
  title: string;
  goodThreshold?: (...args: any[]) => boolean;
  formatter?: (arg0: any) => any;
}

type Fields =
  | "blockHeight"
  | "backlogLength"
  | "tradesPerSecond"
  | "averageOrdersPerBlock"
  | "ordersPerSecond"
  | "txPerBlock"
  | "blockDuration"
  | "status"
  | "totalPeers"
  | "vegaTime"
  | "appVersion"
  | "chainVersion"
  | "upTime"
  | "chainId";

// Stats fields config. Keys correspond to graphql queries, and values
// contain the associated data and methods we need to render. A single query
// can be rendered in multiple ways (see 'uptime').
const statsFields: { [key in Fields]: StatFields[] } = {
  blockHeight: [
    {
      title: "Height",
      goodThreshold: (height: number) => height >= 60,
    },
  ],
  backlogLength: [
    {
      title: "Backlog",
      goodThreshold: (length: number, blockDuration: number) => {
        return (
          length < 1000 || (length >= 1000 && blockDuration / 1000000000 <= 1)
        );
      },
    },
  ],
  tradesPerSecond: [
    {
      title: "Trades/second",
      goodThreshold: (trades: number) => trades >= 2,
    },
  ],
  averageOrdersPerBlock: [
    {
      title: "Orders/block",
      goodThreshold: (orders: number) => orders >= 2,
    },
  ],
  ordersPerSecond: [
    {
      title: "Orders/s",
      goodThreshold: (orders: number) => orders >= 2,
    },
  ],
  txPerBlock: [
    {
      title: "TX/block",
      goodThreshold: (tx: number) => tx > 2,
    },
  ],
  blockDuration: [
    {
      title: "Block time",
      formatter: (duration: number) => (duration / 1000000000).toFixed(3),
      goodThreshold: (blockDuration: number) =>
        blockDuration > 0 && blockDuration <= 2000000000,
    },
  ],
  status: [
    {
      title: "Status",
      formatter: (status: string) => {
        if (!status) {
          return;
        }

        const i = status.lastIndexOf("_");
        if (i === -1) {
          return status;
        } else {
          return status.substr(i + 1);
        }
      },
      goodThreshold: (status: string) =>
        status === "CONNECTED" || status === "CHAIN_STATUS_CONNECTED",
    },
  ],
  totalPeers: [
    {
      title: "Peers",
      goodThreshold: (peers: number) => peers >= 2,
    },
  ],
  vegaTime: [
    {
      title: "Time",
      formatter: (time: Date) => new Date(time).toLocaleTimeString(),
      goodThreshold: (time: Date) => {
        let diff = new Date().getTime() - new Date(time).getTime();
        return diff > 0 && diff < 5000;
      },
    },
  ],
  appVersion: [
    {
      title: "App",
    },
  ],
  chainVersion: [
    {
      title: "Tendermint",
    },
  ],
  upTime: [
    {
      title: "Uptime",
      formatter: (t: string) => {
        if (!t) {
          return;
        }
        const secSinceStart =
          (new Date().getTime() - new Date(t).getTime()) / 1000;
        const days = Math.floor(secSinceStart / 60 / 60 / 24);
        const hours = Math.floor((secSinceStart / 60 / 60) % 24);
        const mins = Math.floor((secSinceStart / 60) % 60);
        const secs = Math.floor(secSinceStart % 60);
        return `${days}d${hours}h${mins}m${secs}s`;
      },
    },
    {
      title: "Since",
      formatter: (t: string) => {
        if (!t) {
          return;
        }
        return `${new Date(t).toLocaleString().replace(",", "<br>")}`;
      },
    },
  ],
  chainId: [
    {
      title: "Chain ID",
    },
  ],
};

// In an ideal world, we could generate the query string from Object.keys(statsFields).join(' '), but
// the static analysis tool used to generate types cannot handle it. Ensure the hard coded list
// of statistics fields below mirrors the statsFields keys.
const STATS_QUERY = gql`
  query Stats {
    statistics {
      blockHeight
      backlogLength
      tradesPerSecond
      averageOrdersPerBlock
      ordersPerSecond
      txPerBlock
      blockDuration
      status
      totalPeers
      vegaTime
      appVersion
      chainVersion
      upTime
      chainId
    }
  }
`;

const renderStats = (
  statKey: keyof Stats_statistics,
  statsField: StatFields[],
  statData: string
) => {
  if (statKey in statsFields) {
    statsField.map((s: any) => {
      return (
        <div key={statKey}>
          <h3>{s.title}</h3>
          <div className="value">
            {s.formatter
              ? s.formatter(statData)
              : defaultFieldFormatter(statData)}
          </div>
          {s.goodThreshold ? (
            <div className="threshold">
              Good threshold met: {s.goodThreshold(statData)}
            </div>
          ) : null}
        </div>
      );
    });
  }
};

export const Stats = () => {
  const query = useQuery<IStats>(STATS_QUERY, { pollInterval: 1000 });

  if (!query.data) {
    // Todo - check best practice - there's a loading option returned from graphql use that
    return <h3>Attempting connection</h3>;
  }

  const returnedStatistics = query.data.statistics;

  return (
    <div>
      <h2>Network Stats</h2>
      <div>
        {Object.entries(statsFields).map(([statKey, value]) => {
          const statsKey = statKey as Fields;
          return renderStats(statsKey, value, returnedStatistics[statsKey]);
        })}
      </div>
    </div>
  );
};
