import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

export async function extractText(
  filePath: string,
  originalName: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    if (!result.value.trim()) throw new Error("Empty DOCX content");
    return result.value.trim();
  }

  return ("Unsupported or empty file");
}
