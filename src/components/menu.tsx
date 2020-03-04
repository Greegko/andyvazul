import * as React from "react";
import { MenuItem } from "../queries";
import { Link } from "gatsby";

interface MenuProperties {
  items: MenuItem[];
  activeItem: string;
  base: string;
}

import "./menu.css";
export const Menu = ({ items, activeItem, base = '/' }: MenuProperties) => (
  <div className="menu">
    <ul className="main-menu">
      {items.sort((x, y) => x.order > y.order ? 1 : -1).map(({ path, title }) =>
        <li
          key={path}
          className={path === activeItem ? "menu-item-active" : ""}>
          <Link to={base + "/" + path}>{title}</Link>
        </li>
      )}
    </ul>
  </div >
);
