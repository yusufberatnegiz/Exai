/**
 * Text extraction and chunking utilities.
 *
 * pdf-parse is used for PDF text extraction because it is pure JavaScript
 * (no native bindings), has a simple one-call API, and runs reliably inside
 * Next.js server actions without any native compilation step on Vercel.
 * It is loaded via dynamic import to avoid the package's test-file side effect
 * that runs at module initialisation time.
 */

/**
 * Split text into sequential chunks of roughly `maxChars` characters.
 * Tries to split at paragraph boundaries first; falls back to sentence
 * boundaries when a single paragraph exceeds `maxChars`.
 */
export function chunkText(text: string, maxChars = 1000): string[] {
  const normalised = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalised) return [];

  const paragraphs = normalised
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (para.length > maxChars) {
      // Flush buffer before splitting this large paragraph
      if (current.trim()) {
        chunks.push(current.trim());
        current = "";
      }
      // Split oversized paragraph by sentence
      const sentences = para.match(/[^.!?]+[.!?]+[\s]*/g) ?? [para];
      for (const sentence of sentences) {
        if (
          current.length + sentence.length > maxChars &&
          current.length > 0
        ) {
          chunks.push(current.trim());
          current = sentence;
        } else {
          current += (current ? " " : "") + sentence;
        }
      }
    } else if (current.length + para.length + 2 > maxChars) {
      if (current.trim()) chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Extract plain text from a PDF ArrayBuffer.
 * Returns an empty string if the PDF contains no selectable text (scanned).
 */
export async function extractTextFromPdf(
  buffer: ArrayBuffer
): Promise<string> {
  try {
    // Dynamic import sidesteps pdf-parse's test-file side effect at load time
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(Buffer.from(buffer));
    return data.text ?? "";
  } catch {
    return "";
  }
}
