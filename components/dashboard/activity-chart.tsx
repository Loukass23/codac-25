'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ActivityData } from '@/data/projects/get-project-trends';
import { useChartColors } from '@/hooks/use-chart-colors';

type ActivityChartProps = {
  data: ActivityData[];
};

export function ActivityChart({ data }: ActivityChartProps) {
  const colors = useChartColors();

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
        <XAxis
          dataKey='date'
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
        <Bar dataKey='projects' fill={colors.chart1} name='New Projects' />
        <Bar dataKey='comments' fill={colors.chart2} name='Comments' />
        <Bar dataKey='likes' fill={colors.chart3} name='Likes' />
      </BarChart>
    </ResponsiveContainer>
  );
}
