import './App.css';
import './fonts/Pacifico-Regular.ttf';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BrowsePage from './pages/BrowsePage';

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
          <Route exact path={process.env.REACT_APP_SITE_URL} element={<HomePage/>}/>
          <Route path={process.env.REACT_APP_LOGIN_URL} element={<LoginPage/>}/>
          <Route path={process.env.REACT_APP_BROWSE_URL} element={<BrowsePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
