import {useState} from "react";
import {Document, Page} from "react-pdf";

export const ImageAsPdf = ({file}) => {
    const [numPages, setNumPages] = useState(null);

    if (file == null || file === "") {
        return null;
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page
                    key={`page_1`}
                    pageNumber={1}
                    renderMode="canvas"
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    renderForms={false}
                />
            </Document>
        </div>
    );
}
