import React, { useState, useEffect, useRef, useCallback } from "react";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Wrapper, WraperMarker,Mark } from "./Styles";
import { Icon, message } from "antd";
import _ from "lodash";
// import MyCardGlobal from "../card/MyCardGlobal";
import { getService } from "../../../services";


const Map = ({ onMapChange, favorites, filterDefaultValues, iconSize = 20, source = "polygon", reference, ...props }) => {
    const [record, setRecord] = useState();
    const [initialized, setInitialized] = useState(false);
    const [selected, setSelected] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [center, setCenter] = useState({
        lat: 10.458522,
        lng: -74.608857
    });
    const save = (polygon) => {
        if (onMapChange) return onMapChange(polygon);
    }

    const onChangePolygon = _.debounce(save, 1000, { maxWait: 3000 });
    // Store Polygon path in state
    const [path, setPath] = useState(/* [
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
    ] */);
    // Define refs for Polygon instance and listeners
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);
    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
        }
    }, [setPath]);
    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        polygon => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );
    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach(lis => lis.remove());
        polygonRef.current = null;
    }, []);
    console.log("The path state is", path);
    const getData = () => {
        if (reference) {
            const service = getService(reference);
            service.find({
                query: {
                    ...filterDefaultValues
                }
            })
                .then(({ data }) => {
                    setDataSource(data);
                })
                .catch(err => {
                    message.error(err.message);
                });
        }
    }
    useEffect(() => {
        if (props.polygon)
            setPath(props.polygon);
    }, [props.polygon])
    useEffect(() => {
        if (props.record)
            setRecord(props.record);
    }, [props.record])
    useEffect(() => {
        if (path && !initialized) {
            setInitialized(true);
        }
        if (path && initialized) {
            if (onChangePolygon) onChangePolygon(path);
        }
    }, [path]);
    useEffect(() => {
        if (props.dataSource)
            setDataSource(props.dataSource);
    }, [props.dataSource]);
    useEffect(() => {
        if (props.center && props.center.lat && props.center.lng) {
            setCenter({
                "lat": parseFloat(props.center.lat),
                "lng": parseFloat(props.center.lng),
            });
        }
    }, [props.center]);
    return (
        <Wrapper {...props} className="App">
            {/* JSON.stringify(record) */}
            <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyBbsQSRn1eit85DvTMfTFR07HYMbjVkzqA"
                language="en"
                region="us"
            >
                <GoogleMap
                    mapContainerClassName="app-map"
                    center={center}
                    onClick={() => {
                        setSelected(null);
                    }}
                    zoom={props.zoom || 12}
                    version="weekly"
                    on
                >
                    {
                        dataSource.map((mark, index) => {
                            let location = {
                                "lat": parseFloat(mark.lat),
                                "lng": parseFloat(mark.lng),
                            }
                            return (<Marker
                                className={"item-marker"}
                                key={index}
                                /* icon={
                                    props.showInfo && selected != index ? "/images/pin-black.svg" : "/images/pin-white.svg"
                                } */
                                position={location}
                                onMouseOver={() => {
                                    if (props.onToggleOpen)
                                        props.onToggleOpen(index);
                                }}
                                onClick={() => {
                                    setSelected(index);
                                    if (props.onToggleOpen)
                                        props.onToggleOpen(index)
                                }}
                            >
                                 <Mark />
                                 {props.showInfo && selected === index ?
                                    <InfoWindow
                                        className="info-window"
                                        position={location}
                                        onC
                                        onCloseClick={() => {
                                            setSelected(null);
                                            if (props.onToggleOpen)
                                                props.onToggleOpen(index)
                                        }}
                                    >
                                       
                                    </InfoWindow>
                                    : null}
                            </Marker>)
                        })
                    }
                </GoogleMap>
            </LoadScript>
        </Wrapper>
    );
}
export default Map;