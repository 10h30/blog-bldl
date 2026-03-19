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

export type TaxonomyType = "category" | "destination" | "tag";

function isTaxonomyItem(value: unknown): value is TaxonomyItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    (v.parent === undefined || typeof v.parent === "string") &&
    (v.description === undefined || typeof v.description === "string")
  );
}

function buildMap(data: TaxonomyItem[]): TaxonomyMap {
  if (!Array.isArray(data)) {
    throw new Error(`[taxonomy] expected an array but received ${typeof data}`);
  }
  return new Map(
    data.map((item, i) => {
      if (!isTaxonomyItem(item)) {
        throw new Error(
          `[taxonomy] invalid item at index ${i}: ${JSON.stringify(item)}`,
        );
      }
      return [item.slug, item];
    }),
  );
}

const taxonomies: Record<TaxonomyType, TaxonomyMap> = {
  category: buildMap(categoryData as TaxonomyItem[]),
  destination: buildMap(destinationData as TaxonomyItem[]),
  tag: buildMap(tagData as TaxonomyItem[]),
};

export function getTaxonomyMap(type: TaxonomyType): TaxonomyMap {
  if (!(type in taxonomies)) {
    throw new Error(
      `[taxonomy] unknown taxonomy type "${type}". Expected one of: ${Object.keys(taxonomies).join(", ")}`,
    );
  }
  return taxonomies[type];
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
  return `${buildHierarchicalPath(item.parent, map, visited)}/${slug}`;
}

export function getTaxonomyPath(type: TaxonomyType, slug: string): string {
  return buildHierarchicalPath(slug, getTaxonomyMap(type));
}

export function getTaxonomyItem(
  type: TaxonomyType,
  slug: string,
): TaxonomyItem | undefined {
  return getTaxonomyMap(type).get(slug);
}
