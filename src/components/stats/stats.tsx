import { useEffect, useState } from "react";
import { statsFields } from "../../config/statsFields";
import { Stats as IStats, StructuredStats as IStructuredStats } from "../../config/types";

const defaultFieldFormatter = (field: any) =>
  field === undefined ? "no data" : field;

export const Stats = () => { 
  const displayError = () => (
    <div className="stats-grid w-full max-w-3xl mt-10 md:mt-16 self-start justify-self-center px-6">
      <h3 className="font-ap uppercase text-3xl pb-4">Connection error</h3>
    </div>
  );

  const [data, setData] = useState<IStructuredStats>();

  useEffect(() => {
    async function getStats() {
      try {
        const { statistics } = await fetch('https://api.token.vega.xyz/statistics').then(response => response.json());
        const { nodeData } = await fetch('https://api.token.vega.xyz/nodes-data').then((response) => response.json());
        const returned = {...nodeData, ...statistics};

        if (!returned) {
          throw new Error("Failed to get data from endpoints");
        }

        // Loop through the stats fields config, grabbing values from the fetched
        // data and building a set of promoted and standard table entries. 
        const structured = Object.entries(statsFields).reduce((acc, [key, value]) => {
          const statKey = key as keyof IStats;

          // const statData = returnedStatistics[statKey];
          let statData = returned[statKey];

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
      } catch (e) {
        console.log(e);
        displayError();
      }
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
      (<div className="grid sm:grid-cols-2 md:grid-cols-1 gap-1 mb-6">
        {data.promoted.map((stat, i) => {
          return (
            <div className="px-6 py-4 pr-16 border border-gray-400 items-center" key={i}>
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
