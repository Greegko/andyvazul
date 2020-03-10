import * as React from 'react';
import { SubmenuContext } from '../context';
import { urlFriendly } from '../../utils';

const runMeOnceMap = {};

export const SubmenuItem = ({ children }) => {
  const title = children[0];
  const path = urlFriendly(title);

  if (!runMeOnceMap[path]) {
    runMeOnceMap[path] = true;
    React.useContext(SubmenuContext).addSubmenuItem({ title, path: "#" + path, order: Object.keys(runMeOnceMap).length });
  }

  return <a id={path}></a>;
}