import { useEffect, useState } from "react";
import { Stats_statistics as IStatsStatistics } from "../__generated__/Stats";

const defaultFieldFormatter = (field: any) =>
  field === undefined ? "no data" : field;

interface StatFields {
  title: string;
  goodThreshold?: (...args: any[]) => boolean;
  formatter?: (arg0: any) => any;
  promoted?: boolean;
  value?: any;
}

interface StructuredStats {
  promoted: StatFields[], 
  table: StatFields[]
}

// Stats fields config. Keys correspond to graphql queries, and values
// contain the associated data and methods we need to render. A single query
// can be rendered in multiple ways (see 'uptime').
const statsFields: { [key in keyof IStatsStatistics]: StatFields[] } = {
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
      promoted: true,
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
      title: "Trades / second",
      goodThreshold: (trades: number) => trades >= 2,
    },
  ],
  averageOrdersPerBlock: [
    {
      title: "Orders / block",
      goodThreshold: (orders: number) => orders >= 2,
    },
  ],
  ordersPerSecond: [
    {
      title: "Orders / second",
      goodThreshold: (orders: number) => orders >= 2,
    },
  ],
  txPerBlock: [
    {
      title: "TX / block",
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
      promoted: true,
    },
  ],
  totalPeers: [
    {
      title: "Peers",
      goodThreshold: (peers: number) => peers >= 2,
      promoted: true,
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
      promoted: true,
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

export const StatsTable = () => { 
  const [data, setData] = useState<StructuredStats>();

  useEffect(() => {
    async function getStats() {
      const returned = await fetch('https://api.token.vega.xyz/statistics').then(response => response.json());

      if (!returned.statistics) {
        return;
      }

      const structured = Object.entries(statsFields).reduce((acc, [key, value]) => {
        const statKey = key as keyof IStatsStatistics;

        if (statKey === "__typename") {
          return acc;
        }

        // const statData = returnedStatistics[statKey];
        let statData = returned.statistics[statKey];

        if (key === "upTime") {
          // There's a discrepancy between the 'uptime' rest endpoint key and the 'upTime' graphql key. As we intend to go back to Graphql
          // when it's ready, hard code this issue for now.
          // @ts-ignore
          statData = returned.statistics["uptime"]
        }

        value.forEach((x) => {
          const stat = {
            ...x,
            value: statData,
          };

          stat.promoted ? acc.promoted.push(stat) : acc.table.push(stat);
        })

        return acc;
      }, {promoted: [], table: []} as StructuredStats);

      setData(structured);
    }

    const interval = setInterval(getStats, 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="stats-grid w-full max-w-3xl mt-10 md:mt-16 self-start justify-self-center px-6">
      <h3 className="font-ap uppercase text-3xl pb-3">{ data ? '/ Mainnet' : '/ Connecting...' }</h3>

      {data?.promoted ? 
      (<div className="grid sm:grid-cols-2 md:grid-cols-1 mb-6">
        {data.promoted.map((stat, i) => {
          return (
            <div className="px-6 py-4 pr-16 border border-current items-center" key={i}>
              <div>
                <div className="uppercase text-[0.9375rem]">
                  {stat.goodThreshold ? (
                    <div className={`inline-block w-2 h-2 mb-[0.15rem] mr-2 rounded-xl ${stat.goodThreshold(stat.value) ? "bg-vega-green" : "bg-vega-red"}`} />
                  ) : null} 
                  <span>{stat.title}</span>
                </div>
                <div className="mt-1 text-2xl leading-none">{stat.formatter ? stat.formatter(stat.value) : defaultFieldFormatter(stat.value)}</div>
              </div>
            </div>
          )
        })}
      </div>)
      : null}

      <table>
        <tbody>
          { data?.table ? 
          data.table.map((stat, i) => {
            return (
              <tr className="border border-solid border-gray-400" key={i}>
                <td className="py-1 px-2">{stat.title}</td>
                <td className="py-1 px-2 text-right">{stat.formatter ? stat.formatter(stat.value) : defaultFieldFormatter(stat.value)}</td>
                <td className="py-1 px-2">{stat.goodThreshold ? (
                  <div className={`w-2 h-2 rounded-xl ${stat.goodThreshold(stat.value) ? "bg-vega-green" : "bg-vega-red"}`}></div>
                ) : null}</td>
              </tr>
            )
          })
          : null
        }
        </tbody>
      </table>
    </div>
  );
};
