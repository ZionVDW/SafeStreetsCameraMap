import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./camera.css";

export default function Camera() {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function handleCameraPress({ location: { longitude, latitude } }) {
    navigate("/", {
      state: {
        initLng: parseFloat(longitude),
        initLat: parseFloat(latitude),
        initZoom: 17,
      },
    });
  }

  const getCameras = async () => {
    let result;
    try {
      result = await axios.get("http://localhost:3000/camera");
    } catch (error) {
      console.log(error);
      return;
    }
    const camerasResult = result.data;
    camerasResult.sort((a, b) => {
      return a.cameraId - b.cameraId;
    });
    setCameras(
      camerasResult.map((camera, key) => {
        console.log(camera);
        return (
          <div
            key={key}
            className="card"
            onClick={() => handleCameraPress(camera)}
          >
            <div className="container">
              <h1>
                <b>{capitalizeFirstLetter(camera.name)}</b>
              </h1>
              <p>Mac-Address: {camera.macAddress}</p>
            </div>
          </div>
        );
      })
    );
  };
  useEffect(() => {
    getCameras();
  }, []);
  return <>{cameras}</>;
}
