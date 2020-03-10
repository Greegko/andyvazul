import * as React from 'react';
import { Menu } from './menu';
import { getMenuItems, MenuItem } from '../queries';
import { Link } from 'gatsby';

interface LayoutProperties {
  children: any;
  location: any;
  submenu?: MenuItem[];
}

const TitleHeight = 29;

let LastActivePos = 0;

import './layout.css';
export const Layout = ({ children, location, submenu }: LayoutProperties) => {
  const [mainPath, subPath] = location.pathname.split("/").splice(1);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(LastActivePos);

  const setActiveMenuPosSave = (value: number) => {
    LastActivePos = value;
    setActiveMenuPos(value);
  }

  const menu = getMenuItems();
  const activeMenu = menu.find(x => x.path === mainPath)?.path;
  const activeSubMenu = submenu?.find(x => x.path === subPath)?.path;

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="title"><Link to="/">andyvazul</Link></div>
        <div className="menus">
          <Menu items={menu} activeItem={activeMenu} base="" setActiveElementPosition={setActiveMenuPosSave} />
          {submenu && submenu.length > 0 && <div style={{ paddingTop: activeMenuPos - TitleHeight }}><Menu items={submenu} activeItem={activeSubMenu} base={"/" + activeMenu} /></div>}
        </div>
      </div>
      <div className="content" style={{ paddingTop: activeMenuPos }}>
        {children}
      </div>
    </div>
  );
};
