import { ModuleConfig } from "@/lib/types/module";

export const ORG_MODULE_THEME_COLOR = "#6366f1"; // Indigo – always used as default

export const orgManagementModule: ModuleConfig = {
  id: "org-management",
  slug: "org-management",
  title: "Zarządzanie organizacją",
  description: "Panel administracyjny do zarządzania organizacją, użytkownikami i uprawnieniami",
  color: ORG_MODULE_THEME_COLOR, // indigo
  items: [
    {
      id: "organization-profile",
      label: "Profil organizacji",
      path: "/dashboard/organization/profile",
      icon: "Building2",
      type: "link",
    },
    {
      id: "branches",
      label: "Oddziały",
      path: "/dashboard/organization/branches",
      icon: "MapPin",
      type: "link",
    },
    {
      id: "users",
      label: "Użytkownicy",
      path: "/dashboard/organization/users",
      icon: "Users",
      type: "group",
      submenu: [
        {
          id: "user-list",
          label: "Lista użytkowników",
          path: "/dashboard/organization/users/list",
          icon: "List",
          type: "link",
        },
        {
          id: "roles",
          label: "Role i uprawnienia",
          path: "/dashboard/organization/users/roles",
          icon: "Shield",
          type: "link",
        },
      ],
    },
  ],
};

export async function getOrganizationModule() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return orgManagementModule;
}