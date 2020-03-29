import * as React from "react";
import { MenuItem } from "../queries";
import { Link } from "gatsby";

interface MenuProperties {
  items: MenuItem[];
  activeItem: string;
  base: string;
  padding: number;
  setActiveElementPosition?: (pos: number) => void;
}

import "./menu.scss";
export const Menu = ({ items, activeItem, base = '/', setActiveElementPosition, padding }: MenuProperties) => {
  const activeMenuItemRef = React.useCallback<(node: HTMLLIElement) => void>(node => {
    if (!node) return;

    console.log(activeItem, node.offsetTop);

    setActiveElementPosition(node.offsetTop);
  }, [padding]);

  return (
    <ul className="menu-block" style={{ paddingTop: padding }}>
      {items.sort(sorter).map(({ path, title }) =>
        <li
          key={path}
          ref={path === activeItem ? activeMenuItemRef : undefined}
          className={path === activeItem ? "menu-block-item-active" : ""}>
          <Link to={base + "/" + path}>{title}</Link>
        </li>
      )}
    </ul>
  );
}

function sorter(x: MenuItem, y: MenuItem): number {
  if (x.order === y.order) {
    return x.title > y.title ? 1 : -1;
  }

  return x.order > y.order ? 1 : -1;
}
