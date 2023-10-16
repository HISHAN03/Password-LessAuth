import ReactDOM from "react-dom"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Hello from "./Hello";
import NoPage from "./NoPage";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Hello />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
