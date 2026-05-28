import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FontAwesomeProps {
  icon: IconDefinition;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const FontAwesome: React.FC<FontAwesomeProps> = ({ icon, className, onClick, style }) => {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      onClick={onClick}
      style={style}
    />
  );
};

export default FontAwesome;
