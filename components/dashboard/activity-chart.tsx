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

type ActivityChartProps = {
  data: ActivityData[];
};

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis
          dataKey='date'
          className='text-xs text-muted-foreground'
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          className='text-xs text-muted-foreground'
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
          }}
        />
        <Bar
          dataKey='projects'
          fill='hsl(var(--primary))'
          name='New Projects'
        />
        <Bar dataKey='comments' fill='hsl(var(--chart-2))' name='Comments' />
        <Bar dataKey='likes' fill='hsl(var(--chart-3))' name='Likes' />
      </BarChart>
    </ResponsiveContainer>
  );
}
