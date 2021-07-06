import React, { useEffect } from 'react';
import './index.css'
import jszip from 'jszip';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Worker from './worker';

import Features from './features';

const instance = new Worker();

var uploadedFiles: File[] = [];


function handleFileSelect(evt: any) {

  uploadedFiles.push(...evt.target.files);
  console.log(uploadedFiles)

  let output: string[] = [];
  for (var i = 0; i < uploadedFiles.length; i++) {
    let f = uploadedFiles[i];
    output.push(`<li><strong>${escape(f.name)}</strong>  ${f.size / 1000} kb </li>`)
  }
  document.getElementById('outputList')!.innerHTML = '<ul>' + output.join('') + '</ul>';
}
function setup() {
  document.getElementById('inputFiles')!.addEventListener('change', handleFileSelect, false);
}

function checkBrowser() {
  if (!(window.Worker && window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');

  }
}

async function makePdf(zipDownload: boolean) {

  if (uploadedFiles.length === 0 || uploadedFiles.length === 1) return;

  let loadingDiv = (document.getElementById("loading") as HTMLElement);
  loadingDiv.setAttribute("style", "display:block");

  let fileName = (document.getElementById("fileName") as HTMLInputElement).value || 'unify_merged';

  const res = await instance.processData(uploadedFiles);

  var blob = new Blob([res], { type: "application/pdf" });

  loadingDiv.setAttribute("style", "display:none");

  if (zipDownload) {
    const zip = new jszip();
    zip.file(`${fileName}.pdf`, blob);

    zip.generateAsync({
      type: "blob", compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    })
      .then(function (content) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(content);
        link.download = `${fileName}.zip`;
        link.click();
      });
  }
  else {
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.pdf`;
    link.click();
  }



}

function App() {
  const [ziptoggle, setZip] = React.useState<boolean>(false);
  useEffect(() => { checkBrowser(); setup(); }, [])
  return (
    <div className="uk-container ">

      <p className="uk-padding-small uk-light uk-heading-large black grid">
        UNIFY
        <span className="uk-text-meta">A PDF Merging tool</span>
        <span className="uk-text-meta">Made by <a className="uk-link-muted mylink" rel="noreferrer" target="_blank" href="https://davidvelho.tech">David Velho</a></span>
      </p>

      <p className="uk-padding-small uk-light  black grid">
     <Features   />
        
      </p>

      <div className="uk-child-width-expand@s uk-text-center" uk-grid="true" >
        <div className="">
          <div className="uk-background-secondary uk-padding">
            <label className="white ">
              <input type="checkbox" id="zipDownload"
                onChange={(event) => setZip(event.target.checked)}
              />&#x20;ZIP download
            </label>
          </div>
        </div>
        <div className="uk-light">
          <input className="uk-input" id="fileName" type="text" placeholder={`Save As  : unify_merged.${ziptoggle ? "zip" : "pdf"}`} />
          <br />
          <br />
          <button
            className="uk-button uk-button-default"
            onClick={() => { makePdf(ziptoggle); }}
          >

            MERGE</button> <div id="loading" className="hidden" uk-spinner="true"></div>


        </div>
        <div className=""></div>
      </div>

      <div id="dropZone" className="js-upload uk-placeholder uk-text-center">

        <div uk-form-custom="true">
          <label className="uk-button white uk-button-default custom-file-upload">
            <input type="file" id="inputFiles" accept=".pdf, image/*" multiple={true} capture="camera" />
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
