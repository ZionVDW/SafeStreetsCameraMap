import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import "./camera.css";
import EditCamera from "./editCamera";
import AddIcon from "@mui/icons-material/Add";

export default function Camera() {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();
  const [cameraModal, setCameraModal] = useState(null);

  function onClose() {
    setCameraModal(null);
  }

  function afterSubmit() {
    setCameraModal(null);
    getCameras();
  }

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
                    (camera.location.street || "") +
                    " " +
                    (camera.location.streetNumber || "")}
              </p>

              <p>
                City:
                {camera.location !== null &&
                  " " +
                    (camera.location.zipcode || "") +
                    " " +
                    (camera.location.city || "")}
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
                <button
                  onClick={() =>
                    setCameraModal({ edit: "update", camera: camera })
                  }
                  className="button"
                >
                  Edit
                </button>
                {/* <button className="button" style={{backgroundColor: "#E43287", borderColor: "#E43287"}}>Deactivat</button> */}
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
  return (
    <>
      <div
        style={{
          display: "flex",
          flexFlow: 'row wrap',
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {cameras}
      </div>
      {cameraModal !== null && (
        <EditCamera
          edit={cameraModal.edit}
          camera={cameraModal.camera}
          onClose={onClose}
          afterSubmit={afterSubmit}
        />
      )}
      <div
        style={{
          backgroundColor: "#327091",
          width: 60,
          height: 60,
          borderRadius: 30,
          boxShadow: "5px 5px 10px grey",
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setCameraModal({ edit: "create" })}
      >
        <AddIcon
          style={{
            fontSize: 30,
            color: "white",
          }}
        />
      </div>
    </>
  );
}
