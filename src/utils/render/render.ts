import * as React from 'react';
import rehypeReact from "rehype-react";

import { SubmenuItem, ProjectGroup } from '../../components/content';
import { Stern } from '../../components/stern';
import { ListProjectsByGroup } from '../../components/list-projects-by-group';
import { ListProjectGroups } from '../../components/list-project-groups';
import { divRender } from './div-render';

export const render = new rehypeReact({
  createElement: React.createElement,
  components: {
    "submenu-item": SubmenuItem,
    "stern": Stern,
    "list-projects-by-group": ListProjectsByGroup,
    "list-project-groups": ListProjectGroups,
    "projectgroup": ProjectGroup,
    "div": divRender
  }
}).Compiler;

