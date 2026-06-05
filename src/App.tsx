import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import LegalDocumentPage from "./pages/legal/LegalDocumentPage";
import LegalIndex from "./pages/legal/LegalIndex";
import CheckoutPage from "./pages/CheckoutPage";
import OfferCodePage from "./pages/OfferCodePage";
import Partners from "./pages/Partners";
import PublicSharePage from "./pages/PublicSharePage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/legal" element={<LegalIndex />} />
      <Route path="/legal/:slug" element={<LegalDocumentPage />} />
      <Route path="/checkout/:token" element={<CheckoutPage />} />
      <Route path="/checkout/:token/payment/:result" element={<CheckoutPage />} />
      <Route path="/code/:code" element={<OfferCodePage />} />
      <Route path="/:slug" element={<PublicSharePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
