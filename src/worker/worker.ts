import { PDFDocument } from "pdf-lib";

const fileToUintArray = async (file: File) =>
  new Uint8Array(await file.arrayBuffer());

export async function processData(uploadedFiles: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  let pageWidth = page.getWidth(),
    pageHeight = page.getHeight();
  pdfDoc.removePage(0);

  for (let i = 1; i <= uploadedFiles.length; i++) {
    let file = uploadedFiles[i - 1];

    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);

    switch (extension) {
      case "jpg":
      case "jpeg":
        let img = await pdfDoc.embedJpg(await fileToUintArray(file));
        pdfDoc.addPage().drawImage(img, {
          x: 10,
          y: 10,
          height: pageHeight,
          width: pageWidth,
        });
        break;
      case "png":
        let img2 = await pdfDoc.embedPng(await fileToUintArray(file));
        pdfDoc.addPage().drawImage(img2, {
          x: 10,
          y: 10,
          height: pageHeight,
          width: pageWidth,
        });
        break;

      case "pdf":
        const p2 = await PDFDocument.load(await fileToUintArray(file));
        for (let j = 0; j < p2.getPageCount(); j++) {
          pdfDoc.addPage().drawPage(await pdfDoc.embedPage(p2.getPages()[j]));
        }
        break;
    }
  }
  return pdfDoc.save();
}
