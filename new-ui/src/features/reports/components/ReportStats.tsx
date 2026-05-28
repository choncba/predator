import React from 'react';
import { ReportStats as ReportStatsType } from '../../../types/report';
import styles from '../Reports.module.scss';

interface ReportStatsProps {
  stats: ReportStatsType | undefined;
}

const ReportStats: React.FC<ReportStatsProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const statItems = [
    { title: 'Scenarios Created', value: stats.scenariosCreated },
    { title: 'Scenarios Completed', value: stats.scenariosCompleted },
    { title: 'Requests Completed', value: stats.requestsCompleted },
    { title: 'Latency Min', value: `${stats.latency?.min ?? 0} ms` },
    { title: 'Latency Max', value: `${stats.latency?.max ?? 0} ms` },
    { title: 'Latency Median', value: `${stats.latency?.median ?? 0} ms` },
    { title: 'Latency P95', value: `${stats.latency?.p95 ?? 0} ms` },
    { title: 'Latency P99', value: `${stats.latency?.p99 ?? 0} ms` },
    { title: 'RPS Mean', value: stats.rps?.mean?.toFixed(2) ?? '0' },
    { title: 'RPS Count', value: stats.rps?.count ?? 0 },
  ];

  return (
    <div className={styles.statsGrid}>
      {statItems.map((item) => (
        <div key={item.title} className={styles.statBox}>
          <span className={styles.statBoxTitle}>{item.title}</span>
          <span className={styles.statBoxValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ReportStats;
