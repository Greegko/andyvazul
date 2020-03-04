import * as React from 'react';
import { Menu } from './menu';
import { getMenuItems } from '../queries';

import './layout.css';
import { Link } from 'gatsby';
export const Layout = ({ children, location }) => {
  const [mainPath] = location.pathname.split("/").splice(1);

  const menu = getMenuItems();
  const activeMenu = menu.find(x => x.path === mainPath);
  const activeMenuPath = activeMenu?.path;

  const hasSubmenu = children[0].type === Menu;

  return (
    <div className="layout">
      <div>
        <div className="title"><Link to="/">andyvazul</Link></div>
        <Menu items={menu} activeItem={activeMenuPath} base="" />
      </div>
      <div className={"content " + (hasSubmenu ? "content--submenu" : "")}>
        {children}
      </div>
    </div>
  );
};
