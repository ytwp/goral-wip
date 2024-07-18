import { RouteProps } from "react-router-dom";
import { AccessControlStore, Role } from "@/store";
import { Path } from "@/constant";
import { Dashboard } from './components/dashboard';
import { Query } from './components/query';
import { Setting } from './components/setting';


export interface SubItemItem {
  routeProps: RouteProps,
  roles: Role[]
}

export interface SubRouterItem {
  itemKey?: string;
  items: (SubItemItem)[],
  routeProps?: RouteProps,
  roles: Role[]
}

export interface RouterItem {
  itemKey?: string;
  items?: (SubItemItem)[],
  routeProps: RouteProps,
  roles: Role[]
}

export type RouterItems = (RouterItem | SubRouterItem)[]

export const routers: RouterItems = [
  {
    itemKey: 'dashboard',
    roles: [],
    routeProps: {
      path: Path.Dashboard,
      element: < Dashboard />
    },
  },
  {
    itemKey: 'query',
    roles: [],
    routeProps: {
      path: Path.Query,
      element: < Query />
    },
  },
  {
    itemKey: 'setting',
    roles: [],
    routeProps: {
      path: Path.Setting,
      element: < Setting />
    },
  },
]

export const routersMapper: Record<string | number, RouterItem | SubRouterItem> = routers.reduce((mapper, item) => {
  if (item.itemKey && item.routeProps && item.routeProps.path) {
    mapper[item.itemKey] = item;
    mapper[item.routeProps.path] = item;
  }
  return mapper;
}, {} as Record<string | number, RouterItem | SubRouterItem>);

export function hasPagePermission(router: RouterItem | SubRouterItem, access: AccessControlStore): boolean {
  let parentHasPermission = true;
  if (router.items == undefined) {
    // First level menu
    if (router.roles.length != 0) {
      parentHasPermission = router.roles.some(role => access.hasRole(role));
    }
  } else {
    // Second level menu
    router.items = router.items.filter(item => {
      let chilnHasPermission = true;
      if (item.roles.length != 0) {
        chilnHasPermission = item.roles.some(role => access.hasRole(role));
      }
      return chilnHasPermission;
    });
    parentHasPermission = router.items.length != 0;
  }
  return parentHasPermission;
}
