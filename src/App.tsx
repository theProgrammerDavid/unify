import React from 'react';
import './index.css'
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
  var blob = new Blob([pdfBytes], { type: "application/pdf" });

  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = "myFileName.pdf";
  link.click();

}

function App() {
  return (
    <div className="uk-container uk-background-muted">
      <p className="uk-padding-large uk-light uk-heading-large black grid">
        Modern PDF Merger
      </p>
      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div>
          <div>
            <div className="uk-light uk-background-secondary uk-padding">
              <h3>Fast af</h3>
              <p>Native Asynchronous Javascript PDF Manipulation</p>
              <button className="uk-button uk-button-default">Button</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="uk-light uk-background-secondary uk-padding">
              <h3>Privacy 💯</h3>
              <p>All conversion done in your web prowser. No PDFs reach a server</p>
              <button className="uk-button uk-button-default">Button</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="uk-light uk-background-secondary uk-padding">
              <h3>Versatile </h3>
              <p>Coming soon - Doc and PPT Manipulation</p>
              <button className="uk-button uk-button-default">Button</button>
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br />

      <div className="js-upload uk-placeholder uk-text-center grid ">
        <span uk-icon="icon: cloud-upload"></span>
        <span className="uk-text-middle">Attach binaries by dropping them here or</span>
        <div uk-form-custom>
          <input type="file" multiple />
        </div>
      </div>

      <progress id="js-progressbar" className="uk-progress" value="0" max="100" hidden></progress>


    </div>
  );
}

export default App;
