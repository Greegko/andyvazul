import * as React from "react";
import { MenuItem } from "../queries";
import { Link } from "gatsby";

interface MenuProperties {
  items: MenuItem[];
  activeItem: string;
  base: string;
  setActiveElementPosition?: (pos: number) => void;
}

import "./menu.css";
export const Menu = ({ items, activeItem, base = '/', setActiveElementPosition }: MenuProperties) => {
  const activeMenuItemRef = React.createRef<HTMLLIElement>();

  if (setActiveElementPosition) {
    React.useEffect(() => {
      if (activeMenuItemRef.current) {
        const rect = activeMenuItemRef.current.getBoundingClientRect();
        setActiveElementPosition(rect.y - rect.height);
      } else {
        setActiveElementPosition(0);
      }
    }, []);
  }

  return (
    <div className="menu">
      <ul className="main-menu">
        {items.sort((x, y) => x.order > y.order ? 1 : -1).map(({ path, title }) =>
          <li
            key={path}
            ref={path === activeItem ? activeMenuItemRef : undefined}
            className={path === activeItem ? "menu-item-active" : ""}>
            <Link to={base + "/" + path}>{title}</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
