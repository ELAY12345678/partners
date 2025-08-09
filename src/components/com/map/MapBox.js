import React, { useState, useEffect, useRef } from "react";
//ES6
import ReactMapboxGl, {
  Layer,
  Feature,
  GeoJSONLayer,
  Marker,
  ZoomControl,
  Cluster
} from "react-mapbox-gl";
// ES5
import styled from "styled-components";


const themes = require("./styles.json");
const geojson = require("./geojson.json");
const Mark = styled.div`
  background-color: #e74c3c;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 4px solid #eaa29b;
`;

const clusterMarker = coordinates => (
  <Marker coordinates={coordinates} /* style={styles.clusterMarker} */>
    C
  </Marker>
);
const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1Ijoib2tpbG9jbzIiLCJhIjoiY2o2eHRuZW9kMWtzajM0cGc5YzJzZDdtMyJ9.CUKmVGnNcpmjsTD0R3ov2A"
});

const PUBLIC_TOKEN =
  "pk.eyJ1Ijoib2tpbG9jbzIiLCJhIjoiY2o2eHRuZW9kMWtzajM0cGc5YzJzZDdtMyJ9.CUKmVGnNcpmjsTD0R3ov2A";

const mapStyle = {
  width: "100%",
  height: "100%",
  position: "relative"
};
const symbolLayout = {
  "text-field": "{place}",
  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
  "text-offset": [0, 0.6],
  "text-anchor": "top",
  "position": "relative"
};
const circlePaint = {
  "circle-color": "red",
  "position": "relative"
};
const Wrapper = styled.div`

  min-height:250px!important;
  & .mapboxgl-map{
    position: relative;
    min-height:250px!important;
  }
  .mapboxgl-marker {
    width: 20px!important;
    height: 20px!important;
    position: relative;
    overflow: hidden;
  
    /* background: red; */
  }
  .mapboxgl-canvas-container.mapboxgl-interactive.mapboxgl-touch-drag-pan.mapboxgl-touch-zoom-rotate {
    position: absolute;
    overflow: hidden;
}
`;
const circleLayout = { visibility: "visible" };

/* Map */
const MapBox = props => {
  /*  lat: 10.97591637
    lng: -74.7881658 */
  let { type = "simple" } = props;
  let { onClick, onMarkClick, onDblClick, onDragEnd } = props;
  const [center, setCenter] = useState(props.center || [-74.7881658, 10.97591637]);
  const [initialized, setInitialized] = useState(false);
  const onStyleLoad = map => {
    const { onStyleLoad } = props;
    return onStyleLoad && onStyleLoad(map);
  };

  const myRef = useRef(null);
  const onClickCircle = evt => {
    console.log(evt);
  };
  const handleDragEnd = () => {
    const mapRef = myRef.current;
    let { map } = mapRef.state;
    let center = map.getCenter();
    if (onDragEnd) {
      onDragEnd(center)
    }
  }
  const handleClick = (eOpt, e) => {
    let { lngLat } = e;
    let { lng, lat } = lngLat;
    if (lng) setCenter([lng, lat]);
    if (props.onChange) props.onChange({
      lng: String(lng),
      lat: String(lat),
    });
  }

  useEffect(() => {
    if (props.data && props.data.length > 0 && !initialized) {
      let item = props.data[0];
      let { lng, lat } = item._geoloc;
      if (lng) setCenter([lng, lat]);
      setInitialized(true);
    }
    return () => { };
  }, [props.data]);
  useEffect(() => {
    if (props.center)
      setCenter(props.center);
  }, [props.center])
  return (
    <Wrapper >
      <Map
        ref={myRef}
        style={themes.basic}
        center={center}
        onClick={handleClick}
        onDblClick={onDblClick}
        onDragEnd={handleDragEnd}
        /* zoom={[props.zoom || 100]}
        minZoom={0}
        maxZoom={120} */
        containerStyle={mapStyle}
        onStyleLoad={onStyleLoad}
      >
        <ZoomControl />
        {type === "geojson" && (
          <GeoJSONLayer
            circleLayout={circleLayout}
            circlePaint={circlePaint}
            symbolLayout={symbolLayout}
            circleOnClick={onMarkClick}
            data={geojson}
          />
        )}
        {
          <>
            {props.data && props.data.map((item, index) => {
              let { lng, lat } = item._geoloc;
              if (lng >= -90 && lat <= 90) {
                return (
                  <Marker
                    key={index}
                    coordinates={[lng, lat]}
                    on
                    onClick={e => onMarkClick(item)}
                  >
                    {props.renderMarker ? (
                      <div
                        style={{
                          cursor: "pointer"
                        }}
                      >
                        {props.renderMarker(item, index)}
                      </div>
                    ) : (
                      <Mark />
                    )}
                  </Marker>
                );
              } else {
                return null;
              }
            })}
          </>
        }
      </Map>
    </Wrapper>
  );
};
export default MapBox;
