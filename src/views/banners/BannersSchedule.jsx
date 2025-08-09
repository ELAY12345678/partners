import React, { useState } from 'react';
import moment from 'moment';
import { Col, Calendar, message, Typography, Row, Divider, Button, Drawer, Image, Tag, Select, DatePicker, TimePicker, InputNumber, Form, Space, Input } from 'antd';
import locale from "antd/es/date-picker/locale/es_ES";

import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineMinusCircle, } from 'react-icons/ai';

import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/index';
import { getService } from '../../services';
import AsyncButton from '../../components/asyncButton';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { useCities } from '../../hooks/useCities';
import _ from 'lodash';
import { useBanners } from './hooks/useBanners';

const format = "h:mm a";
const formatValue = 'hh:mm a';

const location_screens = [
    {
        id: "home",
        name: "Home",
    },
    {
        id: "category",
        name: "Categoría",
    },
];

const columns = [
    {
        dataIndex: "banner",
        title: "Foto",
        render: (value) =>
            value?.banner_gallery?.path && <Image
                size="large"
                alt="Banner"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value.banner_gallery.path,
                    width: 90,
                    height: 35,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value.banner_gallery.path}`
                }}
            />
    },
    {
        dataIndex: "start_hour",
        editable: true,
        title: "Inicio",
        render: (value) => moment(value, formatValue).format(format),
    },
    {
        dataIndex: "end_hour",
        editable: true,
        title: "Fin",
        render: (value) => moment(value, formatValue).format(format),
    },
    {
        dataIndex: "priority",
        editable: true,
        title: "Prioridad",
    },
    {
        dataIndex: "location_screen",
        choices: location_screens,
        editable: true,
        title: "Ubicación",
    },
    {
        dataIndex: "location_screen_id",
        editable: true,
        title: "Ubicación Id",
    },
    {
        dataIndex: "banner",
        editable: false,
        title: "Banner",
        render: (value) => value?.name || ""
    },
    {
        dataIndex: "status",
        title: "Estado",
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
];

const STATUS = [
    {
        id: "active",
        name: "Active",
    },
    {
        id: "inactive",
        name: "Inactive",
    },
];

const BannersSchedule = ({ banners, loadingBanners }) => {

    const bannerSchedule = getService('banner-schedule');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBannerProgramming, setSelectedBannerProgramming] = useState();
    const [selectedCityId, setSelectedCityId] = useState();
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

    const [cities, loadingCities] = useCities();

    const handleChange = (date) => {
        try {
            setSelectedDate(date.format("YYYY-MM-DD"));
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (data.start_hour)
            data.start_hour = typeof data.start_hour == "object" ?
                moment(data.start_hour.format("HH:mm:ss"), "HH:mm:ss").format("HH:mm:ss")
                : moment(moment(data.start_hour, format)).format("HH:mm:ss");

        if (data.end_hour)
            data.end_hour = typeof data.end_hour == "object" ?
                moment(data.end_hour.format("HH:mm:ss"), "HH:mm:ss").format("HH:mm:ss")
                : moment(moment(data.end_hour, format)).format("HH:mm:ss");

        let payload = { ...data }
        if (data.range_dates) {
            payload = { ...data, ...data?.range_dates[0] };
            delete payload.range_dates;
            payload.range_date_end = moment(payload.range_date_end).format("YYYY-MM-DD");
            payload.range_date_start = moment(payload.range_date_start).format("YYYY-MM-DD");
        }

        if (!selectedBannerProgramming) {
            await bannerSchedule.create({
                ...payload,
                date: moment(selectedDate).format("YYYY-MM-DD")
            })
                .then(() => {
                    message.success("Programación Creada!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await bannerSchedule.patch(selectedBannerProgramming.id, payload)
                .then(() => {
                    message.success("Programación actualizada!");
                    setDrawerVisible(false);
                    setSelectedBannerProgramming();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const onEdit = (source) => {
        setSelectedBannerProgramming({
            ...source,
            start_hour: moment(source.start_hour, formatValue),
            end_hour: moment(moment(source.end_hour, formatValue)),
        });
        setDrawerVisible(true)
    };

    const onRemove = async ({ id }) => {
        await bannerSchedule.remove(id)
            .then(() => {
                message.success("Programación Eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    return (
        <>
            <Row style={{ height: '100%', marginBottom: '1rem' }} gutter={16}>
                <Col
                    xs={24} sm={24} md={24} lg={9} xl={7}
                >
                    <Row
                        style={{
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                            borderRadius: '1rem',
                            background: '#fff',
                            overflow: 'hidden',
                            padding: '0.5rem'
                        }}>
                        <Col
                        >
                            <Calendar
                                locale={locale}
                                size={"large"}
                                disabledDate={(currentDate) => {
                                    return !selectedCityId || currentDate < moment().subtract(1, "days")
                                }}
                                onChange={handleChange}
                                fullscreen={false}
                            />
                        </Col>
                    </Row>
                    <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                    <Row>
                        <Button
                            size='large'
                            type='primary'
                            block
                            icon={<AiOutlinePlus />}
                            style={{ borderRadius: '0.5rem' }}
                            disabled={!selectedCityId || moment(selectedDate).isBefore(moment().subtract(1, "days"))}
                            onClick={() => {
                                setSelectedBannerProgramming(undefined);
                                setDrawerVisible(true)
                            }}
                        >
                            Agregar
                        </Button>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={15} xl={17}>
                    <Grid
                        filterDefaultValues={{
                            date: selectedDate,
                            city_id: selectedCityId,
                            $sort: {
                                start_hour: 1
                            }
                        }}
                        columns={[
                            ...columns,
                            {
                                title: "Acciones",
                                dataIndex: 'id',
                                render: (id, record) => {
                                    return (
                                        <Row>
                                            <Button
                                                type="text"
                                                onClick={() => onEdit(record)}
                                                icon={<AiOutlineEdit />}
                                            />
                                            <AsyncButton
                                                type="link"
                                                onClick={() => onRemove({ id })}
                                                icon={<AiOutlineDelete />}
                                                confirmText="Desea eliminar?"
                                            >
                                            </AsyncButton>
                                        </Row>
                                    );
                                },
                            }
                        ]
                        }
                        source="banner-schedule"
                        permitFetch={!!(selectedCityId)}
                        actions={{}}
                        updateSource={updateSource}
                        title={
                            <Typography.Title level={5}>
                                {moment(selectedDate).format('LL')}
                            </Typography.Title>
                        }
                        extra={
                            <Select
                                allowClear
                                placeholder='Ciudad'
                                loading={loadingCities}
                                onChange={(value) => setSelectedCityId(value)}
                                onClear={() => setSelectedCityId()}
                                style={{ width: '15rem' }}
                            >
                                {
                                    _.map(cities, ({ id, name }, index) =>
                                        <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        }
                    />
                </Col>
            </Row>
            {
                drawerVisible
                &&
                <Drawer
                    title={
                        'Programar Banner'
                    }
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedBannerProgramming(undefined);
                    }}
                >
                    <Row justify="center">
                        <Col>
                            <Typography.Title level={4}>
                                {moment(selectedDate).format('LL')}
                            </Typography.Title>
                        </Col>
                    </Row>
                    <SimpleForm
                        initialValues={selectedBannerProgramming}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                    >
                        {
                            !(selectedBannerProgramming?.id) &&
                            <InputNumber
                                type="hidden"
                                name='city_id'
                                initial={selectedCityId}
                            />
                        }
                        <Select
                            flex={1}
                            name='banner_id'
                            label="Banner"
                            size='large'
                            validations={[{
                                required: true,
                                message: `Banner es requerido`,
                            }]}
                            loading={loadingBanners}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(banners, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <TimePicker
                            flex={0.5}
                            name='start_hour'
                            label="Hora inicio"
                            use12Hours={true}
                            minuteStep={30}
                            format={format}
                            validations={[{
                                required: true,
                                message: `Hora Inicio es requerida`
                            }]}
                        />
                        <TimePicker
                            flex={0.5}
                            name='end_hour'
                            label="Hora fin"
                            use12Hours={true}
                            minuteStep={30}
                            format={format}
                            validations={[{
                                required: true,
                                message: `Hora Fin es requerida`
                            }]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='priority'
                            size='large'
                            label='Prioridad'
                            validations={[{
                                required: true,
                                type: "number",
                                message: `Prioridad debe ser numérico y es requerido`,
                            }]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='location_screen_id'
                            label='Ubicación Id'
                            validations={[{
                                required: true,
                                type: "number",
                                message: `Ubicación Id debe ser numérico y es requerido`,
                            }]}
                        />
                        <Select
                            flex={1}
                            name='location_screen'
                            label="Ubicación"
                            size='large'
                            validations={[{
                                required: true,
                                message: `Ubicación es requerida`
                            }]}
                        >
                            {
                                _.map(location_screens, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            flex={1}
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[{
                                required: true,
                                message: `Estado es requerido`
                            }]}
                        >
                            {
                                _.map(STATUS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        {
                            !(selectedBannerProgramming?.id) &&
                            <Form.List name="range_dates" flex={1}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'range_date_start']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Fecha inicio es requerida',
                                                        },
                                                    ]}
                                                    label="Fecha de inicio"
                                                    format="YYYY-MM-DD"
                                                >
                                                    <DatePicker locale={locale} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'range_date_end']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Fecha final es requerida',
                                                        },
                                                    ]}
                                                    label="Fecha final"
                                                    format="YYYY-MM-DD"
                                                >
                                                    <DatePicker locale={locale} />
                                                </Form.Item>
                                                <AiOutlineMinusCircle onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item >
                                            <Button type="dashed" onClick={() => add()} block disabled={!_.isEmpty(fields)}>
                                                Configurar varias fechas?
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        }
                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BannersSchedule;