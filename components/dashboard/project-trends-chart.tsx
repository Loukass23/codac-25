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
import { useChartColors } from '@/hooks/use-chart-colors';

type ProjectTrendsChartProps = {
  data: ProjectTrendData[];
};

export function ProjectTrendsChart({ data }: ProjectTrendsChartProps) {
  const colors = useChartColors();

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='colorProjects' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={colors.chart1} stopOpacity={0.8} />
            <stop offset='95%' stopColor={colors.chart1} stopOpacity={0} />
          </linearGradient>
          <linearGradient id='colorFeatured' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor={colors.chart2} stopOpacity={0.8} />
            <stop offset='95%' stopColor={colors.chart2} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type='monotone'
          dataKey='projects'
          stroke={colors.chart1}
          fillOpacity={1}
          fill='url(#colorProjects)'
          name='Total Projects'
        />
        <Area
          type='monotone'
          dataKey='featured'
          stroke={colors.chart2}
          fillOpacity={1}
          fill='url(#colorFeatured)'
          name='Featured Projects'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
