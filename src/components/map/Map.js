import React, { useState, useEffect, useRef, useCallback } from "react";
import { LoadScript, GoogleMap, Polygon, InfoWindow } from "@react-google-maps/api";
import { Wrapper } from "./Styles";
import { getService } from "../../services";
import { message } from "antd";
import _ from "lodash";

let count = 0;

const Map = ({
  onMapChange,
  onSelect,
  source = "polygon",
  reference,
  refresh,
  ...props
}) => {

  const [infoWindowVisible, setInfoWindowVisible] = useState();

  const [record, setRecord] = useState();
  const [polygons, setPolygons] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState();
  const [polygon, setPolygon] = useState();
  const [filterDefaultValues, setFilterDefaultValues] = useState();
  const [center, setCenter] = useState({
    lat: 52.52047739093263,
    lng: 13.36653284549709,
  });
  const [dragging, setDragging] = useState(false);

  const save = async (polygon, item) => {
    if (onMapChange && item) {
      await onMapChange(polygon, item);
    }
  };

  const onChangePolygon = _.debounce(save, 800, { maxWait: 1000 });
  // Store Polygon path in state
  const [path, setPath] =
    useState(/* [
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ] */);
  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);


  const handleSave = _.debounce(save, 800, { maxWait: 800 });
  // Call setPath with new edited path
  const onEdit = useCallback(
    (e, record) => {
      let item = listenersRef.current.find((it) => it.id == record.id);
      if (item && item.polygon) {
        let { polygon } = item;
        const nextPath = polygon
          .getPath()
          .getArray()
          .map((latLng) => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
        setPath(nextPath);
      }
      setSelected(record);
      /* if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
        } */
      onChangePolygon(e, record);
      // console.log("--> ", e, record);
    },
    [setPath]
  );
  // Bind refs to current Polygon and listeners
  const onLoad = (polygon, record) => {
    // console.log("Polygon loaded: ", polygon, record);
    if (record) {
      if (
        typeof listenersRef.current.find((it) => record.id == it.id) ==
        "undefined"
      ) {
        record["polygon"] = polygon;
        // console.log("polygon: ", polygon);
        listenersRef.current.push(record);
        /* polygonRef.current = polygon; */
      }
      setInitialized(listenersRef.current.length >= dataSource.length);
    }
    /*
         polygonRef.current = polygon;
         console.log("Path:: ", path)
         listenersRef.current.push(
             path.addListener("set_at", onEdit),
             path.addListener("insert_at", onEdit),
             path.addListener("remove_at", onEdit)
         );
         const path = polygon.getPath();
         polygon
         .push(
             path.addListener("set_at", onEdit),
             path.addListener("insert_at", onEdit),
             path.addListener("remove_at", onEdit)
             );
             */
  };
  // Clean up refs
  const onUnmount = useCallback(() => {
    /* listenersRef.current.forEach(it => it.polygon.remove()); */
    polygonRef.current = null;
  }, []);

  const getData = () => {
    if (reference) {
      setLoading(true);
      const service = getService(reference);
      service
        .find({
          query: {
            ...filterDefaultValues,
            $limit: 50,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          setDataSource(
            data.map((it) => ({
              path: JSON.parse(it.polygon),
              ...it,
            }))
          );
        })
        .catch((err) => {
          setLoading(false);
          message.error(err.message);
        });
    }
  };

  const handleEdit = async (e, record) => {
    if (record) {
      setSelected(record);
      /*  onEdit(e, record); */
    }
  };

  useEffect(() => {
    if (!_.isEqual(props.polygon, polygon)) setPath(props.polygon);
  }, [props.polygon]);

  useEffect(() => {
    if (!_.isEqual(props.record, record)) setRecord(props.record);
  }, [props.record]);

  /* useEffect(() => {
        if (path && !initialized) {
            setInitialized(true);
        }
        if (path && initialized) {
            if (selected && selected.id)
                handleSave(path, record);
        }
    }, [path]); */

  useEffect(() => {
    if (!_.isEqual(props.filterDefaultValues, filterDefaultValues))
      setFilterDefaultValues(props.filterDefaultValues);
  }, [props.filterDefaultValues]);

  useEffect(() => {
    if (filterDefaultValues) getData();
  }, [filterDefaultValues, refresh]);

  useEffect(() => {
    /* if (polygon && selected) {
            onChangePolygon(polygon, selected);
        } */
    /* if (onSelect) onSelect(selected); */
  }, [polygon]);

  useEffect(() => {
    if (props.polygon && props.polygon.lat && props.polygon.lng) {
      let latLng = props.polygon;
      setCenter({
        lat: latLng.lat,
        lng: latLng.lng,
      });
    }
  }, [props.polygon]);

  const getBounds = (polygon) => {
    var bounds = new window.google.maps.LatLngBounds();
    polygon.getPath().forEach((element, index) => {
      bounds.extend(element);
    });
    return bounds;
  };

  useEffect(() => {
    if (props.selected && !_.isEqual(props.selected, selected)) {
      setSelected(props.selected);
      let record = listenersRef.current.find(
        (it) => props.selected.id == it.id
      );
      if (record) {
        let { polygon } = record;
        if (polygon) {
          let path = getBounds(polygon);
          let latLng = path.getCenter();
          setCenter({
            lat: latLng.lat(),
            lng: latLng.lng(),
          });
        }
      }
    }
  }, [props.selected]);

  // if (loading) return "Cargando...";
  return (
    <Wrapper height={props.height} className="App">
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyBbsQSRn1eit85DvTMfTFR07HYMbjVkzqA"
        language="en"
        region="us"
      >
        <GoogleMap
          loading={loading}
          mapContainerClassName="app-map"
          center={center}
          zoom={11}
          version="weekly"
          on
        >
          {
            infoWindowVisible &&
            <InfoWindow
              position={infoWindowVisible?.positionInfo}
              open={true}
              onCloseClick={(e) => {
                setInfoWindowVisible();
              }}
            >
              <div style={{ backgroundColor: 'white', padding: 15 }}>
                <div style={{ fontSize: 15, fontColor: `#08233B` }}>
                  {infoWindowVisible.name}
                  <br />
                  {window.google.maps.geometry.spherical.computeArea(infoWindowVisible.polygon.getPath()) / 1000000} km<sup>2</sup>
                </div>
              </div>
            </InfoWindow >
          }

          {dataSource &&
            dataSource.map((it) => (
              <Polygon
                // Make the Polygon editable / draggable
                editable={selected && it.id == selected.id}
                options={{
                  strokeColor: it.color || "#FF0000",
                  fillColor: it.color || "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillOpacity: 0.3,
                }}
                draggable={true}
                path={it.path}
                onMouseDown={() => {
                  let interval = setTimeout(() => {
                    count++;
                    if (count > 5) {
                      setDragging(true);
                      clearTimeout(interval);
                    }
                  }, 100);
                }}
                // Event used when manipulating and adding points
                onMouseUp={(e) => {
                  if (selected) {
                    let item = listenersRef.current.find(
                      (item) => item.id == it.id
                    );
                    if (item) {
                      let polygon = item.polygon;
                      if (polygon) {
                        const nextPath = polygon
                          .getPath()
                          .getArray()
                          .map((latLng) => {
                            return {
                              lat: latLng.lat(),
                              lng: latLng.lng(),
                            };
                          });
                        if (selected.id != it.id) setSelected(it);
                        /* item.polygon = nextPath; */
                        /* setPath(nextPath); */
                        /* setPolygon(nextPath); */
                        onChangePolygon(nextPath, item);
                      }
                    }
                  } else if (!selected) {
                    setSelected(it);
                  }

                  /* if (selected && it.id == selected.id) {
                                  if (item) {
                                      let { polygon } = item;
                                      if (polygon) {
                                          const nextPath = polygon
                                              .getPath()
                                              .getArray()
                                              .map(latLng => {
                                                  return {
                                                      "lat": latLng.lat(),
                                                      "lng": latLng.lng()
                                                  };
                                              });
                                          onEdit(nextPath, selected);
                                      }
                                  }
                              } */
                }}
                // Event used when dragging the whole Polygon
                onDragEnd={(e) => {
                  setDragging(false);
                  if (selected) {
                    let item = listenersRef.current.find(
                      (item) => item.id == it.id
                    );
                    if (item) {
                      let polygon = item.polygon;
                      if (polygon) {
                        const nextPath = polygon
                          .getPath()
                          .getArray()
                          .map((latLng) => {
                            return {
                              lat: latLng.lat(),
                              lng: latLng.lng(),
                            };
                          });
                        if (selected.id != it.id) setSelected(it);
                        /* item.polygon = nextPath; */
                        /* setPath(nextPath); */
                        /* setPolygon(nextPath); */
                        onChangePolygon(nextPath, item);
                      }
                    }
                  } else if (!selected) {
                    setSelected(it);
                  }
                }}
                onClick={(e) => {
                  if (selected) {
                    let item = listenersRef.current.find(
                      (item) => item.id === it.id
                    );
                    let path = getBounds(item.polygon);
                    let latLng = path.getCenter();
                    setInfoWindowVisible({
                      ...item,
                      positionInfo: {
                        lat: latLng.lat(),
                        lng: latLng.lng(),
                      }
                    });
                  }
                }
                }
                /* onLoad={onLoad} */
                onLoad={(polygon) => onLoad(polygon, it)}
                onUnmount={onUnmount}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </Wrapper>
  );
};
export default Map;
