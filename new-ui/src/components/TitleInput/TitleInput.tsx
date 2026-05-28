import React from 'react';

export interface TitleInputProps {
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const TitleInput: React.FC<TitleInputProps> = ({
  title,
  children,
  width,
  height,
  style,
}) => {
  return (
    <div style={{ width, height, ...style }}>
      <label
        style={{
          display: 'block',
          marginBottom: '4px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#555',
        }}
      >
        {title}
      </label>
      {children}
    </div>
  );
};

export default TitleInput;
