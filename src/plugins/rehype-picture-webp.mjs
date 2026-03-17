import { visit } from "unist-util-visit";

export function rehypePictureWebp() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index == null) return;

      const src = node.properties?.src || "";

      // Chỉ xử lý ảnh từ R2
      if (!src.includes("media.balodeplao.com")) return;
      if (!/\.(jpe?g|png)$/i.test(src)) return;

      /* const webpSrc = src.replace(/\.(jpe?g|png)$/i, ".webp"); */

      // Wrap <img> thành <picture> với WebP source + fallback
      parent.children[index] = {
        type: "element",
        tagName: "picture",
        properties: {},
        children: [
          /*  {
            type: "element",
            tagName: "source",
            properties: { type: "image/webp", srcSet: webpSrc },
            children: [],
          }, */
          {
            ...node,
            properties: {
              ...node.properties,
              loading: "lazy",
              decoding: "async",
            },
          },
        ],
      };
    });
  };
}
