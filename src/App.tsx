import React from 'react';
import logo from './logo.svg';
import { PDFDocument, degrees } from 'pdf-lib'

const makePdf = async () => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()

  const sourcePdfUrl = 'https://pdf-lib.js.org/assets/with_large_page_count.pdf'
  const sourcePdf = await fetch(sourcePdfUrl).then((res) => res.arrayBuffer())

  const [embeddedPage] = await pdfDoc.embedPdf(sourcePdf, [73])
  page.drawPage(embeddedPage, {
    x: 250,
    y: 200,
    xScale: 0.5,
    yScale: 0.5,
    rotate: degrees(30),
    opacity: 0.75,
  })
  
  const pdfBytes = await pdfDoc.save()
  var blob = new Blob([pdfBytes], { type: "application/pdf" });// change resultByte to bytes

  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = "myFileName.pdf";
  link.click();

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br /><br />
        <button

          onClick={() => makePdf()}
        >Download Pdf</button>
      </header>
    </div>
  );
}

export default App;
