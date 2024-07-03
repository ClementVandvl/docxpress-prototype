import {ImageAsPdf} from "./PdfAsImage";
import {ImageDisplay} from "./ImageDisplay";
import {useState} from "react";

export const FileInputWithPreview = ({Title, id}) => {
    const [file, setFile] = useState({
        type: "",
        data: undefined
    });

    function onChangeHandler(onChangeData)
    {
        const newFile = onChangeData.target.files[0];

        if (newFile == null || newFile === "")
            return null;
        if (newFile.type?.endsWith("pdf"))
            setFile({
                type: "pdf",
                data: newFile
            });
        else
            setFile({
                type: "image",
                data: URL.createObjectURL(newFile)
            });
    }

    return (
        <div>
            <p style={{fontWeight: "bold"}} >{Title}</p>
            <input id={id} type="file" accept=".pdf,.png" onChange={onChangeHandler}/>
            {file.type === "image" && <ImageDisplay file={file.data}/>}
            {file.type === "pdf" && <ImageAsPdf file={file.data}/>}
        </div>
    )
}
