// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "@/components/blocks/Navbar/Navbar";
import Footer from "@/components/blocks/Footer/Footer";
import LogoScroll from "@/components/blocks/LogoScroll/LogoScroll";
import FAQ from "@/components/blocks/FAQ/FAQ";
import CartPage from "@/components/blocks/CartPage/CartPage";
import MapView from "@/components/blocks/Maps/LiveMap";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-28">
        <Routes>
          <Route path="/" element={<LogoScroll />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;