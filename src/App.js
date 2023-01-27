import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar.js";
import Main from "./components/main";
import EditCamera from "./components/editCamera";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Main />
      </BrowserRouter>
      {/* <EditCamera edit="create" camera/> */}
    </div>
  );
}

export default App;
