import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 20 }) => {
  return <CircularProgress size={size} />;
};

export default Spinner;
