import { useEffect, useState } from "react";
import { statsFields } from "../../config/statsFields";
import { Stats_statistics as IStatsStatistics, StructuredStats as IStructuredStats } from "../../config/types";

const defaultFieldFormatter = (field: any) =>
  field === undefined ? "no data" : field;

export const Stats = () => { 
  const [data, setData] = useState<IStructuredStats>();

  useEffect(() => {
    async function getStats() {
      const returned = await fetch('https://api.token.vega.xyz/statistics').then(response => response.json());

      if (!returned.statistics) {
        return;
      }

      const structured = Object.entries(statsFields).reduce((acc, [key, value]) => {
        const statKey = key as keyof IStatsStatistics;

        // const statData = returnedStatistics[statKey];
        let statData = returned.statistics[statKey];

        value.forEach((x) => {
          const stat = {
            ...x,
            value: statData,
          };

          stat.promoted ? acc.promoted.push(stat) : acc.table.push(stat);
        })

        return acc;
      }, {promoted: [], table: []} as IStructuredStats);

      setData(structured);
    }

    const interval = setInterval(getStats, 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <div className="stats-grid w-full max-w-3xl mt-10 md:mt-16 self-start justify-self-center px-6">
      <h3 className="font-ap uppercase text-3xl pb-4">{ data ? '/ Mainnet' : '/ Connecting...' }</h3>

      {data?.promoted ? 
      (<div className="grid sm:grid-cols-2 md:grid-cols-1 mb-6">
        {data.promoted.map((stat, i) => {
          return (
            <div className="m-0.5 px-6 py-4 pr-16 border border-gray-400 items-center" key={i}>
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
              <tr className="border border-gray-400" key={i}>
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
