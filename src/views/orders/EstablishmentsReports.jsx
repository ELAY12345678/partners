import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Row, Col, Typography, Divider, Select, Space, Tooltip } from 'antd';
import { RiHomeLine } from 'react-icons/ri';
import { HeatmapChart, ColumnChart } from '@opd/g2plot-react';
import CountUpDown from '../../components/countUpDown';

import { Card, ChartContainer, SelectStyled, } from './Styles';
import grafismo from '../../sources/GRAFISMO.png';
import partners_Med from '../../sources/images/partners-Med.jpg';
import IconStar from '../../sources/icons/star';

import { IoCalendarClearOutline } from 'react-icons/io5';
import { AiOutlineInfoCircle } from 'react-icons/ai'

import { useReports, useDataCharts } from './hooks'
import { useSelector, useDispatch } from 'react-redux';

import { changeReportPerDaysOfWeek } from './redux/actions';
import styled from 'styled-components';
import AsyncButton from '../../components/asyncButton';
import { useTopUserByReservation } from './hooks/useTopUserByReservation';
const { Option } = Select;

const config = {
    height: 350,
    autoFit: true,
    legend: true,
    isGroup: true,
    xField: 'hora',
    color: ['#F98F66', '#53E38B'],
    xAxis: {
        label: {
            autoHide: true,
            autoRotate: false,
        }
    },
    yField: 'cantidad',
    smooth: true,
    meta: {
        value: {
            max: 24,
        },
    },
}

const config2 = {
    xField: 'day_of_week',
    yField: 'hour',
    smooth: true,
    legend: false,
    shape: 'circle',
    reflect: 'y',
    sizeRatio: 0.5,
    label: {
        // formatter: ({ reservation_quantity, reservation_quantity_persons }) => `${reservation_quantity}/${reservation_quantity_persons}`,
        style: {
            fill: '#000',
            shadowBlur: 2,
            fontSize: 15,
            shadowColor: 'rgba(0, 0, 0, .45)',
        },
    },
}

const config3 = {
    height: 350,
    autoFit: true,
    isGroup: true,
    legend: true,
    xField: 'dia',
    color: ['#F98F66', '#53E38B'],
    xAxis: {
        label: {
            autoHide: true,
            autoRotate: false,
        },
    },
    yField: 'cantidad',
    smooth: true,
    meta: {
        value: {
            max: 15,
        },
    },
}


const REPORTS_LIMITS = {
    currentWeek: 'currentWeek',
    lastWeek: 'lastWeek',
    nextWeek: 'nextWeek',
    lastMonth: 'lastMonth',
    nextMonth: 'nextMonth',
    currentMonth: 'currentMonth'
}

const REPORT_TYPES = {
    reservations_claimed: 'reservations-claimed',
    reservations_claimed_acquired_range_date: 'reservations-claimed-acquired-range-date',
    establishments_ranting: 'establishments-ranting',
};

const CHARTS_TYPES = {
    per_hours: 'per-hours',
    per_days_of_week: 'per-days-of-week',
    per_day_of_week_and_hour: 'per-day-of-week-and-hour'
}

const Text = styled.div`
    font-size: 14px;
    font-style: italic;
`;

const TableTitle = styled.div`
    /* text-align: left; */
    letter-spacing: 0px;
    color: #CCCCCC;
    opacity: 1;
    font-size: 0.625rem;
`;

