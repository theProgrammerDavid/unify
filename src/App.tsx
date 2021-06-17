import React, { useEffect } from 'react';
import './index.css'
import { PDFDocument } from 'pdf-lib';


var uploadedFiles: File[] = [];
const fileToUintArray = async (file: File) => new Uint8Array(await file.arrayBuffer());


function handleFileSelect(evt: any) {
  var files = evt.target.files; // FileList object
  // files is a FileList of File objects. List some properties.

  uploadedFiles = evt.target.files;

  let output: string[] = [];
  for (var i = 0; i < files.length; i++) {
    let f = files[i];
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</li>');
  }
  document.getElementById('outputList')!.innerHTML = '<ul>' + output.join('') + '</ul>';
}
function setup() {
  document.getElementById('inputFiles')!.addEventListener('change', handleFileSelect, false);
}

function checkBrowser() {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');

  }
}

async function makePdf() {
  if (uploadedFiles.length === 0) return;
  (document.getElementById("prog") as HTMLInputElement).value = '0';

  let progressUnit = 100 / uploadedFiles.length;
  console.log(progressUnit)

  const pdfDoc = await PDFDocument.create()

  for (let i = 1; i <= uploadedFiles.length; i++) {
    let file = uploadedFiles[i - 1];
    const p2 = await PDFDocument.load(await fileToUintArray(file));
    for (let j = 0; j < p2.getPageCount(); j++) {
      pdfDoc.addPage().drawPage(await pdfDoc.embedPage(p2.getPages()[j]))
    }

    (document.getElementById("prog") as HTMLInputElement).value = `${progressUnit * i}`

    console.log(`${progressUnit * i}%`)
  }


  const pdfBytes = await pdfDoc.save()
  var blob = new Blob([pdfBytes], { type: "application/pdf" });
  let fileName = (document.getElementById("fileName") as HTMLInputElement).value || 'unify_merged.pdf';
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${fileName}.pdf`;
  link.click();

}

function card(heading: string, body: string) {
  return (
    <div className="">
      <div className="uk-light uk-background-secondary uk-padding">
        <h3>{heading}</h3>
        <p>{body}</p>

      </div>
    </div>
  )
}

function App() {
  useEffect(() => { checkBrowser(); setup(); }, [])
  return (
    <div className="uk-container ">

      <p className="uk-padding uk-light uk-heading-large black grid">
        UNIFY
        <span className="uk-text-meta">Made by <a className="uk-link-muted mylink" rel="noreferrer" target="_blank" href="https://davidvelho.tech">David Velho</a></span>
      </p>
      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div className="">
          {card('Fast af', 'Native Asynchronous Javascript PDF Manipulation')}
        </div>
        <div>
          {card('Privacy 💯', 'All conversion done in web browser. No external servers and no ads')}
        </div>
        <div className="disabled  ">
          {card('Versatile', 'Coming soon - Doc and PPT Manipulation')}
        </div>
      </div>

      {/* ----------------------- */}


      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div>
          {card('No Limit', 'No upper limit for maximum docs merged. CPU go brrrr')}
        </div>
        <div>
          {card('Convert Offline', 'Install as a PWA to convert documents offline')}
        </div>
        <div className="disabled">
          {card('Compressed Output', 'Coming Soon - Output to disk directly as zip')}
        </div>
      </div>

      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div className=""></div>
        <div className="uk-light">
          <input className="uk-input" id="fileName" type="text" placeholder="Save As  : unify_merged.pdf" />
          <br />
          <br />
          <progress id="prog" className="uk-progress" value="0" max="100" >Progress</progress>
          <button
            className="uk-button uk-button-default"
            onClick={() => { makePdf(); }}
          >
            MERGE</button>
        </div>
        <div className=""></div>
      </div>

      <div id="dropZone" className="js-upload uk-placeholder uk-text-center">

        <div uk-form-custom>
          <label className="uk-button white uk-button-default custom-file-upload">
            <input type="file" id="inputFiles" accept=".pdf" multiple={true} />
            SELECT FILES
          </label>
          <br />
          <output id="outputList" className="white" />
        </div>
      </div>
    </div>
  );
}

export default App;
