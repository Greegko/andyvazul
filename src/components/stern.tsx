import * as React from 'react';

import './stern.css';
export const Stern = ({ children }) => {
  const content = Array.isArray(children) ? children[0] : children;
  return <div className="stern">{content.toLocaleUpperCase()}</div>
};
