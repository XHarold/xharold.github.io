import MarkdownIt from "markdown-it";

export interface ContentEntry {
  slug: string;
  title: string;
  summary: string;
  subtitle?: string;
  category: string;
  tags: string[];
  status?: string;
  role?: string;
  domain?: string;
  placeholder: boolean;
  featured?: boolean;
  order: number;
  art: "graph" | "city" | "learning";
  date?: string;
  draft?: boolean;
  cover?: string;
  links?: { label: string; url: string }[];
  html: string;
}

// Frontmatter is parsed at build time by the content module below; no remote HTML is accepted.
import collections from "virtual:portfolio-content";
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function load(files: typeof collections.work) {
  const slugs = new Set<string>();
  return files
    .map(({ path, data, content }) => {
      const slug = data.slug || path.split("/").pop()?.replace(".md", "");
      if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        throw new Error(`Invalid content slug: ${path}`);
      if (!data.title || !data.summary)
        throw new Error(`Missing title or summary: ${path}`);
      if (slugs.has(slug)) throw new Error(`Duplicate slug: ${slug}`);
      slugs.add(slug);
      if (
        data.links &&
        (!Array.isArray(data.links) ||
          data.links.some(
            (link: { url: string }) => !/^https?:\/\//.test(link.url),
          ))
      )
        throw new Error(`Links must use http(s): ${path}`);
      return {
        tags: [],
        order: 100,
        placeholder: false,
        art: "graph",
        ...data,
        title: data.title,
        summary: data.summary,
        category: data.category || "",
        slug,
        html: md.render(content),
      } as ContentEntry;
    })
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.order - b.order);
}

export const projects = load(collections.work);
export const notes = load(collections.notes).sort((a, b) =>
  (b.date || "").localeCompare(a.date || ""),
);
