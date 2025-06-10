import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, RadialBarChart, RadialBar, ComposedChart } from "recharts";

// Custom colors for consistent theming
const CHART_COLORS = {
  primary: '#4facfe',
  secondary: '#43e97b',
  tertiary: '#feca57',
  quaternary: '#ff6b6b',
  accent: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

const GRADIENT_DEFINITIONS = (
  <defs>
    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="tertiaryGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={CHART_COLORS.tertiary} stopOpacity={0}/>
    </linearGradient>
  </defs>
);

// Common tooltip styling
const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(0,0,0,0.9)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '12px'
};

// Common axis styling
const AXIS_STYLE = {
  stroke: 'rgba(255,255,255,0.7)',
  fontSize: 11
};

interface ChartProps {
  data: any[];
  height?: number;
  width?: string;
}

// Energy Flow Chart
export const EnergyFlowChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        {GRADIENT_DEFINITIONS}
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="timestamp" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
        <Area
          type="monotone"
          dataKey="generation"
          stackId="1"
          stroke={CHART_COLORS.secondary}
          fill="url(#secondaryGradient)"
          name="Generation (MW)"
        />
        <Area
          type="monotone"
          dataKey="consumption"
          stackId="2"
          stroke={CHART_COLORS.primary}
          fill="url(#primaryGradient)"
          name="Consumption (MW)"
        />
        <Line
          type="monotone"
          dataKey="efficiency"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={2}
          name="Efficiency (%)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Climate Metrics Chart
export const ClimateMetricsChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" {...AXIS_STYLE} />
        <YAxis yAxisId="left" {...AXIS_STYLE} />
        <YAxis yAxisId="right" orientation="right" {...AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
        <Bar 
          yAxisId="left"
          dataKey="emissions" 
          fill={CHART_COLORS.quaternary} 
          name="CO₂ Emissions (MT)"
          opacity={0.7}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="temperature"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={3}
          name="Temperature (°C)"
          dot={{ fill: CHART_COLORS.tertiary, strokeWidth: 2, r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="climateScore"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          name="Climate Score"
          strokeDasharray="5 5"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Energy Sources Distribution
export const EnergySourcesChart: React.FC<{ data: any[], height?: number }> = ({ data, height = 300 }) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS.primary} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend 
          wrapperStyle={{ color: 'white', fontSize: '12px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Vulnerability Heatmap
export const VulnerabilityHeatmapChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis type="number" {...AXIS_STYLE} />
        <YAxis dataKey="region" type="category" {...AXIS_STYLE} width={80} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
        <Bar 
          dataKey="vulnerability" 
          fill={CHART_COLORS.quaternary} 
          name="Vulnerability Score"
          radius={[0, 4, 4, 0]}
        />
        <Bar 
          dataKey="resilience" 
          fill={CHART_COLORS.secondary} 
          name="Resilience Score"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Performance Correlation Scatter Plot
export const CorrelationChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="energy" 
          name="Energy Score" 
          {...AXIS_STYLE}
          label={{ 
            value: 'Energy Access Score', 
            position: 'insideBottom', 
            offset: -5, 
            style: { fill: 'white', fontSize: '12px' } 
          }}
        />
        <YAxis 
          dataKey="climate" 
          name="Climate Score" 
          {...AXIS_STYLE}
          label={{ 
            value: 'Climate Action Score', 
            angle: -90, 
            position: 'insideLeft', 
            style: { fill: 'white', fontSize: '12px' } 
          }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: any, name: string) => [
            value,
            name === 'energy' ? 'Energy Score' : 'Climate Score'
          ]}
        />
        <Scatter 
          dataKey="climate" 
          fill={CHART_COLORS.accent}
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Radial Progress Chart for KPIs
export const RadialProgressChart: React.FC<{ data: any[], height?: number }> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={data}>
        <RadialBar
          minAngle={15}
          label={{ position: 'insideStart', fill: '#fff', fontSize: '12px' }}
          background
          clockWise
          dataKey="value"
          fill={CHART_COLORS.primary}
        />
        <Legend 
          iconSize={12} 
          wrapperStyle={{ color: 'white', fontSize: '12px' }}
          layout="vertical"
          verticalAlign="bottom"
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// Trend Analysis Chart
export const TrendChart: React.FC<ChartProps & { metrics: string[] }> = ({ 
  data, 
  metrics, 
  height = 300 
}) => {
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.quaternary,
    CHART_COLORS.accent
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
        {metrics.map((metric, index) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: colors[index % colors.length], strokeWidth: 2 }}
            name={metric.charAt(0).toUpperCase() + metric.slice(1)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Multi-axis Performance Chart
export const MultiAxisChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        {GRADIENT_DEFINITIONS}
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="category" {...AXIS_STYLE} />
        <YAxis yAxisId="left" {...AXIS_STYLE} />
        <YAxis yAxisId="right" orientation="right" {...AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
        <Bar 
          yAxisId="left"
          dataKey="progress" 
          fill={CHART_COLORS.primary} 
          name="Progress (%)"
          radius={[4, 4, 0, 0]}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="budget"
          fill="url(#secondaryGradient)"
          stroke={CHART_COLORS.secondary}
          name="Budget Utilization"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="impact"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={3}
          name="Impact Score"
          dot={{ fill: CHART_COLORS.tertiary, strokeWidth: 2, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Real-time Metrics Dashboard Chart
export const RealTimeMetricsChart: React.FC<ChartProps> = ({ data, height = 200 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        {GRADIENT_DEFINITIONS}
        <defs>
          <linearGradient id="realtimeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="timestamp" 
          {...AXIS_STYLE}
          tick={false}
          axisLine={false}
        />
        <YAxis hide />
        <Tooltip 
          contentStyle={TOOLTIP_STYLE}
          labelFormatter={(value) => `Time: ${value}`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.success}
          strokeWidth={2}
          fill="url(#realtimeGradient)"
          dot={false}
          activeDot={{ r: 4, fill: CHART_COLORS.success }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Export all chart components
export const Charts = {
  EnergyFlow: EnergyFlowChart,
  ClimateMetrics: ClimateMetricsChart,
  EnergySources: EnergySourcesChart,
  VulnerabilityHeatmap: VulnerabilityHeatmapChart,
  Correlation: CorrelationChart,
  RadialProgress: RadialProgressChart,
  Trend: TrendChart,
  MultiAxis: MultiAxisChart,
  RealTimeMetrics: RealTimeMetricsChart
};

export { CHART_COLORS, TOOLTIP_STYLE, AXIS_STYLE };
