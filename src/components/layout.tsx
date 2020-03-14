import * as React from 'react';
import { Menu } from './menu';
import { getMenuItems, MenuItem } from '../queries';
import { Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import { SubmenuContext } from '../components/context';

interface LayoutProperties {
  children: any;
  location: any;
  title: string;
  description: string;
  submenu?: MenuItem[];
}

const TitleHeight = 29;

let LastActivePos = 0;

import './layout.css';
export const Layout = ({ children, location, submenu, title, description }: LayoutProperties) => {
  const [mainPath, subPath] = location.pathname.split("/").splice(1);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(LastActivePos);
  const [submenuItems, setSubmenuItems] = React.useState(submenu || []);

  const setActiveMenuPosSave = (value: number) => {
    LastActivePos = value;
    setActiveMenuPos(value);
  }

  const addSubmenuItem = (item: MenuItem) => {
    setSubmenuItems(items => [...items, { ...item, order: items.length }]);
  }

  const menu = getMenuItems();
  const activeMenu = menu.find(x => x.path === mainPath)?.path;
  const activeSubMenu = submenu?.find(x => x.path === subPath)?.path;

  return (
    <div className="layout">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="sidebar">
        <div className="title"><Link to="/">andyvazul</Link></div>
        <div className="menus">
          <Menu items={menu} activeItem={activeMenu} base="" setActiveElementPosition={setActiveMenuPosSave} />
          {submenuItems && submenuItems.length > 0 &&
            <div style={{ paddingTop: activeMenuPos - TitleHeight }}><Menu items={submenuItems} activeItem={activeSubMenu} base={"/" + activeMenu} /></div>}
        </div>
      </div>
      <div className="content" style={{ paddingTop: activeMenuPos }}>
        <SubmenuContext.Provider value={{ addSubmenuItem }}>
          {children}
        </SubmenuContext.Provider>
      </div>
    </div>
  );
};
