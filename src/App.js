import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          {/* TODO: more routes
          <Route path="/browse" element={<BrowsePage/>}/>
          <Route path="/match" element={<MatchPage/>}/>
          */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
