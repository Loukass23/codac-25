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

type TechStackChartProps = {
  data: TechStackData[];
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary) / 0.7)',
  'hsl(var(--chart-1) / 0.7)',
  'hsl(var(--chart-2) / 0.7)',
  'hsl(var(--chart-3) / 0.7)',
];

export function TechStackChart({ data }: TechStackChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data} layout='vertical'>
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
        <XAxis
          type='number'
          className='text-xs text-muted-foreground'
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          dataKey='name'
          type='category'
          width={100}
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
          formatter={(value: number, name: string, props: any) => [
            `${value} projects (${props.payload.percentage}%)`,
            'Usage',
          ]}
        />
        <Bar dataKey='count' radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
