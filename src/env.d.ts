/// <reference types="vite/client" />
declare module "virtual:portfolio-content" {
  const content: Record<
    "work" | "notes",
    { path: string; data: Record<string, any>; content: string }[]
  >;
  export default content;
}
