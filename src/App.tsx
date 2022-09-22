import React, { useEffect, useState, createRef } from 'react';
import './index.css'
import jszip from 'jszip';
import 'reactjs-popup/dist/index.css';
import Worker from './worker';
import FileTable from './FileTable';

import Features from './features';

const instance = new Worker();

const checkBrowser = () => {
  if (!(window.Worker && window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
  }
}

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([]);
  const [ziptoggle, setZip] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const loadingDiv = createRef<HTMLDivElement>();
  const outputContainer = createRef<HTMLDivElement>();

  useEffect(() => checkBrowser, [])
  useEffect(() => {
    console.log(uploadedFiles)
  }, [uploadedFiles]);

  const makePdf = async (zipDownload: boolean) => {

    const names = Array.from(outputContainer.current?.childNodes!).map(node => node.textContent!);
    console.log(names);
    setUploadedFiles(uploadedFiles.sort(function (a, b) {
      return names.indexOf(a.name) - names.indexOf(b.name);
    }))

    if (uploadedFiles.length === 0 || uploadedFiles.length === 1) return;

    loadingDiv.current!.setAttribute("style", "display:block");

    const res = await instance.processData(uploadedFiles);
    const link = document.createElement('a');
    var blob = new Blob([res], { type: "application/pdf" });

    loadingDiv.current!.setAttribute("style", "display:none");

    if (zipDownload) {
      const zip = new jszip();
      zip.file(`${fileName || 'unify'}.pdf`, blob);

      let content = await zip.generateAsync({
        type: "blob", compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      })
      link.href = window.URL.createObjectURL(content);
      link.download = `${fileName}.zip`;
      link.click();
    }
    else {
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileName}.pdf`;
      link.click();
    }
  }

  const deleteFile = (fileIndex: number) => {
    setUploadedFiles(uploadedFiles.filter((value, index) => index !== fileIndex));
  }

  return (
    <div className="uk-container ">

      <p className="uk-padding-small uk-light uk-heading-large black grid">
        UNIFY
        <span className="uk-text-meta">A PDF Merging tool</span>
        <span className="uk-text-meta">Made by <a className="uk-link-muted mylink" rel="noreferrer" target="_blank" href="https://davidvelho.tech">David Velho</a></span>
      </p>

      <div className="uk-padding-small uk-light  black grid">
        <Features />
      </div>

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
          <input
            className="uk-input"
            id="fileName"
            type="text"
            placeholder={`Save ${ziptoggle ? "zip" : "pdf"} as  : unify_merged`}
            onChange={(e) => setFileName(e.target.value)}
          />
          <br />
          <br />
          <button
            className="uk-button uk-button-default"
            onClick={() => { makePdf(ziptoggle); }}
          >

            MERGE</button> <div id="loading" ref={loadingDiv} className="hidden" uk-spinner="true"></div>


        </div>
        <div className=""></div>
      </div>

      <div id="dropZone" className="js-upload uk-placeholder uk-text-center">

        <div uk-form-custom="true">
          <label className="uk-button white uk-button-default custom-file-upload">
            <input
              type="file"
              id="inputFiles"
              accept=".pdf, image/*"
              multiple={true}
              capture="camera"
              onChange={(e) => setUploadedFiles(Array.from(e.target.files!))}
            />
            SELECT FILES
          </label>
          <br />
          <br />
          {/* <output id="outputList" className="uk-light" /> */}
          <FileTable
            deleteFile={deleteFile}
            files={uploadedFiles}
            sortableRef={outputContainer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
