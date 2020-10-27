import React from 'react';

export default function Box({ value, children }) {
  return (
    <div
      style={{
        border: '10%',
        margin: '10px',
      }}
    >
      {children}
    </div>
  );
}
