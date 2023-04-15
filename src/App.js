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

  console.log(process.env.REACT_APP_TEST);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/browse" element={<BrowsePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
