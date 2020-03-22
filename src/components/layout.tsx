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

const Padding = 10;

import './layout.css';
export const Layout = ({ children, location, submenu, title, description }: LayoutProperties) => {
  const [mainMenuPath, submenuPath] = location.pathname.split("/").splice(1);

  const [menuItems] = React.useState<MenuItem[]>(getMenuItems());
  const [activeSubmenu, setActiveSubmenu] = React.useState<string>(() => submenuPath);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(0);
  const [submenuItems, setSubmenuItems] = React.useState<MenuItem[]>(() => submenu || []);
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const [contentLinks, setContentLinks] = React.useState<HTMLElement[]>([]);
  const [submenuLinks, setSubmenuLinks] = React.useState<HTMLLinkElement[]>([]);

  const addSubmenuItem = (item: MenuItem) => setSubmenuItems(items => [...items, { ...item, order: items.length }]);

  const submenuRef = React.useCallback(node => {
    if (!node) return;

    const links = [...node.querySelectorAll('ul li a')] as HTMLLinkElement[];
    setSubmenuLinks(links);
  }, [children, submenuItems]);

  const contentRef = React.useCallback(node => {
    if (!node) return;

    const links = [...node.querySelectorAll('.submenu-link')] as HTMLElement[];
    setContentLinks(links);
  }, [children]);

  const y = x => {
    const pos = x.getClientRects()[0];
    return pos ? Math.floor(pos.y) : null;
  }

  React.useEffect(() => {
    if (activeMenuPos === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const lastSubmenu = submenuLinks[submenuLinks.length - 1];
    const lastLink = contentLinks[contentLinks.length - 1];
    const pos = document.body.clientHeight - y(lastSubmenu) + lastLink.offsetTop - activeMenuPos - Padding;
    setContentHeight(pos);
  }, [activeMenuPos, contentLinks, submenuLinks]);

  React.useEffect(() => {
    if (activeMenuPos === 0) return;
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;
    if (!submenuPath) return;

    const menuIndex = submenuLinks.findIndex(x => x.href.endsWith("/" + submenuPath));
    const contentLink = contentLinks.find(x => x.id === 'submenu-' + submenuPath);
    const pos = contentLink.offsetTop - activeMenuPos - Padding - 19 * menuIndex;
    window.scrollTo(0, pos);
  }, [location.pathname, submenuPath, submenuLinks, contentLinks, contentHeight]);

  React.useEffect(() => {
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const scrollLocationCheck = () => {
      const menuIndex = Math.max(0, contentLinks.filter((x, index) => y(x) <= y(submenuLinks[index])).length - 1);
      const menuHref = submenuLinks[menuIndex].attributes.getNamedItem('href').nodeValue;
      const submenuPart = menuHref.split('/')[2];

      if (submenuPart !== activeSubmenu) {
        setActiveSubmenu(submenuPart);
      }

      window.history.pushState({}, null, menuHref);
    };

    window.addEventListener('scroll', scrollLocationCheck, true);
    return () => window.removeEventListener('scroll', scrollLocationCheck, true);
  }, [submenuLinks, contentLinks, contentHeight, activeSubmenu]);

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
            <Menu items={menuItems} activeItem={mainMenuPath} base="" setActiveElementPosition={setActiveMenuPos} />
            {submenuItems.length > 0 &&
              <div ref={submenuRef} className="submenu" style={{ paddingTop: activeMenuPos - TitleHeight }}>
                <Menu items={submenuItems} activeItem={activeSubmenu} base={"/" + mainMenuPath} />
              </div>
            }
          </div>
        </div>
      </div>
      <div ref={contentRef} className="content" style={{ paddingTop: activeMenuPos }}>
        <SubmenuContext.Provider value={{ addSubmenuItem }}>
          <div className="content-body" style={{ height: contentHeight }}>
            {children}
          </div>
        </SubmenuContext.Provider>
      </div>
    </div>
  );
};
