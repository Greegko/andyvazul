import * as React from 'react';

export const divRender = (params) => {
  const newParams = removeEmptyLinesInGrids(params);

  return React.createElement('div', newParams);
}

const isOnlyWhitespace = x => typeof x === 'string' && x.match(/^\s+$/);
const removeEmptyLinesInGrids = (params) => {
  if (params.className === 'grid-2' || params.className === 'grid-3') {
    if (params.children.length > 0) {
      return { ...params, children: params.children.filter(x => !isOnlyWhitespace(x)) };
    }
  }

  return params;
}
