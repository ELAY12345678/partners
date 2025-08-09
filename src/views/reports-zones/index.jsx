import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
    Col,
    Row,
    List,
    Button,
    Input,
    message,
    Dropdown,
    Menu,
    Layout,
    Select,
    InputNumber
} from "antd";
import { MyModal } from "../../components/com/MyModal";
import ColorField from "../../components/com/fields/ColorField";
import { WrapperList } from "./Styles";
import Map from "../../components/map/Map";
import { SimpleForm } from "../../components/com/form/";
import { getService } from "../../services";
import { money } from "../../utils";

import { AiOutlinePlus, AiOutlineMore, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { useCities } from '../../hooks/useCities';


const MenuItems = ({
    onChange,
    actions = { edit: true, delete: true },
    ...props
}) => (
    <Menu
        className={props.className || "list-menu"}
        onClick={({ key }) => {
            if (onChange) onChange(key, props.record);
        }}
        items={[
            actions.edit && {
                key: 'edit',
                label: 'Editar',
                icon: <AiOutlineEdit />
            },
            actions.delete && {
                key: 'delete',
                label: 'Eliminar',
                icon: <AiOutlineDelete />
            }
        ]}
    />
);

const ListPolygons = ({
    onSelect,
    filterDefaultValues,
    refresh,
    onSubmit,
    onItemSelect,
    cities_id,
    cities,
    reference,
    buttonText,
    title,
    ...props
}) => {
    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [center, setCenter] = useState([
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 },
    ]);
    const [selected, setSelected] = useState();

    const handleSelect = (item) => {
        if (onItemSelect) onItemSelect(item);
        setSelected(item);
    };
    const handleAdd = () => {
        setSelected(null);
        setVisible(true);
    };
    const removePolygon = (id) => {
        const service = getService("report-zones");
        service
            .remove(id)
            .then((res) => {
                message.success("Polígono eliminado!");
                if (onSubmit) onSubmit();
                getData();
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    const handleChange = (key, item) => {
        switch (key) {
            case "edit":
                setSelected(item);
                setVisible(true);
                break;
            case "delete":
                if (item.id) removePolygon(item.id);
                break;
            default:
                break;
        }
    };
    const renderItem = (record, index) => {
        let item = record;
        return (
            <List.Item
                key={index}
                actions={[
                    <div>
                        <Dropdown
                            trigger={["click"]}
                            overlay={() => (
                                <MenuItems
                                    onChange={(key) => handleChange(key, item)}
                                    record={item}
                                />
                            )}
                        >
                            <Button type="link" icon={<AiOutlineMore />} />
                        </Dropdown>
                    </div>,
                ]}
                className={`item ${selected && selected.id == item.id ? "selected" : ""
                    }`}
                onClick={() => {
                    if (item) handleSelect(item);
                }}
            >
                <div className="item-container">
                    <div className="item-color">
                        <div
                            style={{
                                background: item.color || "#cccccc4a",
                            }}
                            className="color"
                        />
                    </div>
                    <div className="item-name">
                        <div className="name">{record.name}</div>
                        {record.price && (
                            <div className="item-price">{money(record.price)}</div>
                        )}
                    </div>
                </div>
            </List.Item>
        );
    };
    const getData = () => {
        if (reference) {
            const service = getService(reference);
            setLoading(true);
            service
                .find({
                    query: {
                        ...filterDefaultValues,
                        $limit: 50,
                        $sort: {
                            id: -1
                        }
                    },
                })
                .then(({ data }) => {
                    setDataSource(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    message.error(err.message);
                });
        }
    };
    const handleOnSubmit = (err, data) => {
        if (err) return message.error(err.message);
        setVisible(false);
        setSelected(null);
        if (onItemSelect) onItemSelect(data);
        setSelected(data);
        if (onSubmit) onSubmit(data);
        getData();
    };

    useEffect(() => {
        getData();
    }, [props.restaurant_id, refresh]);

    useEffect(() => {
        if (props.selected) setSelected(props.selected);
    }, [props.selected]);

    useEffect(() => {
        onSelect(selected);
    }, [selected]);

    useEffect(() => {
        if ((!selected?.id) && props.center && props.center.lat && props.center.lng) {
            let polygons = [];
            let { google } = window;
            if (
                google &&
                google.maps &&
                google.maps.geometry &&
                google.maps.geometry.spherical
            ) {
                var distance = 1000; // metres
                var pointA = new google.maps.LatLng(props.center.lat, props.center.lng);
                var pointB = google.maps.geometry.spherical.computeOffset(
                    pointA,
                    distance,
                    0
                );
                var angle = google.maps.geometry.spherical.computeHeading(
                    pointA,
                    pointB
                );
                // setting angle to 90 degrees
                var newAngle = angle + 90; // OR angle - 90
                // get new point C
                var pointC = google.maps.geometry.spherical.computeOffset(
                    pointA,
                    distance,
                    newAngle
                );
                // console.log(pointC.lat(), pointC.lng(), "lat, lng");
                polygons.push({
                    lat: pointA.lat(),
                    lng: pointA.lng(),
                });
                polygons.push({
                    lat: pointB.lat(),
                    lng: pointB.lng(),
                });
                polygons.push({
                    lat: pointC.lat(),
                    lng: pointC.lng(),
                });
                setCenter(polygons);
            }
        }
    }, [props.center]);

    return (
        <WrapperList>
            <List
                header={
                    <div className="head">
                        <h3>{title}</h3>
                        <div className="head-tools">
                            <Button onClick={handleAdd} type="primary" block icon={<AiOutlinePlus />}>
                                {buttonText || "Agregar Zona de Cobertura"}
                            </Button>
                        </div>
                    </div>
                }
                renderItem={renderItem}
                dataSource={dataSource}
            />
            <MyModal
                title={selected && selected?.id ? "Editar Polígono" : "Crear Polígono"}
                width={700}
                onCancel={() => {
                    setVisible(false);
                    setSelected(null);
                }}
                visible={visible}
            >
                <SimpleForm
                    id={selected && selected.id}
                    source="report-zones"
                    onSubmit={handleOnSubmit}
                    query={{ $select: ['id', 'name', 'color', 'city_id', 'danger_level'] }}
                    allowNull={true}
                >
                    <Input
                        name="name"
                        flex={1}
                        label="Nombre"
                        placeholder="Nombre"
                        validations={[
                            {
                                required: true,
                                message: "Este campo es requerido"
                            },
                        ]}
                    />

                    <Select
                        flex={1}
                        name="danger_level"
                        label="Danger level"
                        placeholder="Danger level null - No hay riesgo"
                        allowClear
                    >

                        <Select.Option key={1} value={1}>
                            1 - No hay riesgo
                        </Select.Option>
                        <Select.Option key={2} value={2}>
                            2 - Riesgo minimo
                        </Select.Option>
                        <Select.Option key={3} value={3}>
                            3 - Riesgo maximo
                        </Select.Option>
                    </Select>
                    
                    <Input
                        type="hidden"
                        name="city_id"
                        initial={Number(props.restaurant_id)}
                    />
                    <ColorField
                        flex={1}
                        name="color"
                        label="Color"
                        placeholder="Color"
                        validations={[
                            { required: true, message: "Este campo es requerido" },
                        ]}
                    />
                    {
                        !(selected?.id) &&
                        < Input type="hidden" name="polygon" initial={center} />
                    }
                </SimpleForm>
            </MyModal>
        </WrapperList>
    );
};

const ReportZones = ({ record, ...props }) => {

    const [cityId, setCityId] = useState(); // id city selected
    const [citySelected, setCitySelected] = useState(); // target city data
    const [polygon, setPolygon] = useState();
    const [item, setItem] = useState();
    const [refresh, setRefresh] = useState(false);
    const [render, setRender] = useState(true);

    const [cities, loadingCities] = useCities();


    const handleOnSubmit = () => {
        setRefresh((refresh) => !refresh);
        setRender(false);
    };
    const handleOnSelect = (item) => {
        setItem(item);
        setRefresh((refresh) => !refresh);
        if (item.polygon) setPolygon(JSON.parse(item.polygon));
    };
    const handleOnChange = (polygon, item) => {
        if (_.differenceBy(polygon, item.path, 'lat', 'lng').length === 0)
            return;
        const service = getService("report-zones");
        return service
            .patch(item.id, {
                polygon: polygon,
            })
            .then((res) => {
                message.success("Polígono Actualizado!");
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        setTimeout(() => {
            setRender(true);
        }, 100);
    }, [render]);

    useEffect(() => {
        if (cityId) setCitySelected(cities.filter((it) => it.id === cityId));
        setRender(false);
    }, [cityId, cities]);

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row style={{ height: '100%' }}>
                <Col
                    span={6}
                    style={{
                        boxShadow: "1px 3px 23px 1px rgba(0, 0, 0, 0.095)",
                        borderRadius: "12px !important",
                        background: 'white',
                        height: '100%',
                        overflow: 'auto'
                    }}
                >
                    <Select
                        loading={loadingCities}
                        style={{
                            width: "100%",
                            padding: '8px'
                        }}
                        placeholder="Selecciona una ciudad"
                        onSelect={(e) => {
                            setCityId(e);
                        }}
                    >
                        {
                            cities.map(({ id, name }, index) =>
                                <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            )
                        }
                    </Select>

                    {cityId > 0 && (
                        <ListPolygons
                            reference="report-zones"
                            filterDefaultValues={{
                                city_id: cityId,
                            }}
                            center={{
                                lat: citySelected && parseFloat(citySelected[0].lat),
                                lng: citySelected && parseFloat(citySelected[0].lng),
                            }}
                            selected={item}
                            refresh={refresh}
                            onSelect={(item) => setItem(item)}
                            onSubmit={handleOnSubmit}
                            onItemSelect={handleOnSelect}
                            restaurant_id={cityId}
                            cities={citySelected && citySelected[0]}
                        />
                    )}
                </Col>
                {cityId > 0 && (
                    <Col
                        span={18}
                        style={{
                            boxShadow: "1px 3px 23px 1px rgba(0, 0, 0, 0.095)",
                            borderRadius: "12px !important",
                            background: 'white'
                        }}
                    >
                        {render && (
                            <Map
                                height={'100%'}
                                reference="report-zones"
                                onMapChange={handleOnChange}
                                onSelect={(item) => setItem(item)}
                                record={item}
                                selected={item}
                                filterDefaultValues={{
                                    city_id: cityId,
                                }}
                                polygon={{
                                    lat: citySelected && parseFloat(citySelected[0].lat),
                                    lng: citySelected && parseFloat(citySelected[0].lng),
                                }}
                                refresh={false}
                                item_id={item && item.id}
                            />
                        )}
                    </Col>
                )}
            </Row>
        </Layout.Content>
    );
};
export default ReportZones;
