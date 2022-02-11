import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Stats as IStats, Stats_statistics } from "../__generated__/Stats";

const defaultFieldFormatter = (field: any) =>
  field === undefined ? "no data" : field;

interface StatFields {
  title: string;
  goodThreshold?: (...args: any[]) => boolean;
  formatter?: (arg0: any) => any;
}

// Stats fields config. Keys correspond to graphql queries, and values
// contain the associated data and methods we need to render. A single query
// can be rendered in multiple ways (see 'uptime').
const statsFields: { [key in keyof Stats_statistics]: StatFields[] } = {
  __typename: [
    {
      title: "Height",
      goodThreshold: (height: number) => height >= 60,
    },
  ],
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
        return `${days}d ${hours}h ${mins}m ${secs}s`;
      },
    },
    {
      title: "Since",
      formatter: (t: string) => {
        if (!t) {
          return;
        }
        return `${new Date(t).toLocaleString().replace(",", " ")}`;
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

export const StatsTable = () => { 
  // const {data, loading, error} = useQuery<IStats>(STATS_QUERY, { pollInterval: 800 });

  // if (error) {
  //   return <h3>Couldn't connect to Mainnet</h3>
  // }

  // if (loading || !data) {
  //   return <h3>Attempting connection</h3>;
  // }

  // const returnedStatistics = data.statistics;

  const [data, setData] = useState<IStats>();

  useEffect(() => {
    async function getStats() {
      const returned = await fetch('https://api.token.vega.xyz/statistics').then(response => response.json());
      setData(returned);
    }

    const interval = setInterval(getStats, 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="w-full max-w-md mt-10 self-start justify-self-center">
      <h3 className="font-ap uppercase text-3xl pb-3">{ data?.statistics ? '/ Mainnet' : '/ Connecting...' }</h3>
      <table className="w-full">
        <tbody>
          { data?.statistics ? 
          Object.entries(statsFields).map(([key, value]) => {
            const statKey = key as keyof Stats_statistics;

            if (statKey === "__typename") {
              return null;
            }

            // const statData = returnedStatistics[statKey];
            let statData = data?.statistics[statKey];

            if (key === "upTime") {
              // There's a discrepancy between the 'uptime' rest endpoint key and the 'upTime' graphql key. As we intend to go back to Graphql
              // when it's ready, hard code this issue for now.
              // @ts-ignore
              statData = data?.statistics["uptime"]
            }

            // Loop through the list of render options associated with the key
            return value.map((s, i) => {
              return (
                <tr className="border border-solid border-gray-400" key={i}>
                  <td className="py-1 px-2">{s.title}</td>
                  <td className="py-1 px-2 text-right">{s.formatter ? s.formatter(statData) : defaultFieldFormatter(statData)}</td>
                  <td className="py-1 px-2">{s.goodThreshold ? (
                    <div className={`w-2 h-2 rounded-xl ${s.goodThreshold(statData) ? "bg-vega-green" : "bg-vega-red"}`}></div>
                  ) : null}</td>
                </tr>
              )
            })
          })
          : null
        }
        </tbody>
      </table>
    </div>
  );
};
