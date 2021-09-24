import { PDFDocument } from "pdf-lib";

const fileToUintArray = async (file: File) =>
  new Uint8Array(await file.arrayBuffer());

export async function processData(uploadedFiles: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  let pageWidth = page.getWidth(),
    pageHeight = page.getHeight();
  pdfDoc.removePage(0);

  for (let i = 0; i < uploadedFiles.length; i++) {
    let file = uploadedFiles[i];

    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);

    switch (extension) {
      case "jpg":
      case "jpeg": {
        let img = await pdfDoc.embedJpg(await fileToUintArray(file));
        let { width, height } = img.scaleToFit(pageWidth, pageHeight);

        pdfDoc.addPage().drawImage(img, {
          x: 10,
          y: 10,
          height: height - 20,
          width: width - 20,
        });
        break;
      }
      case "png": {
        let img = await pdfDoc.embedPng(await fileToUintArray(file));
        let { width, height } = img.scaleToFit(pageWidth, pageHeight);
        pdfDoc.addPage().drawImage(img, {
          x: 10,
          y: 10,
          height: height - 20,
          width: width - 20,
        });
        break;
      }
      case "pdf": {
        const p2 = await PDFDocument.load(await fileToUintArray(file));
        const copyPage = await pdfDoc.copyPages(p2, p2.getPageIndices());
        copyPage.forEach(page=>{
          pdfDoc.addPage(page)
        })
        break;
      }
    }
  }
  return pdfDoc.save();
}
