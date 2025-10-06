import { WrenchScrewdriverIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant';

const ROOT_SERVICES = '/services';

const path = (root, item) => `${root}${item}`;

export const serviceRoutesNavigation = {
  id: 'services',
  type: NAV_TYPE_ROOT,
  path: ROOT_SERVICES,
  title: 'Services',
  transKey: 'Services',
  Icon: WrenchScrewdriverIcon,
  childs: [
    {
      id: 'services.orders',
      path: path(ROOT_SERVICES, '/orders'),
      type: NAV_TYPE_ITEM,
      title: 'Service Orders',
      transKey: 'Service Orders',
      Icon: WrenchScrewdriverIcon,
    },
    {
      id: 'services.list',
      path: path(ROOT_SERVICES, '/list'),
      type: NAV_TYPE_ITEM,
      title: 'Service List',
      transKey: 'Service Providers',
      Icon: Cog6ToothIcon,
    },
  ],
};
