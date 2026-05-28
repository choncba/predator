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

interface RpsDataPoint {
  timestamp: string;
  mean?: number;
  count?: number;
}

interface RpsChartProps {
  data: RpsDataPoint[];
}

const RpsChart: React.FC<RpsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No RPS data available</div>;
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
        <YAxis label={{ value: 'rps', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          labelFormatter={(label: string) => new Date(label).toLocaleTimeString()}
        />
        <Legend />
        <Line type="monotone" dataKey="mean" stroke="#108ee9" name="Mean RPS" dot={false} />
        <Line type="monotone" dataKey="count" stroke="#4caf50" name="Count" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RpsChart;
