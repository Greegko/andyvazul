import { useStaticQuery, graphql } from "gatsby";
import { urlFriendly } from "../utils";

export interface MenuItem {
  order: number;
  path: string;
  title: string;
}

export function getMenuItems(): MenuItem[] {
  const MenuQuery = useStaticQuery(graphql`
  query ContentfulMenu {
    allContentfulMenu {
      nodes {
        title,
        order
      }
    }
  }
  `);

  return MenuQuery.allContentfulMenu.nodes.map(x => ({ ...x, path: urlFriendly(x.title) }));
}
