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
  const [mainMenuPath, submenuPath, projectPath] = location.pathname.split("/").splice(1);

  const [activeSubmenu, setActiveSubmenu] = React.useState<string>(() => submenuPath);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(0);
  const [submenuMenuPos, setSubmenuMenuPos] = React.useState<number>(0);
  const [submenuItems, setSubmenuItems] = React.useState<MenuItem[]>(() => submenu || []);

  const addSubmenuItem = (item: MenuItem) => setSubmenuItems(items => [...items, { ...item, order: items.length }]);

  const displayCoreProperties: LayoutDisplayCore = {
    title,
    description,
    submenuItems,
    mainMenuPath,
    contentPadding: submenuMenuPos || activeMenuPos,
    activeSubmenu,
    menuPadding: activeMenuPos,
    children,
    setActiveMenuPos,
    setSubmenuMenuPos,
  }

  const layoutContent = projectPath ?
    <LayoutDisplay {...displayCoreProperties} /> :
    <LayoutSubmenuScroll
      {...displayCoreProperties}
      activeMenuPos={activeMenuPos}
      setActiveSubmenu={setActiveSubmenu}
      submenuPath={submenuPath}
    />

  return (
    <SubmenuContext.Provider value={{ addSubmenuItem }}>
      {layoutContent}
    </SubmenuContext.Provider>
  );
};

interface LayoutSubmenuScrollProperties {
  activeMenuPos;
  setActiveSubmenu;
  submenuPath;
}

const LayoutSubmenuScroll = (props: LayoutSubmenuScrollProperties & LayoutDisplayCore) => {
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const [contentLinks, setContentLinks] = React.useState<HTMLElement[]>([]);
  const [submenuLinks, setSubmenuLinks] = React.useState<HTMLLinkElement[]>([]);

  const submenuRef = React.useCallback(node => {
    if (!node) return;

    const links = [...node.querySelectorAll('ul li a')] as HTMLLinkElement[];
    setSubmenuLinks(links);

    if (!props.activeSubmenu) {
      const menuHref = links[0].attributes.getNamedItem('href').nodeValue;
      const submenuPart = menuHref.split('/')[2];
      props.setActiveSubmenu(submenuPart);
    }
  }, [props.children, props.submenuItems]);

  const contentRef = React.useCallback(node => {
    if (!node) return;

    const links = [...node.querySelectorAll('.submenu-link')] as HTMLElement[];
    setContentLinks(links);
  }, [props.children]);

  const y = x => {
    const pos = x.getClientRects()[0];
    return pos ? Math.floor(pos.y) : null;
  }

  React.useEffect(() => {
    if (props.activeMenuPos === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const lastSubmenu = submenuLinks[submenuLinks.length - 1];
    const lastLink = contentLinks[contentLinks.length - 1];
    const pos = document.body.clientHeight - y(lastSubmenu) + lastLink.offsetTop - props.activeMenuPos - Padding;
    setContentHeight(pos);
  }, [props.activeMenuPos, contentLinks, submenuLinks]);

  React.useEffect(() => {
    if (props.activeMenuPos === 0) return;
    if (!props.submenuPath) return;
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const menuIndex = submenuLinks.findIndex(x => x.href.endsWith("/" + props.submenuPath));
    const contentLink = contentLinks.find(x => x.id === 'submenu-' + props.submenuPath);
    const pos = contentLink ? (contentLink.offsetTop - props.activeMenuPos - Padding - 19 * menuIndex) : 0;
    window.scrollTo(0, pos);
  }, [props.submenuPath, submenuLinks, contentLinks, contentHeight]);

  React.useEffect(() => {
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const scrollLocationCheck = () => {
      const menuIndex = Math.max(0, contentLinks.filter((x, index) => y(x) <= y(submenuLinks[index])).length - 1);
      const menuHref = submenuLinks[menuIndex].attributes.getNamedItem('href').nodeValue;
      const submenuPart = menuHref.split('/')[2];

      if (submenuPart !== props.activeSubmenu) {
        props.setActiveSubmenu(submenuPart);
      }

      window.history.pushState({}, null, menuHref);
    };

    window.addEventListener('scroll', scrollLocationCheck, true);
    return () => window.removeEventListener('scroll', scrollLocationCheck, true);
  }, [submenuLinks, contentLinks, contentHeight, props.activeSubmenu]);

  return <LayoutDisplay
    {...props}
    submenuRef={submenuRef}
    contentRef={contentRef}
    contentHeight={contentHeight}
  />;
}

interface LayoutDisplayCore {
  title;
  description;
  submenuItems;
  mainMenuPath;
  setActiveMenuPos;
  contentPadding;
  activeSubmenu;
  menuPadding;
  setSubmenuMenuPos;
  children;
}

interface LayoutDisplayScroll {
  submenuRef?;
  contentRef?;
  contentHeight?;
}

const LayoutDisplay = (props: LayoutDisplayCore & LayoutDisplayScroll) => {
  const [menuItems] = React.useState<MenuItem[]>(getMenuItems());

  return (
    <div className="layout">
      <Helmet>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Helmet>
      <div className={"sidebar" + (props.submenuItems.length > 0 ? " sidebar--submenu" : "")}>
        <div className="sidebar-content">
          <div className="title"><Link to="/">andyvazul</Link></div>
          <div className="menus">
            <Menu items={menuItems} activeItem={props.mainMenuPath} base="" setActiveElementPosition={props.setActiveMenuPos} />
            {props.submenuItems.length > 0 &&
              <div ref={props.submenuRef} className="submenu" style={{ paddingTop: props.menuPadding - TitleHeight }}>
                <Menu items={props.submenuItems} activeItem={props.activeSubmenu} base={"/" + props.mainMenuPath} setActiveElementPosition={props.setSubmenuMenuPos} />
              </div>
            }
          </div>
        </div>
      </div>
      <div ref={props.contentRef} className="content" style={{ paddingTop: props.contentPadding }}>
        <div className="content-body" style={{ height: props.contentHeight }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
