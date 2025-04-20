import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Tech from "./pages/Tech";
import Clothes from "./pages/Clothes";
import ProductDetails from "./pages/ProductDetails";
import All from "./pages/All";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tech" element={<Tech />} />
        <Route path="/all" element={<All />} />
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/:category/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}


export default App
