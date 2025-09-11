import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionDetail from "./pages/QuestionDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
      </Routes>
    </Router>
  );
}
