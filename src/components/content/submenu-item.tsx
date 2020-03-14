import * as React from 'react';
import { SubmenuContext } from '../context';
import { urlFriendly } from '../../utils';

export const SubmenuItem = ({ children }) => {
  const title = children[0];
  const path = urlFriendly(title);

  const context = React.useContext(SubmenuContext);
  React.useEffect(() => {
    context.addSubmenuItem({ title, path: "#" + path });
  }, []);

  return <a id={path}></a>;
};
