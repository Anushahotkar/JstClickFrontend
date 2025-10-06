// stockRoutesNavigation.js
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant';

const ROOT_STOCK_MANAGEMENT = '/stock-management';

const path = (root, item) => `${root}${item}`;

export const stockRoutesNavigation = {
  id: 'stock-management',
  type: NAV_TYPE_ROOT,
  path: ROOT_STOCK_MANAGEMENT,
  title: 'Stock Management',
  transKey: 'Stock Management',
  Icon: Squares2X2Icon,
  childs: [
    {
      id: 'stock-management.inventory',
      path: path(ROOT_STOCK_MANAGEMENT, '/stock'),
      type: NAV_TYPE_ITEM,
      title: 'Stock Management',
      transKey: 'Stock Management',
      Icon: Squares2X2Icon,
    },
   
  ],
};