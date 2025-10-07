'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ProjectTrendData } from '@/data/projects/get-project-trends';

type ProjectTrendsChartProps = {
  data: ProjectTrendData[];
};

export function ProjectTrendsChart({ data }: ProjectTrendsChartProps) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='colorProjects' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor='hsl(var(--chart-1))'
              stopOpacity={0.8}
            />
            <stop
              offset='95%'
              stopColor='hsl(var(--chart-1))'
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id='colorFeatured' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor='hsl(var(--chart-2))'
              stopOpacity={0.8}
            />
            <stop
              offset='95%'
              stopColor='hsl(var(--chart-2))'
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
        <Area
          type='monotone'
          dataKey='projects'
          stroke='hsl(var(--primary))'
          fillOpacity={1}
          fill='url(#colorProjects)'
          name='Total Projects'
        />
        <Area
          type='monotone'
          dataKey='featured'
          stroke='hsl(var(--chart-2))'
          fillOpacity={1}
          fill='url(#colorFeatured)'
          name='Featured Projects'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
