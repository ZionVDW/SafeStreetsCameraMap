import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar.js";
import Main from "./components/main";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Main />
      </BrowserRouter>
    </div>
  );
}

export default App;
