import { visit } from "unist-util-visit";
import { R2_BASE } from "../config/r2.mjs";

const WIDTHS = [480, 800, 1200];
const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px";

function buildTransformUrl(src, width) {
  // Extract path từ full URL
  const path = src.replace(R2_BASE, "");
  return `${R2_BASE}/cdn-cgi/image/width=${width},format=auto,onerror=redirect${path}`;
}

export function rehypePictureWebp() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index == null) return;

      const src = node.properties?.src || "";

      // Chỉ xử lý ảnh từ R2
      if (!src.startsWith(R2_BASE)) return;

      // Tạo srcset với nhiều width
      const srcset = WIDTHS.map(
        (w) => `${buildTransformUrl(src, w)} ${w}w`,
      ).join(", ");

      const defaultSrc = buildTransformUrl(src, 800);

      parent.children[index] = {
        type: "element",
        tagName: "picture",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "source",
            properties: {
              type: "image/webp",
              srcSet: srcset,
              sizes: SIZES,
            },
            children: [],
          },
          {
            ...node,
            properties: {
              ...node.properties,
              src: defaultSrc,
              srcSet: srcset,
              sizes: SIZES,
              loading: "lazy",
              decoding: "async",
            },
          },
        ],
      };
    });
  };
}
