import React from 'react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <MuiCard className={className}>
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
