import { lazy, ReactNode } from "react";
import { Action, Resource } from "@shared/types";
import { IconsName } from "@/design-system/types";

interface Route {
  path: string;
  displayName?: string;
  icon?: IconsName;
  entryPage: ReactNode;
  shouldDisplay: boolean;
  resource?: Resource;
  action?: Action;
}

interface RouteGroup {
  groupName: string;
  shoudDisplay?: boolean;
  routes: Route[];
}

const Vehicles = lazy(
  () => import("@/domains/vehicles/components/VehiclesPage")
);
const Users = lazy(() => import("@/domains/users/components/UsersPage"));
const NewUser = lazy(() => import("@/domains/users/components/NewUsersPage"));
const EditUser = lazy(() => import("@/domains/users/components/EditUserPage"));
const Profile = lazy(() => import("@/domains/profile/components/ProfilePage"));
const EditProfile = lazy(() => import("@/domains/profile/components/EditProfilePage"));
const Branches = lazy(
  () => import("@/domains/branches/components/BranchesPage")
);
const Audit = lazy(() => import("@/domains/audit/components/AuditPage"));
const NotFound = lazy(() => import("@/domains/global/components/NotFoundPage"));

const Sign = lazy(() => import("@/domains/sign/components/SignPage"));

export const privateRoutes: RouteGroup[] = [
  {
    groupName: "Cadastros",
    shoudDisplay: true,
    routes: [
      {
        path: "/users",
        displayName: "Usuários",
        icon: "Person",
        entryPage: <Users />,
        shouldDisplay: true,
        action: "READ",
        resource: "USERS",
      },
      {
        path: "/users/new",
        entryPage: <NewUser />,
        shouldDisplay: false,
        action: "CREATE",
        resource: "USERS",
      },
      {
        path: "/users/edit/:userId",
        entryPage: <EditUser />,
        shouldDisplay: false,
        action: "UPDATE",
        resource: "USERS",
      },
      {
        path: "/vehicles",
        displayName: "Veículos",
        icon: "DirectionsCar",
        entryPage: <Vehicles />,
        shouldDisplay: true,
      },
      {
        path: "/branches",
        displayName: "Filiais",
        icon: "Store",
        entryPage: <Branches />,
        shouldDisplay: true,
      },
    ],
  },
  {
    groupName: "Configurações",
    shoudDisplay: true,
    routes: [
      {
        path: "/profile",
        displayName: "Perfil",
        icon: "Settings",
        entryPage: <Profile />,
        shouldDisplay: true,
      },
      {
        path: "/profile/edit",
        entryPage: <EditProfile />,
        shouldDisplay: false,
      },
    ],
  },
  {
    groupName: "Outros",
    shoudDisplay: true,
    routes: [
      {
        path: "/audit",
        displayName: "Auditoria",
        icon: "VerifiedUser",
        entryPage: <Audit />,
        shouldDisplay: true,
      },
    ],
  },
];

export const publicRoutes: RouteGroup[] = [
  {
    groupName: "*",
    shoudDisplay: false,
    routes: [
      {
        path: "/",
        entryPage: <Sign />,
        shouldDisplay: false,
      },
      {
        path: "*",
        entryPage: <NotFound />,
        shouldDisplay: false,
      },
    ],
  },
];
