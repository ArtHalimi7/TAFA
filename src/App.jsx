import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import CarDetail from "./pages/CarDetail";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import ScrollToTopButton from "./components/ScrollToTop";
import CustomSourcing from "./pages/CustomSourcing";
import FinancingOptions from "./pages/FinancingOptions";

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Main site wrapper with loader
function MainSite() {
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loader on first visit (not on refresh within session)
    return !sessionStorage.getItem("tafa_visited");
  });

  const handleLoadComplete = () => {
    sessionStorage.setItem("tafa_visited", "true");
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader onComplete={handleLoadComplete} />}
      <Navbar />
      <ScrollToTopButton />
      {!isLoading && (
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/car/:slug" element={<CarDetail />} />
            <Route path="/custom-sourcing" element={<CustomSourcing />} />
            <Route path="/financing-options" element={<FinancingOptions />} />
          </Routes>
        </main>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </Router>
  );
}

export default App;
