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
      labels: {
        fontFamily: 'DM Sans',
        fontSize: 14,
        fill: '#aaa',
        padding: 4,
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
        fontSize: 14,
      },
    },
  },
};

export interface BarChartProps {
  timespan: Timespan;
  counts: Record<string, number>;
}

export const BarChart = ({ timespan, counts }: BarChartProps) => {
  const data = Object.entries(counts).map(([label, value]) => {
    return {
      x: label,
      y: value,
    };
  });

  const tickFormat = (t: string) => {
    switch (timespan) {
      case Timespan.Month:
        return parseInt(t.slice(8));

      case Timespan.Year:
        return MONTHS[parseInt(t.slice(5)) - 1];
    }
  };

  const tickCount = timespan === Timespan.Month ? data.length / 2 : data.length;

  return (
    <VictoryChart theme={theme} height={200} padding={32}>
      <VictoryAxis tickFormat={tickFormat} tickCount={tickCount} />
      <VictoryBar
        data={data}
        barRatio={1}
        labels={({ datum }) => datum.y || ''}
      />
    </VictoryChart>
  );
};
