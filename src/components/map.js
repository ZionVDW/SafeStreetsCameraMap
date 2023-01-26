import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { useLocation } from "react-router-dom";

import { VscRefresh } from "react-icons/vsc";

const defaultLng = 4.99084;
const defaultLat = 51.16257;
const defaultZoom = 13;

export default function Map() {
  const location = useLocation();
  const { initLng, initLat, initZoom } = location.state || {};
  console.log(initLng);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(initLng === undefined ? defaultLng : initLng);
  const [lat] = useState(initLat === undefined ? defaultLat : initLat);
  const [zoom] = useState(initZoom === undefined ? defaultZoom : initZoom);
  const [API_KEY] = useState("377LREZ4PGCvgJ3xsq7X");

  function resetDefault() {
    map.current.flyTo({
      center: [defaultLng, defaultLat],
      zoom: defaultZoom,
    });
  }

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
      map.current.addControl(new maplibregl.NavigationControl());

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

  return (
    <>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        <div onClick={resetDefault} className="refresh">
          <VscRefresh />
        </div>
      </div>
    </>
  );
}
