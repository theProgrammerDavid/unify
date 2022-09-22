import React from 'react'
interface iFileTableProps {
    deleteFile: (index: number) => void;
    files: Array<File>;
    sortableRef: React.RefObject<HTMLDivElement>;
}

function FileTable({ files, deleteFile, sortableRef }: iFileTableProps) {
    return (
        <div className='uk-list uk-list-disc' uk-sortable="true" ref={sortableRef}>
            {files.map((file: File, index: number) => {
                return <>
                    <li>
                        <span className='white'>{file.name}</span>
                        <span
                            className="uk-icon-button uk-margin-left"
                            uk-icon="close"
                            onClick={() => deleteFile(index)}
                        ></span>
                    </li>
                </>
            })}

        </div>
    )
}

export default FileTable