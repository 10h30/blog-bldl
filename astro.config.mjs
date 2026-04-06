import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import remarkReadingTime from "remark-reading-time";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { remarkR2Images } from "./src/plugins/remark-r2-images.mjs";
import { rehypePictureWebp } from "./src/plugins/rehype-picture-webp.mjs";
import { remarkYouTube } from "./src/plugins/remark-youtube.mjs";
import { remarkInstagram } from "./src/plugins/remark-instagram.mjs";

export default defineConfig({
  site: "https://balodeplao.com/",
  integrations: [sitemap(), icon(), mdx()],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      () => {
        return function (tree, file) {
          file.data.astro.frontmatter.minutesRead =
            file.data.readingTime.minutes;
        };
      },
      remarkR2Images,
      remarkYouTube,
      remarkInstagram,
    ],
    rehypePlugins: [rehypeUnwrapImages, rehypePictureWebp],
  },
  i18n: {
    defaultLocale: "vi",
    locales: ["vi", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
