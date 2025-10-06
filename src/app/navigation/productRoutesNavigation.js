// src/app/pages/products/productRoutesNavigation.js

import { CubeIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant';

const ROOT_PRODUCTS = '/products';

const path = (root, item) => `${root}${item}`;

export const productRoutesNavigation = {
  id: 'products',
  type: NAV_TYPE_ROOT,
  path: ROOT_PRODUCTS,
  title: 'Products',
  transKey: 'Products',
  Icon: CubeIcon,
  childs: [
    {
      id: 'products.orders',
      path: path(ROOT_PRODUCTS, '/orders'),
      type: NAV_TYPE_ITEM,
      title: 'Product Orders',
      transKey: 'Product Orders',
      Icon: ClipboardDocumentIcon,
    },
    {
      id: 'products.list',
      path: path(ROOT_PRODUCTS, '/list'),
      type: NAV_TYPE_ITEM,
      title: 'Product List',
      transKey: 'Product Sellers',
      Icon: CubeIcon,
    },
  ],
};
