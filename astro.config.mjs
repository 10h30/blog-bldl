import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import remarkReadingTime from "remark-reading-time";
import { remarkR2Images } from "./src/plugins/remark-r2-images.mjs";
import { rehypePictureWebp } from "./src/plugins/rehype-picture-webp.mjs";

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
    ],
    rehypePlugins: [rehypePictureWebp],
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
