import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { remarkReadingTime } from "./remark-reading-time.mjs";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://ju4nd4vid.github.io",
  output: "static",

  integrations: [icon(), mdx()],

  markdown: {
  remarkPlugins: [remarkReadingTime],
  shikiConfig: {
    langs: ['sql', 'plsql']
  }
},


  vite: {
    plugins: [tailwindcss()],
  },
});