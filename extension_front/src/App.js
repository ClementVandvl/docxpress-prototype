import './App.css';
import {pdfjs} from "react-pdf"
import {FileInputWithPreview} from "./components/FileInputWithPreview";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

function App() {

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
        flexDirection: "column",
      alignItems: 'center',
    }}>
        <p>Pour continuer, vous devez fournir ces documents:</p>

    <FileInputWithPreview id={"id_card"} Title={"Carte d'identité"} />
    <FileInputWithPreview id={"passport"} Title={"Passeport"} />
    </div>
  );
}

export default App;
