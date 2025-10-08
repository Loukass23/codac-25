'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { CohortDistributionData } from '@/data/cohort/get-cohort-stats';
import { useChartColors } from '@/hooks/use-chart-colors';

type CohortDistributionChartProps = {
  data: CohortDistributionData[];
};

export function CohortDistributionChart({
  data,
}: CohortDistributionChartProps) {
  const colors = useChartColors();

  const statusColors = {
    active: colors.chart1,
    upcoming: colors.chart2,
    completed: colors.chart3,
  };

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
        <XAxis
          dataKey='name'
          className='text-xs'
          tick={{ fill: colors.mutedForeground }}
          angle={-45}
          textAnchor='end'
          height={80}
        />
        <YAxis
          className='text-xs'
          tick={{ fill: colors.mutedForeground }}
          label={{ value: 'Students', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
          }}
          labelStyle={{ color: colors.foreground }}
          formatter={(value: number, name: string, props: any) => [
            `${value} students (${props.payload.percentage}%)`,
            props.payload.status.charAt(0).toUpperCase() +
              props.payload.status.slice(1),
          ]}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
          }}
          formatter={(value, entry: any) => {
            const status = entry.payload?.status || 'active';
            return status.charAt(0).toUpperCase() + status.slice(1);
          }}
        />
        <Bar dataKey='students' radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors.chart1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
