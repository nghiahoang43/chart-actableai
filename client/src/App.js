import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Chart from './components/Chart';
import Login from './components/Login';
import Signup from './components/Signup';
import DataPage from './components/DataPage';



const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/data-page" element={<DataPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/chart/:id" element={<Chart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
