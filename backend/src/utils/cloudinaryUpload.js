const { PDFDocument } = require("pdf-lib");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Compresses a PDF buffer using pdf-lib if size > 10 MB.
 * @param {Buffer} buffer 
 * @returns {Promise<Buffer>}
 */
async function compressPdfIfNeeded(buffer) {
  const TEN_MB = 10 * 1024 * 1024;
  
  if (buffer.length <= TEN_MB) {
    return buffer;
  }

  const origMB = (buffer.length / (1024 * 1024)).toFixed(2);
  console.log(`[PDF Compression] PDF size ${origMB} MB exceeds 10 MB limit. Compressing...`);

  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

    // Pass 1: Stream compression & object stream optimization
    let compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });
    let compressedBuffer = Buffer.from(compressedBytes);
    let compMB = (compressedBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(`[PDF Compression] Pass 1 completed. New size: ${compMB} MB`);

    // Pass 2: If still > 10 MB, reconstruct document pages into fresh document
    if (compressedBuffer.length > TEN_MB) {
      const freshPdf = await PDFDocument.create();
      const pageIndices = pdfDoc.getPageIndices();
      const copiedPages = await freshPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => freshPdf.addPage(page));

      const pass2Bytes = await freshPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      compressedBuffer = Buffer.from(pass2Bytes);
      compMB = (compressedBuffer.length / (1024 * 1024)).toFixed(2);
      console.log(`[PDF Compression] Pass 2 completed. New size: ${compMB} MB`);
    }

    return compressedBuffer;
  } catch (err) {
    console.error("[PDF Compression] Error during compression, using original buffer:", err.message);
    return buffer;
  }
}

/**
 * Compresses PDF buffer if > 10 MB and uploads to Cloudinary using chunked upload_large.
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @returns {Promise<{ secure_url: string, public_id: string, url: string }>}
 */
async function compressAndUploadPdf(fileBuffer, originalName) {
  // Compress buffer if larger than 10 MB
  const finalBuffer = await compressPdfIfNeeded(fileBuffer);

  const cleanFileName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.[^/.]+$/, "");

  const publicId = `${Date.now()}_${cleanFileName}`;
  const tempFilePath = path.join(os.tmpdir(), `upload_${publicId}.pdf`);

  try {
    // Write buffer to temp file for chunked upload
    fs.writeFileSync(tempFilePath, finalBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        tempFilePath,
        {
          folder: "question-papers",
          resource_type: "raw",
          public_id: `${publicId}.pdf`,
          chunk_size: 5 * 1024 * 1024,
          timeout: 300000,
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary Upload Error]:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
    });

    return result;
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.warn("[Temp Cleanup Warning]:", e.message);
      }
    }
  }
}

module.exports = {
  compressPdfIfNeeded,
  compressAndUploadPdf,
};
