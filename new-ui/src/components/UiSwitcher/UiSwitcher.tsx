import React from 'react';
import Switch from '@mui/material/Switch';

export interface UiSwitcherProps {
  activeState: boolean;
  onChange: (value: boolean) => void;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

const UiSwitcher: React.FC<UiSwitcherProps> = ({
  activeState,
  onChange,
  height,
  width,
  style,
}) => {
  const sx = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <Switch
      checked={activeState}
      onChange={(e) => onChange(e.target.checked)}
      sx={sx}
      style={style}
    />
  );
};

export default UiSwitcher;
