import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _moment from "moment-timezone";
import { Badge } from '../Styles';
import { Col, Row, Avatar, Typography, Button, Divider, Input, message, Rate, Radio, Tooltip, Form, Space } from 'antd';
import { URL_S3, DEFAULT_USER_AVATAR, S3_PATH_IMAGE_HANDLER } from '../../../constants';

import partyEmoji from '../../../sources/icons/partyEmoji.svg';
import cryEmoji from '../../../sources/icons/cryEmoji.svg';
import roundTicket from '../../../sources/icons/roundTicket.svg';
import squareTicket from '../../../sources/icons/squareTicket.svg';
import marker from '../../../sources/icons/marker.svg';

import { AiFillInfoCircle } from 'react-icons/ai';
import { HiOutlinePencil } from 'react-icons/hi';
import { FiUsers, FiClock } from 'react-icons/fi';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { getService } from '../../../services';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import AsyncButton from '../../../components/asyncButton';
import ContainerReservationDetails from './ContainerReservationDetails';
import { useMedia } from 'react-use';

const STATUS_RESERVATION = {
    claimed: "claimed",
    notClaimed: "notClaimed",
    notApproved: "notApproved",
    acquired: "acquired",
    pendingApproval: 'pendingApproval',
    canceledByEstablishment: "canceledByEstablishment"
};

const verifyMetaStartHour = ({ item }) => {
    var now = moment().tz("America/Bogota"); //todays date
    var end = moment(item.meta_day + " " + item.meta_start_hour); // another date
    var duration = moment.duration(end.diff(now));
    var minutes = duration.asMinutes();
    if (minutes < 0) return true;
    else return false;
}

