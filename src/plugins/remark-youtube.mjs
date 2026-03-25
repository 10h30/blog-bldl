import { visit } from "unist-util-visit";

const YT_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function remarkYouTube() {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== "link" && child.type !== "text") return;

      const url = child.type === "link" ? child.url : child.value;
      const match = url?.match(YT_REGEX);
      if (!match) return;

      const videoId = match[1];
      parent.children.splice(index, 1, {
        type: "html",
        value: `<lite-youtube videoid="${videoId}" style="background-image:url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg')"><a href="https://youtube.com/watch?v=${videoId}" class="lyt-playbtn" title="Play Video"><span class="lyt-visually-hidden">Play Video</span></a></lite-youtube>`,
      });
    });
  };
}
