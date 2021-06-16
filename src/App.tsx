import React, { useEffect } from 'react';
import './index.css'
import { PDFDocument, degrees } from 'pdf-lib';

const handleFileSelect = (evt: any) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</li>');
  }
  document.getElementById('outputList')!.innerHTML = '<ul>' + output.join('') + '</ul>';
}

const handleDragOver = (evt: any) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

const setup = () => {
  var dropZone = document.getElementById('dropZone')!;
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);

}

const checkBrowser = () => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');

  }
}

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
  useEffect(() => { checkBrowser(); setup(); }, [])
  return (
    <div className="uk-container ">


      <p className="uk-padding-large uk-light uk-heading-large black grid">
        UNIFY
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
              <p>All conversion done in your web prowser. No external servers</p>
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

      {/* ----------------------- */}


      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div>
          <div>
            <div className="uk-light uk-background-secondary uk-padding">
              <h3>No Limit</h3>
              <p>No upper limit for maximum docs merged. CPU go brrrr</p>
              <button className="uk-button uk-button-default">Button</button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="uk-light uk-background-secondary uk-padding">
              <h3>Compressed Output</h3>
              <p>Coming Soon - Output to disk directly as zip</p>
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



      <div id="dropZone" className="js-upload uk-placeholder uk-text-center">
        <span uk-icon="icon: cloud-upload"></span>
        <span className="uk-text-middle">Attach files by dropping them here or</span>
        <div uk-form-custom>
          <input type="file" id="inputFiles" accept=".pdf" multiple />
          <output id="outputList" />
        </div>
      </div>

      <progress id="js-progressbar" className="uk-progress" value="0" max="100" hidden></progress>
    </div>
  );
}

export default App;
