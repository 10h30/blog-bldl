import { visit } from "unist-util-visit";

const IG_REGEX = /https?:\/\/(?:www\.)?instagram\.com\/p\/([\w-]+)\/?/;

export function remarkInstagram() {
  return (tree) => {
    let hasEmbed = false;

    visit(tree, "paragraph", (node, index, parent) => {
      if (node.children.length !== 1) return;
      const child = node.children[0];
      const url = child.type === "link" ? child.url : child.value;
      const match = url?.match(IG_REGEX);
      if (!match) return;

      const postId = match[1];
      const permalink = `https://www.instagram.com/p/${postId}/`;

      hasEmbed = true;
      parent.children.splice(index, 1, {
        type: "html",
        value: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${permalink}?utm_source=ig_embed" data-instgrm-version="14" style="max-width:540px;min-width:326px;width:100%;margin:1px auto;"></blockquote>`,
      });
    });

    // Thêm embed.js một lần duy nhất nếu có Instagram embed
    if (hasEmbed) {
      tree.children.push({
        type: "html",
        value: `<script async src="//www.instagram.com/embed.js"><\/script>`,
      });
    }
  };
}
