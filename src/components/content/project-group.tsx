import * as React from 'react';

export const ProjectGroup = ({ children }) => {
  const items = children.filter(x => typeof x !== 'string');

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{items[0]}</div>
      <div style={{ flex: 1, textAlign: 'right' }}>{items[1]}</div>
    </div>
  );
};
