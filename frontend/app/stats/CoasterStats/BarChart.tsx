'use client';

import {
  VictoryChart,
  VictoryTheme,
  VictoryBar,
  VictoryAxis,
  VictoryThemeDefinition,
} from 'victory';
import _range from 'lodash/range';
import { Timespan } from '../types';

import styles from './BarChart.module.css';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const theme: VictoryThemeDefinition = {
  ...VictoryTheme.clean,
  bar: {
    ...VictoryTheme.clean.bar,
    style: {
      data: {
        fill: 'var(--primary)',
        opacity: 1,
      },
    },
  },
  axis: {
    ...VictoryTheme.clean.axis,
    style: {
      ...VictoryTheme.clean.axis?.style,
      tickLabels: {
        fontFamily: 'DM Sans',
        fill: '#fff',
        fontSize: 8,
      },
    },
  },
};

export interface BarChartProps {
  timespan: Timespan;
  counts: Record<string, number>;
}

export const BarChart = ({ timespan, counts }: BarChartProps) => {
  console.log(counts);

  const data = Object.entries(counts).map(([label, value]) => {
    return {
      x: label,
      y: value,
    };
  });

  console.log(data);

  const tickFormat = (t: string) => {
    switch (timespan) {
      case Timespan.Week:
      case Timespan.Month:
        return parseInt(t.slice(8));

      case Timespan.Year:
        return MONTHS[parseInt(t.slice(5)) - 1];
    }
  };

  const tickCount = timespan === Timespan.Month ? data.length / 2 : data.length;

  return (
    <VictoryChart theme={theme} padding={16} height={200}>
      <VictoryAxis
        tickFormat={tickFormat}
        tickCount={tickCount}
        style={{
          tickLabels: { fontSize: 10 },
        }}
      />
      <VictoryBar data={data} barRatio={1} />
    </VictoryChart>
  );
};
