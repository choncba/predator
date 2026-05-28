import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LatencyDataPoint {
  timestamp: string;
  median?: number;
  p95?: number;
  p99?: number;
  min?: number;
  max?: number;
}

interface LatencyChartProps {
  data: LatencyDataPoint[];
}

const COLORS = {
  median: '#108ee9',
  p95: '#ff9800',
  p99: '#f44336',
  min: '#4caf50',
  max: '#9c27b0',
};

const LatencyChart: React.FC<LatencyChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No latency data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          }}
        />
        <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          labelFormatter={(label: string) => new Date(label).toLocaleTimeString()}
        />
        <Legend />
        <Line type="monotone" dataKey="median" stroke={COLORS.median} name="Median" dot={false} />
        <Line type="monotone" dataKey="p95" stroke={COLORS.p95} name="P95" dot={false} />
        <Line type="monotone" dataKey="p99" stroke={COLORS.p99} name="P99" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LatencyChart;
