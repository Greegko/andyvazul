import * as React from 'react';
import rehypeReact from "rehype-react";

import { SubmenuItem } from '../components/content';

export const render = new rehypeReact({
  createElement: React.createElement,
  components: { "submenu-item": SubmenuItem }
}).Compiler;
