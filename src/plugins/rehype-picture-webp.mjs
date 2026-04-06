import { visit } from "unist-util-visit";

export function rehypePictureWebp() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "img") return;
      if (!parent || index == null) return;

      const alt = node.properties?.alt || node.alt || "";
      const pictureNode = {
        type: "element",
        tagName: "picture",
        properties: {},
        children: [
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

      if (alt) {
        parent.children[index] = {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [
            pictureNode,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: alt }],
            },
          ],
        };
      } else {
        parent.children[index] = pictureNode;
      }
    });
  };
}
