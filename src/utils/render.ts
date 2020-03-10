import * as React from 'react';
import rehypeReact from "rehype-react";

import { SubmenuItem } from '../components/content';
import { Stern } from '../components/stern';

export const render = new rehypeReact({
  createElement: React.createElement,
  components: { "submenu-item": SubmenuItem, "stern": Stern }
}).Compiler;
