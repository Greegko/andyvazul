import * as React from 'react';
import { Menu } from './menu';
import { getMenuItems, MenuItem } from '../queries';
import { Helmet } from 'react-helmet';
import { SubmenuContext } from '../components/context';

interface LayoutProperties {
  children: any;
  location: any;
  title: string;
  description: string;
  displayAsBlock?: boolean;
  submenu?: MenuItem[];
  subsubmenu?: MenuItem[];
}

const Padding = 20;

import './custom-content-style.scss';
import './layout.scss';
export const Layout = ({ children, location, submenu, subsubmenu, title, description, displayAsBlock }: LayoutProperties) => {
  const [mainMenuPath, submenuPath, projectPath] = location.pathname.split("/").splice(1);

  const [activeSubmenu, setActiveSubmenu] = React.useState<string>(() => submenuPath);
  const [activeSubSubmenu] = React.useState<string>(() => projectPath);
  const [activeMenuPos, setActiveMenuPos] = React.useState<number>(0);
  const [submenuMenuPos, setSubmenuMenuPos] = React.useState<number>(0);
  const [subsubmenuMenuPos, setSubSubmenuMenuPos] = React.useState<number>(0);
  const [submenuItems, setSubmenuItems] = React.useState<MenuItem[]>(() => submenu || []);
  const [subsubmenuItems] = React.useState<MenuItem[]>(() => subsubmenu || []);

  const addSubmenuItem = (item: MenuItem) => setSubmenuItems(items => [...items, { ...item, order: items.length }]);

  const displayCoreProperties: LayoutDisplayCore = {
    displayAsBlock,
    title,
    description,
    submenuItems,
    subsubmenuItems,
    mainMenuPath,
    contentPadding: projectPath ? (subsubmenuMenuPos || activeMenuPos) : activeMenuPos,
    activeSubmenu,
    activeSubSubmenu,
    setSubSubmenuMenuPos,
    menuPadding: activeMenuPos,
    subMenuPadding: submenuMenuPos,
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

const getNextVisibleElement = (node: HTMLLinkElement): HTMLElement => {
  let next = node.nextElementSibling ? node.nextElementSibling as HTMLElement : node.parentElement.nextElementSibling as HTMLElement;

  while (!next.offsetParent) {
    next = next.nextElementSibling as HTMLElement;
  }

  return next;
}

const LayoutSubmenuScroll = (props: LayoutSubmenuScrollProperties & LayoutDisplayCore) => {
  const [contentHeight, setContentHeight] = React.useState<number>(0);
  const [contentLinks, setContentLinks] = React.useState<HTMLLinkElement[]>([]);
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

    const links = [...node.querySelectorAll('.submenu-link')] as HTMLLinkElement[];
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
    const pos = document.body.clientHeight + getNextVisibleElement(lastLink).offsetTop - lastSubmenu.offsetTop - Padding;
    setContentHeight(pos);
  }, [props.activeMenuPos, contentLinks, submenuLinks]);

  React.useEffect(() => {
    if (!props.submenuPath) return;
    if (!props.contentPadding) return;
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;

    const submenu = submenuLinks.find(x => x.getAttribute('href').endsWith("/" + props.submenuPath));
    const menuPadding = submenu.offsetTop ? submenu.offsetTop : props.activeMenuPos;
    const contentLink = contentLinks.find(x => x.id === 'submenu-' + props.submenuPath);
    const pos = contentLink ? (getNextVisibleElement(contentLink).offsetTop - (menuPadding - props.contentPadding)) : 0;
    window.scrollTo(0, pos);
  }, [props.contentPadding, props.submenuPath, submenuLinks, contentLinks, contentHeight]);

  React.useEffect(() => {
    if (contentHeight === 0) return;
    if (contentLinks.length === 0) return;
    if (submenuLinks.length === 0) return;

    const scrollLocationCheck = () => {
      const menuIndex = Math.max(0, contentLinks.map(getNextVisibleElement).filter((x, index) => y(x) <= y(submenuLinks[index])).length - 1);
      const menuHref = submenuLinks[menuIndex].attributes.getNamedItem('href').nodeValue;
      const submenuPart = menuHref.split('/')[2];

      if (submenuPart !== props.activeSubmenu) {
        props.setActiveSubmenu(submenuPart);
        window.history.pushState({}, null, menuHref);
      }
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
  displayAsBlock;
  title;
  description;
  submenuItems;
  subsubmenuItems;
  mainMenuPath;
  setActiveMenuPos;
  contentPadding;
  activeSubmenu;
  menuPadding;
  subMenuPadding;
  activeSubSubmenu;
  setSubSubmenuMenuPos;
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

  const menuItemsWithTitle: MenuItem[] = [{ path: "/", title: "andyvazul", order: 0, style: { marginBottom: 30 } }, ...menuItems];

  return (
    <div className={"layout" + (props.displayAsBlock ? " layout-block" : "")}>
      <Helmet>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Helmet>
      <div className={"sidebar" + (props.submenuItems.length > 0 ? " sidebar--submenu" : "")}>
        <div className="sidebar-content">
          <div className="menu">
            <Menu items={menuItemsWithTitle} activeItem={props.mainMenuPath} base="" setActiveElementPosition={props.setActiveMenuPos} padding={0} />
            {props.submenuItems.length > 0 &&
              <div ref={props.submenuRef} className="submenu">
                <Menu items={props.submenuItems}
                  activeItem={props.activeSubmenu}
                  base={"/" + props.mainMenuPath}
                  setActiveElementPosition={props.setSubmenuMenuPos}
                  padding={props.menuPadding} />
              </div>
            }
            {props.subsubmenuItems.length > 0 &&
              <div ref={props.submenuRef} className="subsubmenu">
                <Menu items={props.subsubmenuItems}
                  activeItem={props.activeSubSubmenu}
                  base={"/" + props.mainMenuPath + "/" + props.activeSubmenu}
                  setActiveElementPosition={props.setSubSubmenuMenuPos}
                  padding={props.subMenuPadding} />
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
