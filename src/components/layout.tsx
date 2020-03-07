import * as React from 'react';
import { Menu } from './menu';
import { getMenuItems, MenuItem } from '../queries';
import { Link } from 'gatsby';

interface LayoutProperties {
  children: any;
  location: any;
  submenu?: MenuItem[];
}

import './layout.css';
export const Layout = ({ children, location, submenu }: LayoutProperties) => {
  const [mainPath, subPath] = location.pathname.split("/").splice(1);

  const menu = getMenuItems();
  const activeMenu = menu.find(x => x.path === mainPath)?.path;
  const activeSubMenu = submenu?.find(x => x.path === subPath)?.path;

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="title"><Link to="/">andyvazul</Link></div>
        <div className="menus">
          <Menu items={menu} activeItem={activeMenu} base="" />
          {submenu && <Menu items={submenu} activeItem={activeSubMenu} base={activeMenu} />}
        </div>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};
