import React from 'react';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <MuiTabs value={activeTab} onChange={handleChange}>
      {tabs.map((tab) => (
        <MuiTab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </MuiTabs>
  );
};

export default Tabs;
