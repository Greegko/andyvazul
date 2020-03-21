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

const Padding = 10;

import './layout.css';
export const Layout = ({ children, location, submenu, title, description }: LayoutProperties) => {
  const [mainPath, subPath] = location.pathname.split("/").splice(1);
  const [activeSubmenu, setActiveSubmenu] = React.useState(subPath);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(LastActivePos);
  const [submenuItems, setSubmenuItems] = React.useState(submenu || []);
  const [contentHeight, setContentHeight] = React.useState(null);

  const setActiveMenuPosSave = (value: number) => {
    LastActivePos = value;
    setActiveMenuPos(value);
  }

  const addSubmenuItem = (item: MenuItem) => {
    setSubmenuItems(items => [...items, { ...item, order: items.length }]);
  }

  const menu = getMenuItems();
  const activeMenu = menu.find(x => x.path === mainPath)?.path;

  const submenuRef = React.createRef<HTMLDivElement>();
  const contentRef = React.createRef<HTMLDivElement>();

  const getMenuNodes = () => submenuRef.current.querySelectorAll<HTMLAnchorElement>('ul li a');
  const getContentLinkNodes = () => contentRef.current.querySelectorAll('.submenu-link');
  const y = x => {
    const pos = x.getClientRects()[0];
    return pos ? Math.floor(pos.y) : null;
  }

  React.useEffect(() => {
    if (contentRef.current && submenuRef.current) {
      const submenu = getMenuNodes();
      const lastSubmenu = submenu[submenu.length - 1];

      const links = getContentLinkNodes();
      const lastLink = links[links.length - 1];
      setContentHeight(document.body.clientHeight - y(lastSubmenu) + y(lastLink) - activeMenuPos - Padding);
    }

  }, [submenuItems, activeMenuPos]);

  const scrollToMenuContent = (targetContent, menuOrder) => {
    window.scrollTo(0, y(targetContent) - activeMenuPos - Padding - 19 * menuOrder);
  }

  React.useEffect(() => {
    if (!submenuRef.current) return;

    if (subPath) {
      const submenu = getMenuNodes();
      const menuIndex = Array.from(submenu).findIndex(x => x.href.endsWith("/" + subPath));
      const contentLink = contentRef.current.querySelector('#submenu-' + subPath);
      scrollToMenuContent(contentLink, menuIndex);
    } else {
      scrollLocationCheck();
    }
  }, [location.pathname]);

  const scrollLocationCheck = () => {
    if (!submenuRef.current) return;

    const submenus = getMenuNodes();
    const contents = getContentLinkNodes();

    const menuIndex = Math.max(0, Array.from(contents).filter((x, index) => y(x) <= y(submenus[index])).length - 1);
    const menuHref = submenus[menuIndex].attributes.getNamedItem('href').nodeValue;
    const submenuPart = menuHref.split('/')[2];

    if (submenuPart !== activeSubmenu) {
      setActiveSubmenu(submenuPart);
    }

    window.history.pushState({}, null, menuHref);
  };

  React.useEffect(() => {
    if (submenuRef.current) {
      window.addEventListener('scroll', scrollLocationCheck, true);
      return () => window.removeEventListener('scroll', scrollLocationCheck, true);
    }
  });

  return (
    <div className="layout">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className={"sidebar" + (submenuItems.length > 0 ? " sidebar--submenu" : "")}>
        <div className="sidebar-content">
          <div className="title"><Link to="/">andyvazul</Link></div>
          <div className="menus">
            <Menu items={menu} activeItem={activeMenu} base="" setActiveElementPosition={setActiveMenuPosSave} />
            {submenuItems.length > 0 &&
              <div ref={submenuRef} className="submenu" style={{ paddingTop: activeMenuPos - TitleHeight }}>
                <Menu items={submenuItems} activeItem={activeSubmenu} base={"/" + activeMenu} />
              </div>
            }
          </div>
        </div>
      </div>
      <div ref={contentRef} className="content" style={{ paddingTop: activeMenuPos }}>
        <SubmenuContext.Provider value={{ addSubmenuItem }}>
          <div className="content-body" style={{ minHeight: contentHeight }}>
            {children}
          </div>
        </SubmenuContext.Provider>
      </div>
    </div>
  );
};
