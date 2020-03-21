import * as React from 'react';

export const ProjectGroup = ({ children }) => {
  const items = children.filter(x => typeof x !== 'string');

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{items[0]}</div>
      <div style={{ flex: 0, flexBasis: "100px" }}>{items[1]}</div>
      <div style={{ flex: 0, flexBasis: "100px" }}>{items[2]}</div>
      <div style={{ flex: 0, flexBasis: "100px" }}>{items[3]}</div>
    </div>
  );
};
