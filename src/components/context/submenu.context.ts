import * as React from 'react';
import { MenuItem } from "../../queries";

export const SubmenuContext = React.createContext<{ addSubmenuItem: (item: MenuItem) => void }>({} as any);
