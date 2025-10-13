import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
const pdfParse = require('pdf-parse');;

export async function extractText(filePath: string, originalName: string): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    if (!result.value.trim()) throw new Error('Empty DOCX content');
    return result.value.trim();
  }

  if (ext === '.pdf') {
    const data = await fs.readFile(filePath);
    const pdf = await pdfParse(data);
    if (!pdf.text.trim()) throw new Error('Empty PDF content');
    return pdf.text.trim();
  }

  const text = (await fs.readFile(filePath, 'utf8')).trim();
  if (!text) throw new Error('Unsupported or empty file');
  return text;
}
