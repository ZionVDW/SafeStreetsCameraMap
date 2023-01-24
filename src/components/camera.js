import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
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
        const downloadQR = () => {
          const canvas = document.getElementById(camera.macAddress);
          const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
          let downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = camera.macAddress + ".png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        console.log(camera);
        return (
          <div key={key} className="card">
            <div className="container">
              <h1>
                <b>{capitalizeFirstLetter(camera.name)}</b>
              </h1>
              <p>Mac-Address: {camera.macAddress}</p>
              <p>
                Straat:
                {camera.location !== null &&
                  " " +
                    camera.location.street +
                    " " +
                    camera.location.streetNumber}
              </p>

              <p>
                City:
                {camera.location !== null &&
                  " " + camera.location.zipcode + " " + camera.location.city}
              </p>
              <div>
                <QRCode
                  id={camera.macAddress}
                  value={camera.macAddress}
                  size={290}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <div>
                <button onClick={downloadQR} className="button">
                  Download QR-code
                </button>
                <button
                  onClick={() => handleCameraPress(camera)}
                  className="button"
                >
                  Go to map
                </button>
              </div>
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
