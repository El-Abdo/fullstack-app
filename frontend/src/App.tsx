import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Tech from "./pages/Tech";
import Clothes from "./pages/Clothes";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tech" element={<Tech />} />
        <Route path="/" element={<Navigate to="/tech" />} />
        <Route path="/clothes" element={<Clothes />} />
      </Routes>
    </Router>
  );
}


export default App
