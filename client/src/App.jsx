import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/blocks/Navbar/Navbar";
import Footer from "@/components/blocks/Footer/Footer";
import LogoScroll from "@/components/blocks/LogoScroll/LogoScroll";
import FAQ from "@/components/blocks/FAQ/FAQ";
import CartPage from "@/components/blocks/CartPage/CartPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LogoScroll />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
