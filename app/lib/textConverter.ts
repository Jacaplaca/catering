import { slug } from "github-slugger";
import { marked } from "marked";

marked.use({
  // mangle: false,
  // headerIds: false,
});

// slugify
export const slugify = (content: string) => {
  return slug(content);
};

// markdownify
export const markdownify = (content: string, div?: boolean) => {
  return { __html: div ? marked.parse(content) : marked.parseInline(content) };
};

// humanize
export const humanize = (content: string) => {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// plainify
export const plainify = (content: string) => {
  const filterBrackets = content.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string): string => {
  const entityList: Record<string, string> = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'"
  };
  const htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;)/g,
    (entity: string): string => {
      return entityList[entity] ?? entity;
    }
  );
  return htmlWithoutEntities;
};

//remove trailing slash
export const removeTrailingSlash = (s: string): string => {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}
