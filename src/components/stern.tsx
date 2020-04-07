import * as React from 'react';

import './stern.scss';
export const Stern = ({ children }) => {
  const content = Array.isArray(children) ? children[0] : children;
  return <div className="stern" contentEditable>{content.toLocaleUpperCase()}</div>
};
