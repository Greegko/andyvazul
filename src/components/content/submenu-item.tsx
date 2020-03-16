import * as React from 'react';
import { SubmenuContext } from '../context';
import { urlFriendly } from '../../utils';

interface SubmenuItemProperties {
  url?: string;
  children: string | string[];
  hidden?: boolean;
}

export const SubmenuItem = ({ children, url, hidden }: SubmenuItemProperties) => {
  const title = typeof children === 'string' ? children : children[0];
  const path = url ? url : urlFriendly(title);

  const context = React.useContext(SubmenuContext);
  React.useEffect(() => {
    context.addSubmenuItem({ title, path });
  }, []);

  return <a id={path} className={'submenu-link' + (hidden ? ' hidden' : '')}></a>;
};
