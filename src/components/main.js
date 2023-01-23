import { Routes, Route } from "react-router-dom";
import Map from "./map";
import Camera from "./camera";

export default function Main() {
  return (
    <Routes>
      <Route path={"/"} element={<Map />} />
      <Route path={"/camera"} element={<Camera />} />
    </Routes>
  );
}
