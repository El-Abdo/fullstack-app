import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProductDetails from "./pages/ProductDetails";
import ProductListing from "./pages/ProductListing";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/:category" element={<ProductListing />} />
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/:category/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}


export default App
