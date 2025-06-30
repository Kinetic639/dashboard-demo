import { Tables } from '@/lib/types';
import { LocationTreeItem } from '@/lib/types/location-tree';
import { getLocationProductCountByBranch } from '@/lib/mock/branches';

export function buildLocationTree(locations: Tables<'locations'>[], branchId?: string): LocationTreeItem[] {
  const map = new Map<string, LocationTreeItem>();
  const roots: LocationTreeItem[] = [];

  // First pass: create all nodes
  for (const loc of locations) {
    map.set(loc.id, {
      id: loc.id,
      name: loc.name,
      icon_name: loc.icon_name,
      code: loc.code,
      color: loc.color,
      children: [],
      raw: loc,
      productCount: branchId ? getLocationProductCountByBranch(branchId, loc.id) : 0,
    });
  }

  // Second pass: build the tree structure
  for (const loc of locations) {
    const node = map.get(loc.id)!;
    if (loc.parent_id && map.has(loc.parent_id)) {
      map.get(loc.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children by sort_order
  const sortChildren = (items: LocationTreeItem[]) => {
    items.sort((a, b) => a.raw.sort_order - b.raw.sort_order);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortChildren(item.children);
      }
    });
  };

  sortChildren(roots);
  return roots;
}