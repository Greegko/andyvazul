import * as React from 'react';
import rehypeReact from "rehype-react";

import { SubmenuItem } from '../components/content';
import { Stern } from '../components/stern';
import { ListProjectsByGroup } from '../components/list-projects-by-group';
import { ListProjectGroups } from '../components/list-project-groups';

export const render = new rehypeReact({
  createElement: React.createElement,
  components: {
    "submenu-item": SubmenuItem,
    "stern": Stern,
    "list-projects-by-group": ListProjectsByGroup,
    "list-project-groups": ListProjectGroups
  }
}).Compiler;
