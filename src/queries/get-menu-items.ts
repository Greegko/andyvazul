import { useStaticQuery, graphql } from "gatsby";
import { urlFriendly } from "../utils";

export interface MenuItem {
  title: string;
  path: string;
  style?: object;
  order?: number;
}

export function getMenuItems(): MenuItem[] {
  const MenuQuery = useStaticQuery(graphql`
  query ContentfulMenu {
    allContentfulMenu {
      nodes {
        title,
        order,
        page {
          slug
        }
      }
    }
  }
  `);

  return MenuQuery.allContentfulMenu.nodes.map(x => ({ ...x, path: x.page ? urlFriendly(x.page.slug) : urlFriendly(x.title) }));
}
