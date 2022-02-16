import React from 'react';
import { StatFields } from '../../config/types';

export const defaultFieldFormatter = (field: any) =>
  field === undefined ? 'no data' : field;

export const TableRow = ({
  title,
  formatter,
  goodThreshold,
  value,
}: StatFields) => {
  return (
    <tr className="border border-gray-400">
      <td className="py-1 px-2">{title}</td>
      <td className="py-1 px-2 text-right">
        {formatter ? formatter(value) : defaultFieldFormatter(value)}
      </td>
      <td className="py-1 px-2">
        {goodThreshold ? (
          <div
            className={`w-2 h-2 rounded-xl ${
              goodThreshold(value) ? 'bg-vega-green' : 'bg-vega-red'
            }`}
          ></div>
        ) : null}
      </td>
    </tr>
  );
};
