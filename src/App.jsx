import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Topics from './pages/Topics/Topics.jsx';
import LogIn from './pages/Login and Register/LogIn.jsx';
import Register from './pages/Login and Register/Register.jsx';
import TopicDetails from './pages/Topics/TopicDetails.jsx';
import NewTopic from './pages/Topics/NewTopic.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Topics />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/new-topic" element={<NewTopic />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/topic-details/:id" element={<TopicDetails />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;