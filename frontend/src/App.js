import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser';
import TwoFAForm from './components/TwoFAForm';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/twofa" element={<TwoFAForm />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
