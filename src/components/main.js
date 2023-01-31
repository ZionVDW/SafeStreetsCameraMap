import { Routes, Route } from "react-router-dom";
import Map from "./map";
import Camera from "./camera";
import Login from "./login";

export default function Main() {
  return (
    <Routes>
      <Route path={"/"} element={<Map />} />
      <Route path={"/camera"} element={<Camera />} />
      <Route path={"/login"} element={<Login />} />
    </Routes>
  );
}
