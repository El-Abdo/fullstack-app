import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Tech from "./pages/Tech";
import Clothes from "./pages/Clothes";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tech" element={<Tech />} />
        <Route path="/" element={<Navigate to="/tech" />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}


export default App
