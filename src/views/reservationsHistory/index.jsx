import React, { useEffect, useState } from 'react';
import moment from 'moment';
import numeral from "numeral";
import { Col, message, Typography, Row, Divider, Layout, DatePicker } from 'antd';
import locale from "antd/es/date-picker/locale/es_ES";
import { Grid } from '../../components/com';
import { Box } from '../../components';
import { useSelector } from 'react-redux';

import { IoCalendarClearOutline } from 'react-icons/io5';
import _ from 'lodash';
import AsyncButton from '../../components/asyncButton';
import { getService } from '../../services';

const { RangePicker } = DatePicker;

const format = "h:mm a";

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const statusFormatter = {
    acquired: "Adquirido",
    inactive: "Inactivo",
    claimed: "Reclamado",
    notClaimed: "No reclamado",
    expired: "Expirado",
    canceled: "Cancelado",
    pendingApproval: "Pendiente de aprobación",
    pendingClaimedVerification: 'Pendiente de verificación de cupón',
    notApproved: 'No aprobado',
    canceledByEstablishment: 'Cancelado por el establecimiento',
    canceledByUser: 'Cancelado por el usuario'
};

const columns = [
    
    {
        title: "Nombre",
        dataIndex: "meta_user_first_name",
        sorter: true,
        render: (value, { meta_user_first_name, meta_user_last_name }) => `${meta_user_first_name} ${meta_user_last_name}`
    },
    {
        title: "Dirección",
        dataIndex: "meta_establishment_branch_address",
        sorter: true,
    },
    {
        title: "Fecha",
        dataIndex: "meta_day",
        sorter: true,
    },
    {
        title: "Hora Inicio",
        dataIndex: "meta_start_hour",
        sorter: true,
        render: (value, record) => `${moment(value, "HH:mm:ss").format(format) || ""}`,
    },
    {
        title: "Personas",
        dataIndex: "persons",
        sorter: true,
        width: '100px'
    },
    {
        title: "Descuento",
        dataIndex: "meta_percentage",
        sorter: true,
        render: (value) => `${value}%`,
    },
    {
        title: "Valor factura",
        dataIndex: "reported_invoice_amount",
        sorter: true,
        render: (value) => `${numeral(value).format("$0,0")}`
    },
    {
        title: "Estado",
        dataIndex: "status",
        sorter: true,
        render: (value) => `${statusFormatter[value]}`
    },
];

const ReservationsHistory = () => {


    const [selectColumns, setColumns] = useState(columns)
    const [selectedDate, setSelectedDate] = useState([]);
    const [selectedEstablishmentOptions, setEstablishmentOptions] = useState([]);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);

    const handleChange = (rangeDates) => {
        try {
            setSelectedDate(_.map(rangeDates, (date) => date.format("YYYY-MM-DD")));
        } catch (err) {
            message.error(err.message);
        }
    };

    const getEstablishmentsOptions = async () => {

        const establishmentService = getService('establishments');
        await establishmentService.find({
            query: {
                id: establishmentFilters?.establishment_id,
                $client: { skipJoins: true },
                $select: ['show_booking_id']
            }
        })
            .then((response) => {
                const responseEstablishment = response?.data?.[0]

                if( responseEstablishment?.show_booking_id === 'active') {
                    setColumns([{
                        title: "Id",
                        dataIndex: "id",
                        sorter: true,
                    }, ...columns])
                }else{
                    setColumns(columns)
                }

            })
            .catch((error) => {
                message.error(error.message)
            })
    }


    const onExportExcelReservationsHistory = async () => {
        if (_.isEmpty(selectedDate)) {
            message.info('¡Selecciona un rango de fechas para exportar el documento!')
            return;
        }
        const reservationsHistoryService = getService('reservations-history');
        await reservationsHistoryService.find({
            query: {
                $client: { exportExcelReservationHistory: true },
                establishment_id: establishmentFilters.establishment_id,
                establishment_branch_id: establishmentFilters.establishment_branch_id,
                end_date: selectedDate[1],
                start_date: selectedDate[0],
            }
        })
            .then((response) => window.open(response.path, '_blank'))
            .catch((error) => message.error(error.message || '¡No se pudo exportar los registros!'))
    };

    useEffect(() => {
        if (!(establishmentFilters.establishment_branch_id)) {
            setSelectedDate([]);
        }

    }, [establishmentFilters])
    
    useEffect(() => {

        if (establishmentFilters?.establishment_id) {
            getEstablishmentsOptions()
        }
    }, [establishmentFilters?.establishment_id])


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row>
                <Row
                    align='middle'
                    style={{
                        color: "var(--purple)",
                    }}
                    gutter={[16, 16]}
                >
                    <Col>
                        <IoCalendarClearOutline size={30} />
                    </Col>
                    <Col>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Historial de reservas
                        </Typography.Title>
                    </Col>
                </Row>
                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            </Row>
            <Row style={{ height: '100%', marginBottom: '1rem' }} gutter={16}>
                <Col span={24}>
                    {
                        !(establishmentFilters.establishment_id) ? (
                            <Box>
                                *Seleccione un restaurante para ver los registros*
                            </Box>
                        ) :
                            (
                                <Grid
                                    searchField="q"
                                    searchText="Usuario..."
                                    search={true}
                                    custom={true}
                                    filterDefaultValues={{
                                        $and: [
                                            { meta_day: { $lte: selectedDate[1] } },
                                            { meta_day: { $gte: selectedDate[0] } },
                                        ],
                                        $sort: {
                                            meta_day: -1
                                        },
                                        ...establishmentFilters
                                    }}
                                    columns={
                                        userRole === USERS_ROLES.admin
                                            ? [
                                                {
                                                    title: "Id usuario",
                                                    dataIndex: "user_id",
                                                    sorter: true,
                                                },
                                                ...selectColumns
                                            ] :
                                            selectColumns
                                    }
                                    source={"reservations"}
                                    permitFetch={!!(establishmentFilters.establishment_id)}
                                    title={
                                        <Row gutter={16} align="middle">
                                            <Col>
                                                <RangePicker
                                                    locale={locale}
                                                    onChange={(rangeDates) => handleChange(rangeDates)}
                                                />
                                            </Col>
                                            <Col>
                                                <AsyncButton
                                                    type="primary"
                                                    style={{ borderRadius: '0.5rem' }}
                                                    onClick={onExportExcelReservationsHistory}
                                                >
                                                    Exportar Historial
                                                </AsyncButton>
                                            </Col>
                                        </Row>
                                    }
                                    actions={{}}
                                />
                            )
                    }
                </Col>
            </Row>
        </Layout.Content >
    )
}

export default ReservationsHistory;