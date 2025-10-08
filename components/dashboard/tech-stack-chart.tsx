'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { TechStackData } from '@/data/projects/get-project-trends';
import { useChartColors } from '@/hooks/use-chart-colors';

type TechStackChartProps = {
  data: TechStackData[];
};

export function TechStackChart({ data }: TechStackChartProps) {
  const colors = useChartColors();

  const chartColors = [
    colors.chart1,
    colors.chart2,
    colors.chart3,
    colors.chart4,
    colors.chart5,
    `${colors.chart1} / 0.7`,
    `${colors.chart2} / 0.7`,
    `${colors.chart3} / 0.7`,
    `${colors.chart4} / 0.7`,
    `${colors.chart5} / 0.7`,
  ];

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data} layout='vertical'>
        <CartesianGrid strokeDasharray='3 3' stroke={colors.border} />
        <XAxis
          type='number'
          className='text-xs'
          tick={{ fill: colors.mutedForeground }}
        />
        <YAxis
          dataKey='name'
          type='category'
          width={100}
          className='text-xs'
          tick={{ fill: colors.mutedForeground }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
          }}
          labelStyle={{ color: colors.foreground }}
          formatter={(value: number, name: string, props: any) => [
            `${value} projects (${props.payload.percentage}%)`,
            'Usage',
          ]}
        />
        <Bar dataKey='count' radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
