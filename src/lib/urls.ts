export const assetUrl = (path: string) =>
  /^https?:\/\//.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
export const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || "";
