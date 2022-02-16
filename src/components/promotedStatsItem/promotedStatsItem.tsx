import React from 'react';
import { StatFields } from '../../config/types';
import { defaultFieldFormatter } from '../tableRow/tableRow';

export const PromotedStatsItem = ({
  title,
  formatter,
  goodThreshold,
  value,
}: StatFields) => {
  return (
    <div className="px-6 py-4 pr-16 border border-gray-400 items-center">
      <div className="uppercase text-[0.9375rem]">
        {goodThreshold ? (
          <div
            className={`inline-block w-2 h-2 mb-[0.15rem] mr-2 rounded-xl ${
              goodThreshold(value) ? 'bg-vega-green' : 'bg-vega-red'
            }`}
          />
        ) : null}
        <span>{title}</span>
      </div>
      <div className="mt-1 text-2xl leading-none">
        {formatter ? formatter(value) : defaultFieldFormatter(value)}
      </div>
    </div>
  );
};
