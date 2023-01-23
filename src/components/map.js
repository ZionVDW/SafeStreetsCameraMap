import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(4.99084);
  const [lat] = useState(51.16257);
  const [zoom] = useState(13);
  const [API_KEY] = useState("377LREZ4PGCvgJ3xsq7X");

  useEffect(() => {
    const getmarkers = async () => {
      let result;
      try {
        result = await axios.get("http://localhost:3000/camera");
      } catch (error) {
        console.log(error);
        return;
      }
      const cameras = result.data;

      if (map.current) return; //stops map from intializing more than once
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
        center: [lng, lat],
        zoom: zoom,
      });

      cameras.forEach((camera) => {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          "<h1>" +
            camera.name +
            "</h1> \n <h3>Straat: " +
            camera.location.street +
            " " +
            camera.location.streetNumber +
            "</h3> \n <h3>Gemeente: 2020 GEEL</h3>"
        );
        console.log(camera);
        new maplibregl.Marker({ color: "#FF0000" })
          .setLngLat([
            parseFloat(camera.location.longitude),
            parseFloat(camera.location.latitude),
          ])
          .setPopup(popup)
          .addTo(map.current);
      });
    };
    getmarkers();
  });

  useEffect(() => {});

  // map.current.addControl(new maplibregl.NavigationControl(), "top-right");

  // markers.forEach((marker) => {
  //   console.log(marker);
  //   console.log(marker.name);
  //   const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
  //     "<h1>" +
  //       marker.name +
  //       "</h1> \n <h3>Straat: " +
  //       marker.location.street +
  //       marker.location.streetNumber +
  //       "</h3> \n <h3>Gemeente: 2020 GEEL</h3>"
  //   );

  //   new maplibregl.Marker({ color: "#DE00FF" })
  //     .setLngLat([
  //       parseFloat(marker.location.longitude),
  //       parseFloat(marker.location.longitude),
  //     ])
  //     .setPopup(popup)
  //     .addTo(map.current);
  // });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
