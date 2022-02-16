import { useEffect, useState } from 'react';
import { statsFields } from '../../config/statsFields';
import {
  Stats as IStats,
  StructuredStats as IStructuredStats,
} from '../../config/types';
import { Table } from '../table';
import { TableRow } from '../tableRow';
import { PromotedStats } from '../promotedStats';
import { PromotedStatsItem } from '../promotedStatsItem';

export const StatsManager = () => {
  const [data, setData] = useState<IStructuredStats | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getStats() {
      try {
        const { statistics } = await fetch(
          'https://api.token.vega.xyz/statistics'
        ).then((response) => response.json());
        const { nodeData } = await fetch(
          'https://api.token.vega.xyz/nodes-data'
        ).then((response) => response.json());
        const returned = { ...nodeData, ...statistics };

        if (!statistics || !nodeData) {
          throw new Error('Failed to get data from endpoints');
        }

        // Loop through the stats fields config, grabbing values from the fetched
        // data and building a set of promoted and standard table entries.
        const structured = Object.entries(statsFields).reduce(
          (acc, [key, value]) => {
            const statKey = key as keyof IStats;

            // const statData = returnedStatistics[statKey];
            let statData = returned[statKey];

            value.forEach((x) => {
              const stat = {
                ...x,
                value: statData,
              };

              stat.promoted ? acc.promoted.push(stat) : acc.table.push(stat);
            });

            return acc;
          },
          { promoted: [], table: [] } as IStructuredStats
        );

        setData(structured);
        setError(null);
      } catch (e) {
        setData(null);
        setError(e as Error);
      }
    }

    const interval = setInterval(getStats, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="stats-grid w-full max-w-3xl mt-10 md:mt-16 self-start justify-self-center px-6">
      <h3 className="font-ap uppercase text-3xl pb-4">
        {(error && `/ ${error}`) || (data ? '/ Mainnet' : '/ Connecting...')}
      </h3>

      {data?.promoted ? (
        <PromotedStats>
          {data.promoted.map((stat, i) => {
            return (
              <PromotedStatsItem
                title={stat.title}
                value={stat.value}
                formatter={stat.formatter}
                goodThreshold={stat.goodThreshold}
                key={i}
              />
            );
          })}
        </PromotedStats>
      ) : null}

      <Table>
        {data?.table
          ? data.table.map((stat, i) => {
              return (
                <TableRow
                  title={stat.title}
                  value={stat.value}
                  formatter={stat.formatter}
                  goodThreshold={stat.goodThreshold}
                  key={i}
                />
              );
            })
          : null}
      </Table>
    </div>
  );
};
