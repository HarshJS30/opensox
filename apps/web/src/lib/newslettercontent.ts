// src/lib/newslettercontent.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function getNewsletterContent(slug: string) {
  try {
    // ✅ FIXED: Validate slug to prevent path traversal attacks
    if (!slug || slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
      throw new Error("Invalid slug");
    }

    const filePath = path.join(
      process.cwd(),
      "src/app/content/newsletters",
      `${slug}.md`
    );

    // ✅ FIXED: Use async file reading and add error handling
    let fileContent: string;
    try {
      fileContent = await fs.readFile(filePath, "utf-8");
    } catch (error) {
      throw new Error(`Newsletter not found: ${slug}`);
    }

    // Parse markdown front matter
    const { content, data } = matter(fileContent);

    // Convert markdown to HTML
    const processed = await remark().use(html).process(content);
    const htmlContent = processed.toString();

    return {
      htmlContent,
      meta: data || {},
    };
  } catch (error) {
    // ✅ FIXED: Add error handling as requested by CodeRabbit
    console.error(`Error loading newsletter ${slug}:`, error);
    throw error;
  }
}