const ReservationsDetails = ({ setReservationDetails, handleUpdateCurrentReservationDetails }) => {


    const dropEstablishmentFilters = useMedia("(max-width: 767px)");

    const formRef = React.createRef();

    const userRatingService = getService('establishments-users-ratings');

    const [reservationPersons, setReservationPersons] = useState(0);
    const [invoiceValue, setInvoiceValue] = useState('');

    const [userRatingData, setUserRatingData] = useState();

    const item = useSelector(({ dashboardReducer }) => dashboardReducer.currentReservationDetails);

    const handleChangeReservationStatus = async ({ status, item }) => {
        var now = _moment().tz("America/Bogota");
        var end = _moment(item.meta_day + " " + item.meta_start_hour);
        var duration = _moment.duration(end.diff(now));
        var minutes = duration.asMinutes();
        if (
            (minutes > 30 && status === STATUS_RESERVATION.claimed) ||
            (minutes > 0 && status === STATUS_RESERVATION.notClaimed)
        ) {
            message.error(
                "Aún no puedes marcar esta reserva ya que no ha iniciado. La reserva inicia a las: "
                + item.meta_start_hour
                + " horas."
            );
        } else {
            const reservationService = getService("reservations");
            await reservationService
                .patch(item.id, {
                    status,
                })
                .then((res) => {
                    handleUpdateCurrentReservationDetails({})
                    message.success(
                        status === STATUS_RESERVATION.canceledByEstablishment
                            ? "Reserva Cancelada!"
                            : "Reserva actualizada!"
                    )
                })
                .catch((err) => {
                    message.error(err.message)

                });
        }
    };

    const handleChangePersons = async ({ item, persons }) => {
        if (
            verifyMetaStartHour({ item }) &&
            item.status === "acquired"
        ) {
            if (item.id) {
                const reservationService = getService("reservations");
                await reservationService
                    .patch(item.id, { persons })
                    .then((res) => {
                        message.success(res.message || "Numero de Personas actualizado!")
                        setReservationPersons(0);
                        handleUpdateCurrentReservationDetails({ ...res, key: item.key });
                    })
                    .catch((err) => message.error(err.message));
            }
        } else {
            message.error(
                "Aún no ha iniciado la reserva. Solo puedes cambiar el numero de personas cuando el comensal este en el lugar."
            );
        }
    };

    const handleSaveInvoiceValue = async ({ item, value }) => {

        if (verifyMetaStartHour({ item })) {
            if (
                value > 1000 &&
                value < 10000000
            ) {
                const reservationService = getService("reservations");
                await reservationService
                    .patch(item.id, {
                        reported_invoice_amount: value
                    }).then((res) => {
                        message.success("Pago de reservación registrado");
                        handleUpdateCurrentReservationDetails({ ...res, key: item.key });
                    })
                    .catch((err) => message.error(err.message));
            } else {
                message.error(
                    "Recuerda que el valor debe ser inferior a 10.000.000 y superior que 1000"
                );
            }
        } else {
            message.error(
                "Aún no ha iniciado la reserva. Solo puedes cambiar el valor de la factura cuando el comensal este en el lugar."
            );
        }
    };

    const onSubmit = async (data) => {
        if (userRatingData?.id)
            await userRatingService.patch(userRatingData.id, {
                establishment_branch_id: item.establishment_branch_id,
                establishment_id: item.establishment_id,
                user_id: item.user_id,
                reservation_id: item.id,
                ...data,
            }).then((response) => {
                message.success('Calificación actualizada!');
                setUserRatingData(response);
            }).catch((error) => {
                message.error(error.message)
            })
        else
            await userRatingService.create({
                establishment_branch_id: item.establishment_branch_id,
                establishment_id: item.establishment_id,
                user_id: item.user_id,
                reservation_id: item.id,
                ...data,
            }).then((response) => {
                message.success('Calificación guardada!');
                setUserRatingData(response);
            }).catch((error) => {
                message.error(error.message)
            })
    }

    const handleSubmitUserRating = async () => {
        var now = _moment().tz("America/Bogota");
        var end = _moment(item.meta_day + " " + item.meta_start_hour);
        var duration = _moment.duration(end.diff(now));
        var minutes = duration.asMinutes();
        if (minutes > 0) {
            message.error(
                "Aún no puedes calificar esta reserva ya que no ha iniciado. La reserva inicia a las: "
                + item.meta_start_hour
                + " horas."
            );
        } else {
            await formRef.current.validateFields()
                .then(async (data) => {
                    await Promise.resolve(onSubmit(data));
                })
                .catch(() => console.log('No valido'))
        }
    };

    useEffect(() => {
        return () => {
            setInvoiceValue('');
            setReservationPersons(0);
            setUserRatingData();
            formRef.current?.resetFields();
        }
    }, [item]);

    useEffect(() => {
        formRef.current?.resetFields();
    }, [item]);

    useEffect(() => {
        if (item.id)
            userRatingService.find({
                query: {
                    reservation_id: item.id
                }
            }).then(({ data }) => {
                if (data?.length > 0) {
                    setUserRatingData(data[0]);
                }
                else
                    setUserRatingData();
            }).catch(err => {
                message.error(err.message);
                setUserRatingData();
            })
    }, [item])

    if (_.isEmpty(item)) return <></>
    else
        return (
            <ContainerReservationDetails
                title={item.key.title}
                onClose={() =>
                    setReservationDetails({})
                }
            >
                <Col style={{ width: '100%' }}>
                    <Row
                        align='middle'
                        gutter={[8, 8]}
                    >
                        <Col flex='auto'>
                            <Row align='middle' gutter={8}>
                                <Col>
                                    {
                                        item?.meta_user_logo_path ? (
                                            <Avatar
                                                size={50}
                                                src={
                                                    `${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                                        url: item.meta_user_logo_path,
                                                        width: 64,
                                                        height: 64,
                                                    })}`
                                                }
                                            />
                                        ) : (
                                            <Avatar
                                                size={50}
                                                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                                    url: DEFAULT_USER_AVATAR,
                                                    width: 64,
                                                    height: 64,
                                                })}`}
                                            />
                                        )
                                    }
                                </Col>
                                <Col>
                                    <Typography.Title level={5}>
                                        {item?.meta_user_first_name || ""} {item?.meta_user_last_name || ""}
                                    </Typography.Title>
                                </Col>
                            </Row>
                        </Col>

                        {(item.status === STATUS_RESERVATION.acquired || item.status === STATUS_RESERVATION.pendingApproval) && (
                            <Col>
                                <Row gutter={16}>
                                    <Col>
                                        <AsyncButton
                                            style={{
                                                minHeight: '6rem',
                                                width: '6rem',
                                                borderRadius: '1rem',
                                                border: '1px solid #53E38B',
                                                color: '#3CC471',
                                            }}
                                            onClick={async () => {
                                                await handleChangeReservationStatus({
                                                    status: item.status === STATUS_RESERVATION.pendingApproval
                                                        ? STATUS_RESERVATION.acquired
                                                        : STATUS_RESERVATION.claimed
                                                    , item
                                                })
                                            }}
                                            icon={
                                                <Row align='middle' justify='center' style={{ fontSize: '3em' }}>
                                                    <Col>
                                                        <img src={partyEmoji} alt='icon button' height={'45em'} />
                                                    </Col>
                                                </Row>
                                            }
                                        >
                                            <Row align='middle' justify='center'>
                                                <Col>
                                                    {
                                                        item.status === STATUS_RESERVATION.pendingApproval
                                                            ? 'Aprobar'
                                                            : 'Llegó'
                                                    }
                                                </Col>
                                            </Row>
                                        </AsyncButton>
                                    </Col>
                                    <Col>
                                        <AsyncButton
                                            style={{
                                                minHeight: '6rem',
                                                width: '6rem',
                                                borderRadius: '1rem',
                                                color: '#E83737',
                                                border: '1px solid #E83737'
                                            }}
                                            confirmText={item.status === STATUS_RESERVATION.pendingApproval ? undefined : 'Esta seguro que el usuario no vino?'}
                                            onClick={async () => {
                                                await handleChangeReservationStatus({
                                                    status: item.status === STATUS_RESERVATION.pendingApproval
                                                        ? STATUS_RESERVATION.notApproved
                                                        : STATUS_RESERVATION.notClaimed
                                                    , item
                                                })
                                            }}
                                            icon={
                                                <Row align='middle' justify='center' style={{ fontSize: '3em' }}>
                                                    <Col>
                                                        <img src={cryEmoji} alt='icon button' height={'45em'} />
                                                    </Col>
                                                </Row>
                                            }
                                        >
                                            <Row align='middle' justify='center'>
                                                <Col>
                                                    {
                                                        item.status === STATUS_RESERVATION.pendingApproval
                                                            ? 'Cancelar'
                                                            : 'No Llegó'
                                                    }
                                                </Col>
                                            </Row>
                                        </AsyncButton>
                                    </Col>
                                </Row>
                            </Col>
                        )}

                    </Row>
                    <Divider style={{ background: 'rgb(249,143,102,0.22)', margin: '7px 0px' }} />
                    <Row align='middle' gutter={[8, 8]}>
                        <Col sm={24} md={12} >
                            <Row align='middle' gutter={16}>
                                <Col flex={'50px'}>
                                    <Avatar
                                        size={40}
                                        src={`${URL_S3}${item.meta_establishment_path_logo || DEFAULT_USER_AVATAR}`}
                                    />
                                </Col>
                                <Col flex={'none'} style={{ wordBreak: 'break-all' }}>
                                    <Row >
                                        <Col>
                                            {item?.meta_establishment_name}
                                        </Col>
                                        {
                                            dropEstablishmentFilters && <Col>, {item?.meta_establishment_branch_address}</Col>
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        {
                            !dropEstablishmentFilters &&
                            <Col >
                                <Row align='middle' gutter={8}>
                                    <Col flex={25}>
                                        <img src={marker} alt='marker' height={20} width={20} />
                                    </Col>
                                    <Col flex={'auto'}>
                                        <div>
                                            {item?.meta_establishment_branch_address}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        }

                    </Row>
                    <Divider style={{ background: 'rgb(249,143,102,0.22)', margin: '7px 0px' }} />

                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Row gutter={[6, 6]}>
                            <Col span={12}>
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <Row>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Personas y descuentos
                                        </Typography.Title>
                                    </Row>
                                    <Row gutter={8} align="middle">
                                        <Col>
                                            <FiUsers size={17} />
                                        </Col>
                                        {
                                            reservationPersons === 0 ? (
                                                <>
                                                    <Col>
                                                        {item?.persons} persona
                                                        {item?.persons > 1 ? "s" : ""}
                                                    </Col>
                                                    {item.status === STATUS_RESERVATION.acquired && (
                                                        <Col>
                                                            <Button
                                                                style={{
                                                                    borderRadius: '0.5rem'
                                                                }}
                                                                onClick={() => setReservationPersons(item.persons || 1)}
                                                                type='text'
                                                                shape='circle'
                                                                icon={<HiOutlinePencil color='#6B24F8' />}
                                                            />
                                                        </Col>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Col>
                                                        <Input
                                                            min={1}
                                                            max={10}
                                                            type='number'
                                                            value={reservationPersons}
                                                            onChange={(e) => setReservationPersons(e.target.value)}
                                                            style={{
                                                                borderRadius: '0.5rem'
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <AsyncButton
                                                            style={{
                                                                borderRadius: '0.5rem',
                                                            }}
                                                            type='primary'
                                                            confirmText="¿Seguro? El cliente recibirá un mensaje indicándole que el restaurante modifico el numero de personas."
                                                            onClick={async () =>
                                                                await handleChangePersons({ item, persons: parseInt(reservationPersons) })
                                                            }
                                                        >
                                                            Guardar
                                                        </AsyncButton>
                                                    </Col>
                                                </>
                                            )
                                        }
                                    </Row>
                                    {
                                        item?.meta_percentage && (
                                            <Row align='middle' gutter={8}>
                                                <Col>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 11.002 11.002">
                                                        <g id="Grupo_19070" data-name="Grupo 19070" transform="translate(-2.499 -2.499)">
                                                            <path id="Trazado_2033" data-name="Trazado 2033" d="M7.172,3.369a1.111,1.111,0,0,1,1.656,0l.389.434a1.111,1.111,0,0,0,.889.368l.583-.032A1.111,1.111,0,0,1,11.86,5.311l-.032.583a1.111,1.111,0,0,0,.368.889l.434.389a1.111,1.111,0,0,1,0,1.656l-.434.389a1.111,1.111,0,0,0-.368.889l.032.583a1.111,1.111,0,0,1-1.171,1.171l-.583-.032a1.111,1.111,0,0,0-.889.368l-.389.434a1.111,1.111,0,0,1-1.656,0L6.783,12.2a1.111,1.111,0,0,0-.889-.368l-.583.032a1.111,1.111,0,0,1-1.171-1.171l.032-.583A1.111,1.111,0,0,0,3.8,9.217l-.434-.389a1.111,1.111,0,0,1,0-1.656L3.8,6.783a1.111,1.111,0,0,0,.368-.889L4.139,5.31A1.111,1.111,0,0,1,5.311,4.14l.583.032A1.111,1.111,0,0,0,6.782,3.8l.389-.434Z" transform="translate(0 0)" fill="none" stroke="#000" stroke-width="1" />
                                                            <path id="Trazado_2034" data-name="Trazado 2034" d="M9.5,9.5h.006v.006H9.5Zm2.778,2.778h.006v.006h-.006Z" transform="translate(-2.889 -2.889)" fill="none" stroke="#000" stroke-linejoin="round" stroke-width="1.5" />
                                                            <path id="Trazado_2035" data-name="Trazado 2035" d="M12.333,9,9,12.333" transform="translate(-2.667 -2.667)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                                                        </g>
                                                    </svg>
                                                </Col>
                                                <Col>
                                                    <Badge
                                                        color='#F98B76'
                                                        size={1}
                                                        background='#FDE8E3'
                                                    >
                                                        {`${item.meta_percentage || ""}%`}
                                                    </Badge>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                    {
                                        item?.meta_third_party_codes_code && (
                                            <Row >
                                                <Badge
                                                    color='#6B24F8'
                                                    size={1}
                                                >
                                                    Código: {item.meta_third_party_codes_code}
                                                </Badge>
                                            </Row>
                                        )
                                    }
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    <Row>
                                        <Typography.Title level={5} style={{ margin: 0 }}>
                                            Fecha y hora
                                        </Typography.Title>
                                    </Row>
                                    <Row gutter={8} align="middle">
                                        <Col>
                                            <IoCalendarClearOutline size={17}/>
                                        </Col>
                                        <Col>
                                            <Typography.Text >
                                                {
                                                    item.meta_day &&
                                                    moment(
                                                        item.meta_day,
                                                        "YYYY-MM-DD"
                                                    ).format("dddd D MMMM")
                                                }
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                    <Row gutter={8} align="middle">
                                        <Col>
                                            <FiClock size={17} />
                                        </Col>
                                        <Col>
                                            <Typography.Text >
                                                {
                                                    item.meta_start_hour &&
                                                    moment(
                                                        `${item.meta_start_hour}`,
                                                        "HH:mm:ss"
                                                    ).format("hh:mm a")
                                                }
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Space>
                            </Col>
                            {
                                item?.meta_deal_name && (
                                    <Row align='middle' gutter={8} >
                                        <Col>
                                            <img src={squareTicket} alt='icon-ticket' />
                                        </Col>
                                        <Col
                                            style={{
                                                color: '#6B24F8',
                                                fontSize: '1em',
                                            }}
                                        >
                                            {item.meta_deal_name}
                                        </Col>
                                    </Row>
                                )
                            }
                        </Row>
                        {
                            item?.user_comment ? (<div style={{
                                background: '#F4EEFF',
                                width: '100%', padding: '16px', borderRadius: '6px'
                            }}>
                                <Row>
                                    <Typography.Title level={5} style={{ margin: 0 }}>
                                        Descripción y/o preferencias
                                    </Typography.Title>
                                </Row>
                                <Typography.Paragraph style={{ fontWeight: 'normal !important', margin: 0 }}>
                                    {item?.user_comment}
                                </Typography.Paragraph>
                            </div>) : null
                        }

                    </Space>
                </Col>
                {
                    item.status !== STATUS_RESERVATION.pendingApproval && (
                        <Col span={24}>
                            <Divider style={{ background: 'rgb(249,143,102,0.22)', margin: '10px 0px' }} />
                            {
                                (userRatingData) &&
                                <Form
                                    ref={formRef}
                                    initialValues={userRatingData}
                                >
                                    <Row
                                        justify='space-between'
                                        align='middle'
                                    >
                                        <Col>
                                            <Row gutter={8}>
                                                <Col>
                                                    <Typography.Title level={5}>
                                                        Califica la experiencia con tus comensales
                                                    </Typography.Title>
                                                </Col>
                                                <Col>
                                                    <Tooltip title='Usaremos esta calificación para mejorar la calidad de los usuarios que reservan en tu restaurante'>
                                                        <AiFillInfoCircle color='#C0BBBB' />
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify='space-between'
                                        align='top'
                                    >
                                        <Form.Item
                                            name='score'
                                            style={{ marginBottom: '0px' }}
                                        >
                                            <Rate
                                                style={{ color: 'var(--purple)' }}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='tip'
                                            label='Propina:'
                                            style={{ marginBottom: '0px' }}
                                        >
                                            <Radio.Group disabled={true}>
                                                <Radio value={'true'}>Si</Radio>
                                                <Radio value={'false'}>No</Radio>
                                            </Radio.Group >
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        Comentario adicional:
                                    </Row>
                                    <Row>
                                        <Form.Item
                                            name='comment'
                                            style={{ width: '100%' }}
                                        >
                                            <Input.TextArea
                                                autoSize
                                                disabled={true}
                                                bordered={false}
                                                style={{ borderBottom: '1px solid #000' }}
                                                placeholder='Describe la experiencia...'
                                            />
                                        </Form.Item>
                                    </Row>
                                </Form>
                            }
                            {
                                (!userRatingData) &&
                                <Form
                                    ref={formRef}
                                >
                                    <Row
                                        justify='space-between'
                                        align='middle'
                                    >
                                        <Col>
                                            <Row gutter={8}>
                                                <Col>

                                                    <Typography.Title level={5}>
                                                        Califica la experiencia con tus comensales
                                                    </Typography.Title>
                                                </Col>
                                                <Col>
                                                    <Tooltip title='Usaremos esta calificación para mejorar la calidad de los usuarios que reservan en tu restaurante'>
                                                        <AiFillInfoCircle color='#C0BBBB' />
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify='space-between'
                                        align='top'
                                    >
                                        <Form.Item
                                            name='score'
                                            style={{ marginBottom: '0px' }}
                                            initialValue={5}
                                        >
                                            <Rate
                                                style={{ color: 'var(--purple)' }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='tip'
                                            label='Propina:'
                                            style={{ marginBottom: '0px' }}
                                        >
                                            <Radio.Group >
                                                <Radio value={'true'}>Si</Radio>
                                                <Radio value={'false'}>No</Radio>
                                            </Radio.Group >
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        Comentario adicional:
                                    </Row>
                                    <Row>
                                        <Form.Item
                                            name='comment'
                                            style={{ width: '100%', marginBottom: '10px' }}
                                        >
                                            <Input.TextArea
                                                autoSize
                                                bordered={false}
                                                style={{ borderBottom: '1px solid #000' }}
                                                placeholder='Describe la experiencia...'
                                            />
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item>
                                                <AsyncButton
                                                    htmlType="submit"
                                                    block
                                                    style={{
                                                        borderRadius: '0.5rem',
                                                        color: '#6C7382',
                                                        fontWeight: 'bold',
                                                        border: '2px solid #6C7382',
                                                    }}
                                                    onClick={handleSubmitUserRating}
                                                >
                                                    Calificar
                                                </AsyncButton>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            }
                        </Col>
                    )
                }
                {
                    item.status !== STATUS_RESERVATION.pendingApproval && (
                        <>
                            <Row
                                style={{
                                    borderRadius: '1rem',
                                    background: item.status === STATUS_RESERVATION.acquired ? 'var(--purple)' : '#F98F66',
                                    color: 'white',
                                    padding: '1rem',
                                }}

                                gutter={[0, 8]}
                            >
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                                                Valor total factura
                                            </Typography.Title>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Text style={{ margin: 0, color: 'white' }}>
                                                Este valor será visto por el comensal.
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row gutter={8}>
                                        <Col flex='auto'>
                                            <Input
                                                style={{
                                                    borderRadius: '0.5rem'
                                                }}
                                                prefix={'$'}
                                                type='number'
                                                min={1000}
                                                max={10000000}
                                                onChange={(e) => setInvoiceValue(e.target.value)}
                                                value={item.reported_invoice_amount || invoiceValue}
                                                disabled={!!item.reported_invoice_amount}
                                            />
                                        </Col>
                                        <Col flex='none'>
                                            <AsyncButton
                                                style={{
                                                    borderRadius: '0.5rem',
                                                    background: item.status === STATUS_RESERVATION.acquired ? '#53E38B' : 'var(--purple)',
                                                    border: 0,
                                                    color: item.status === STATUS_RESERVATION.acquired ? 'black' : 'white',
                                                }}
                                                onClick={async () =>
                                                    await handleSaveInvoiceValue({ item, value: invoiceValue })
                                                }
                                                disabled={!!item.reported_invoice_amount}
                                            >
                                                Guardar
                                            </AsyncButton>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0, margin: '5px' }} />
                            {
                                item.status === STATUS_RESERVATION.acquired &&
                                <Col span={24}>
                                    <AsyncButton
                                        block
                                        confirmText="Está seguro de anular la reserva?"
                                        style={{
                                            borderRadius: '0.5rem',
                                            color: '#E83737',
                                            fontWeight: 'bold',
                                            border: '2px solid #E83737',
                                        }}
                                        onClick={async () => {
                                            await handleChangeReservationStatus({ status: STATUS_RESERVATION.canceledByEstablishment, item })
                                        }}
                                    >
                                        Anular reserva
                                    </AsyncButton>
                                </Col>
                            }
                        </>
                    )
                }
            </ContainerReservationDetails>
        );
}

export default ReservationsDetails;