import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionDetail from "./pages/QuestionDetail";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManageQuestionsPage from "./pages/ManageQuestionsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/question/:id" element={<QuestionDetail />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateQuestionPage />} />
        <Route path="/admin/manage" element={<ManageQuestionsPage />} />
      </Routes>
    </Router>
  );
}