const EstablishmentsReports = () => {

    const chartRef = useRef();
    const chartRef2 = useRef();
    const chartRef3 = useRef();
    const chartRef4 = useRef();

    const dispatch = useDispatch();

    const [reportsLimit, setReportLimit] = useState(REPORTS_LIMITS.currentWeek);

    const [reservations_claimed] = useReports({ type: REPORT_TYPES.reservations_claimed });
    const [reservations_currentMonth] = useReports({ type: REPORT_TYPES.reservations_claimed_acquired_range_date, range_of_dates: REPORTS_LIMITS.currentMonth });
    const [reservations_currentWeek] = useReports({ type: REPORT_TYPES.reservations_claimed_acquired_range_date, range_of_dates: REPORTS_LIMITS.currentWeek });
    const [establishments_ranting] = useReports({ type: REPORT_TYPES.establishments_ranting });

    const [reservations_per_hours] = useDataCharts({ type: CHARTS_TYPES.per_hours, range_of_dates: reportsLimit });
    const [reservations_per_days_of_week] = useDataCharts({ type: CHARTS_TYPES.per_days_of_week, range_of_dates: reportsLimit });
    const [reservations_per_day_of_week_and_hour] = useDataCharts({ type: CHARTS_TYPES.per_day_of_week_and_hour, range_of_dates: reportsLimit, branch: true });

    const { topUserByReservations, exportTopUserByReservations } = useTopUserByReservation();

    const reservations_currentDay = useSelector(({ dashboardReducer }) => dashboardReducer.reservationsDatas?.today);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const reports_per_day_of_week_and_hour_data = useSelector(({ dashboardReducer }) =>
        _.map(
            _.filter(dashboardReducer.reports_per_day_of_week_and_hour_data, (data) => data.reservation_quantity > 0),
            ({ day_of_week, hour, ...res }) => ({ ...res, hour: `${hour > 11 ? hour + ' pm' : hour + ' am'}`, day_of_week: day_of_week.substring(0, 3) }))
    );

    const handleSelect = (value) => {
        setReportLimit(REPORTS_LIMITS[value])
    };

    useEffect(() => {
        dispatch(changeReportPerDaysOfWeek(reservations_per_day_of_week_and_hour));
    }, [reservations_per_day_of_week_and_hour])

    return (
        <div
            style={{
                padding: '1rem',
                position: 'absolute',
                width: '100%',
            }}
        >
            <Row
                align='middle'
                style={{
                    color: "var(--purple)",
                }}
                gutter={[16, 16]}
            >
                <Col>
                    <RiHomeLine size={30} />
                </Col>
                <Col>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Dashboard
                    </Typography.Title>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row
                gutter={[16, 16]}
            >
                <Col>
                    <Typography.Title level={5}>
                        Reservas y Comensales
                    </Typography.Title>
                </Col>
            </Row>
            <Row
                gutter={[32, 32]}
                style={{
                    padding: '16px'
                }}
            >
                <Card type="purple"  >
                    <div className="grafismo">
                        <img src={grafismo} alt='icon' width='200px' height='200px' />
                    </div>
                    <Row className="purple-title">
                        <Col className='title'>
                            <CountUpDown end={reservations_claimed?.total_reservations_claimed || 0} />
                        </Col>
                        <Col >
                            Reservas
                        </Col>
                        <Col >
                            reclamadas
                        </Col>
                    </Row>
                    <Row>
                        <span>
                            {reservations_claimed?.persons || 0} Comensales
                        </span>
                    </Row>
                </Card>
                <Card >
                    <Space direction="vertical" align="center">
                        <Row justify="center">
                            <Typography.Text>
                                Reservas mes
                            </Typography.Text>
                        </Row>
                        <Row justify="center" gutter={16} align="middle" size="large">
                            <Col className='title'>
                                <CountUpDown end={reservations_currentMonth?.count_reservation_claimed_and_acquired || 0} />
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Typography.Text>
                                {reservations_currentMonth?.persons || 0} Comensales
                            </Typography.Text>
                        </Row>
                    </Space>
                </Card>
                <Card >
                    <Space direction="vertical" align="center">
                        <Row justify="center">
                            <Typography.Text>
                                Reservas semana
                            </Typography.Text>
                        </Row>
                        <Row justify="center" gutter={16} align="middle" size="large">
                            <Col className='title'>
                                <CountUpDown end={reservations_currentWeek?.count_reservation_claimed_and_acquired || 0} />
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Typography.Text>
                                {reservations_currentWeek?.persons || 0} Comensales
                            </Typography.Text>
                        </Row>
                    </Space>
                </Card>
                <Card >
                    <Space direction="vertical" align="center">
                        <Row justify="center">
                            <Typography.Text>
                                Reservas para hoy
                            </Typography.Text>
                        </Row>
                        <Row justify="center" gutter={16} align="middle" size="large">
                            <Col className='title'>
                                <CountUpDown end={reservations_currentDay?.length || 0} />
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Typography.Text>
                                {_.reduce(reservations_currentDay, (sum, { persons }) => sum + persons, 0)} Comensales
                            </Typography.Text>
                        </Row>
                    </Space>
                </Card>
                <Card>
                    <Row justify='end'>
                        <Col className='icon'>
                            <IconStar />
                        </Col>
                    </Row>
                    <Row >
                        <Col className='title'>
                            {establishments_ranting?.average_rating || "0.0"}
                        </Col>
                    </Row>
                    <Row>
                        <Typography.Text>
                            Calificación
                        </Typography.Text>
                    </Row>
                </Card>
            </Row>

            <Divider style={{ background: 'transparent', borderTop: 0, }} />
            <Row align='middle' gutter={16}>
                <Col>
                    <span className='prefix'>
                        <IoCalendarClearOutline color='var(--purple)' />
                    </span>
                    <SelectStyled
                        defaultValue="currentWeek"
                        bordered={false}
                        size="large"
                        onChange={handleSelect}
                        disabled={_.isEmpty(establishmentFilters)}
                    >
                        <Option value="currentWeek">Semana actual</Option>
                        <Option value="lastWeek">Semana anterior</Option>
                        <Option value="nextWeek">Proxima semana</Option>
                        <Option value="lastMonth">Mes anterior</Option>
                        <Option value="nextMonth">Proximo mes</Option>
                    </SelectStyled>
                </Col>
            </Row>

            <Divider style={{ background: 'transparent', borderTop: 0, }} />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Row>
                        <Col span={24}>
                            <ChartContainer>
                                <Row align='middle' justify='space-between'>
                                    <Col>
                                        <Typography.Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                                            Top de usuarios
                                            <Tooltip title={"Usuarios que más han realizado reservas en tu restaurante, descarga el excel para ver más."}>
                                                <AiOutlineInfoCircle size={15} />
                                            </Tooltip>
                                            <span style={{ fontWeight: 'normal', fontSize: '12px' }}>(Últimos 30 días)</span>
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        <AsyncButton
                                            type="link"
                                            disabled={!establishmentFilters?.establishment_id}
                                            onClick={async () => {
                                                await exportTopUserByReservations({ establishmentFilters });
                                            }}
                                            style={{ fontSize: '12px', }}
                                        >
                                            <u>
                                                Descargar excel
                                            </u>
                                        </AsyncButton>
                                    </Col>
                                </Row>
                                <Divider style={{ background: '#CCCCCC', margin: '15px 0px' }} />
                                {
                                    !(establishmentFilters.establishment_id) ? (
                                        <Text>
                                            *Selecciona una dirección para ver las estadísticas*
                                        </Text>
                                    ) : _.isEmpty(topUserByReservations) ?
                                        <>
                                            <Row justify="center">
                                                <Col>
                                                    <Text >
                                                        *No hay datos que mostrar*
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </>
                                        : (
                                            <div>
                                                <Row >
                                                    <Col span={18}>
                                                        <Row>
                                                            <TableTitle>
                                                                Nombre usuario
                                                            </TableTitle>
                                                        </Row>
                                                    </Col>
                                                    {/* <Col span={6}>
                                                        <TableTitle style={{ textAlign: 'left' }}>
                                                            Número de contacto
                                                        </TableTitle>
                                                    </Col> */}
                                                    <Col span={6}>
                                                        <TableTitle style={{ textAlign: 'right' }}>
                                                            Número de reservas
                                                        </TableTitle>
                                                    </Col>
                                                </Row>
                                                {
                                                    _.map(topUserByReservations, ({ meta_user_first_name, meta_user_last_name, meta_user_phone, reservations_count }, index) => (
                                                        <Row style={{ margin: '10px 0px', fontSize: '14px' }}>
                                                            <Col span={18}>
                                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '90%' }}>
                                                                    {index + 1}. {meta_user_first_name || ''} {meta_user_last_name || ''}
                                                                </div>
                                                            </Col>
                                                            {/* <Col span={6} style={{ textAlign: 'left' }}>
                                                                {meta_user_phone || ''}
                                                            </Col> */}
                                                            <Col span={6} style={{ textAlign: 'right' }}>
                                                                {reservations_count || ''} Reservas
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }

                                            </div>
                                        )
                                }

                            </ChartContainer>
                        </Col>
                    </Row>
                    <Divider style={{ background: 'transparent', borderTop: 0, }} />
                    <Row>
                        <Col span={24}>
                            <ChartContainer>
                                <Typography.Title level={5}>
                                    Reservas por hora y día de la semana
                                </Typography.Title>
                                <Divider style={{ background: '#CCCCCC', margin: '15px 0px' }} />
                                {
                                    !(establishmentFilters.establishment_branch_id) ? (
                                        <Text>
                                            *Selecciona una dirección para ver las estadísticas*
                                        </Text>
                                    ) : establishmentFilters.establishment_branch_id && _.isEmpty(reports_per_day_of_week_and_hour_data) ?
                                        <>
                                            <img src={partners_Med} alt='no data icon' height='auto' width='100%' />
                                            <Row justify="center">
                                                <Col>
                                                    <Text >
                                                        *No hay datos que graficar*
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </>
                                        : (
                                            <HeatmapChart
                                                style={{ height: '100%', width: '100%' }}
                                                {...config2}
                                                color={['#fbe4da', '#fcb69a', '#f7875a', '#f65b1e']}
                                                colorField='reservation_quantity'
                                                chartRef={chartRef2}
                                                tooltip={{
                                                    // fields: ['reservation_quantity', 'reservation_quantity_persons'],
                                                    formatter: (datum) => {
                                                        return { name: 'Reservas', value: datum.reservation_quantity };
                                                    },
                                                    // customContent: (title, data) => {
                                                    //     return <div>${title}</div>;
                                                    // }

                                                }}
                                                data={reports_per_day_of_week_and_hour_data
                                                    // ..._.sortBy(
                                                    // _.map(
                                                    //     _.filter(reports_per_day_of_week_and_hour_data, (data) => data.reservation_quantity > 0),
                                                    //     ({ day_of_week, hour, ...res }) => ({ ...res, hour: `${hour > 11 ? hour + ' pm' : hour + ' am'}`, day_of_week: day_of_week.substring(0, 3) }))
                                                    //     ,
                                                    //     [({ day_of_week }) => day_of_week]
                                                    // )
                                                }
                                            />
                                        )
                                }

                            </ChartContainer>
                        </Col>
                    </Row>
                    <Divider style={{ background: 'transparent', borderTop: 0, }} />
                    <Row>
                        <Col span={24}>
                            <ChartContainer>
                                <Typography.Title level={5}>
                                    Comensales por hora y día de la semana
                                </Typography.Title>
                                <Divider style={{ background: '#CCCCCC', margin: '15px 0px' }} />
                                {
                                    !(establishmentFilters.establishment_branch_id) ? (
                                        <Text>
                                            *Selecciona una dirección para ver las estadísticas*
                                        </Text>
                                    ) : establishmentFilters.establishment_branch_id && _.isEmpty(reports_per_day_of_week_and_hour_data) ?
                                        <>
                                            <img src={partners_Med} alt='no data icon' height='auto' width='100%' />
                                            <Row justify="center">
                                                <Col>
                                                    <Text >
                                                        *No hay datos que graficar*
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </>
                                        : (
                                            <HeatmapChart
                                                style={{ height: '100%' }}
                                                {...config2}
                                                color={['#C5E8B7', '#71ff58', '#3fff2e', '#04ff00']}
                                                colorField='reservation_quantity_persons'
                                                chartRef={chartRef4}
                                                tooltip={{
                                                    formatter: (datum) => {
                                                        return { name: 'Comensales', value: datum.reservation_quantity_persons };
                                                    },
                                                }}
                                                data={reports_per_day_of_week_and_hour_data}
                                            />
                                        )
                                }

                            </ChartContainer>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Row>
                        <Col span={24}>
                            <ChartContainer>
                                <Typography.Title level={5}>
                                    Reservas y Comensales por hora
                                </Typography.Title>
                                <Divider style={{ background: '#CCCCCC', margin: '15px 0px' }} />
                                {_.isEmpty(establishmentFilters) ? (
                                    <Text>
                                        *Selecciona un restaurante para ver las estadísticas*
                                    </Text>
                                ) : establishmentFilters.establishment_id && _.isEmpty(reservations_per_hours) ?
                                    <>
                                        <Row justify="center">
                                            <img src={partners_Med} alt='no data icon' height='auto' width='50%' />

                                        </Row>
                                        <Row justify="center">
                                            <Col>
                                                <Text >
                                                    *No hay datos que graficar*
                                                </Text>
                                            </Col>
                                        </Row>
                                    </>
                                    : (
                                        <ColumnChart
                                            {...config}
                                            seriesField='quantity'
                                            chartRef={chartRef}
                                            data={[
                                                ..._.map(reservations_per_hours, ({ reservations_quantity, hour }) => ({ cantidad: parseInt(reservations_quantity), hora: `${hour} ${hour > 11 ? 'pm' : 'am'}`, quantity: 'Reservas' })),
                                                ..._.map(reservations_per_hours, ({ reservations_quantity_persons, hour }) => ({ cantidad: parseInt(reservations_quantity_persons), hora: `${hour} ${hour > 11 ? 'pm' : 'am'}`, quantity: 'Comensales' }))
                                            ]} />
                                    )}

                            </ChartContainer>
                        </Col>
                    </Row>
                    <Divider style={{ background: 'transparent', borderTop: 0, }} />
                    <Row>
                        <Col span={24}>
                            <ChartContainer>
                                <Typography.Title level={5}>
                                    Reservas y Comensales por día de la semana
                                </Typography.Title>
                                <Divider style={{ background: '#CCCCCC', margin: '15px 0px' }} />
                                {_.isEmpty(establishmentFilters) ? (
                                    <Text>
                                        *Selecciona un restaurante para ver las estadísticas*
                                    </Text>
                                ) : establishmentFilters.establishment_id && _.isEmpty(reservations_per_days_of_week) ?
                                    <>
                                        <Row justify="center">
                                            <img src={partners_Med} alt='no data icon' height='auto' width='50%' />

                                        </Row>
                                        <Row justify="center">
                                            <Col>
                                                <Text >
                                                    *No hay datos que graficar*
                                                </Text>
                                            </Col>
                                        </Row>
                                    </>
                                    : (
                                        <ColumnChart
                                            {...config3}
                                            chartRef={chartRef3}
                                            seriesField='quantity'
                                            data={[
                                                ..._.map(reservations_per_days_of_week, ({ reservation_quantity, day_of_week }) => ({ cantidad: parseInt(reservation_quantity), dia: day_of_week, quantity: 'Reservas' })),
                                                ..._.map(reservations_per_days_of_week, ({ reservation_quantity_persons, day_of_week }) => ({ cantidad: parseInt(reservation_quantity_persons), dia: day_of_week, quantity: 'Comensales' }))
                                            ]}
                                        />
                                    )}

                            </ChartContainer>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div >
    );
}

export default EstablishmentsReports;