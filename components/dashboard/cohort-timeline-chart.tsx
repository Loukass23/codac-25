'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { CohortTimelineData } from '@/data/cohort/get-cohort-stats';
import { useChartColors } from '@/hooks/use-chart-colors';

type CohortTimelineChartProps = {
  data: CohortTimelineData[];
};

export function CohortTimelineChart({ data }: CohortTimelineChartProps) {
  const colors = useChartColors();

  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
        <XAxis
          dataKey='month'
          className='text-xs'
          tick={{ fill: colors.mutedForeground }}
        />
        <YAxis className='text-xs' tick={{ fill: colors.mutedForeground }} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
          }}
          labelStyle={{ color: colors.foreground }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
          }}
        />
        <Line
          type='monotone'
          dataKey='enrolled'
          stroke={colors.chart1}
          strokeWidth={2}
          dot={{ fill: colors.chart1 }}
          name='New Enrollments'
        />
        <Line
          type='monotone'
          dataKey='graduated'
          stroke={colors.chart2}
          strokeWidth={2}
          dot={{ fill: colors.chart2 }}
          name='Graduated'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
