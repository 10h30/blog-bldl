import categoryData from "@/content/taxonomies/category.json";
import destinationData from "@/content/taxonomies/destination.json";
import tagData from "@/content/taxonomies/tag.json";

export type TaxonomyItem = {
  slug: string;
  name: string;
  parent?: string;
  description?: string;
};

export type TaxonomyMap = Map<string, TaxonomyItem>;

function buildMap(data: unknown[]): TaxonomyMap {
  return new Map((data as TaxonomyItem[]).map((item) => [item.slug, item]));
}

const taxonomies: Record<string, TaxonomyMap> = {
  category: buildMap(categoryData),
  destination: buildMap(destinationData),
  tag: buildMap(tagData),
};

export function getTaxonomyMap(type: string): TaxonomyMap {
  return taxonomies[type] ?? new Map();
}

export function registerTaxonomy(type: string, data: TaxonomyItem[]): void {
  taxonomies[type] = buildMap(data);
}

function buildHierarchicalPath(
  slug: string,
  map: TaxonomyMap,
  visited = new Set<string>(),
): string {
  if (visited.has(slug)) return slug; // cycle protection
  visited.add(slug);
  const item = map.get(slug);
  if (!item?.parent) return slug;
  return `${buildHierarchicalPath(item.parent, map, new Set(visited))}/${slug}`;
}

export function getTaxonomyPath(type: string, slug: string): string {
  return buildHierarchicalPath(slug, getTaxonomyMap(type));
}

export function getTaxonomyItem(
  type: string,
  slug: string,
): TaxonomyItem | undefined {
  return getTaxonomyMap(type).get(slug);
}

// Convenience aliases kept for backward compatibility
export const categoryMap = getTaxonomyMap("category");
export const destinationMap = getTaxonomyMap("destination");
export const tagMap = getTaxonomyMap("tag");

export const getCategoryPath = (slug: string) =>
  getTaxonomyPath("category", slug);
export const getDestinationPath = (slug: string) =>
  getTaxonomyPath("destination", slug);
export const getTagPath = (slug: string) => getTaxonomyPath("tag", slug);
