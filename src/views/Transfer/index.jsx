import React, { useState } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { Button, Col, DatePicker, Divider, Layout, message, Row, Typography } from 'antd';
import { BsCreditCard2Front } from 'react-icons/bs';
import { Grid } from '../../components/com';
import { useSelector } from 'react-redux';
import locale from "antd/es/date-picker/locale/es_ES";
import TransferDetails from './TransferDetails';
import { Box } from '../../components';
import AsyncButton from '../../components/asyncButton';
import _ from 'lodash';
import { getService } from '../../services';

const { RangePicker } = DatePicker;

const columns = (setPaymentDetails) => [
    {
        title: "N°",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Restaurante",
        sorter: true,
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block' }}>
                    {record?.pay_account?.establishment?.name} - {record?.pay_account?.establishment_branch?.address}
                </span>
            );
        },
    },
    {
        title: "Monto",
        dataIndex: 'amount',
        sorter: true,
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block' }}>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
    },
    {
        title: "Fecha",
        dataIndex: 'status_date_completed',
        sorter: true,
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block' }}>
                    {moment(record).format('DD/MM/YYYY h:mm a')}
                </span>
            );
        },
    },
    {
        title: "Estado",
        dataIndex: 'status',
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, { status_date_completed }) => {
            return (
                <>
                    {
                        moment(moment(status_date_completed).format('YYYY-MM-DD')).isAfter(moment('2022-06-02')) ? (
                            <Button
                                type="link"
                                onClick={() => { setPaymentDetails({ id, date: status_date_completed ? moment(status_date_completed)?.format('DD/MM/YYYY h:mm a') : '' }) }}
                            >
                                ver detalles
                            </Button>
                        ) : (
                            <> Detalles no disponibles</>
                        )
                    }
                </>
            );
        },
        align: "center",
    },
];

const Transfer = () => {

    const [selectedDate, setSelectedDate] = useState([]);
    const [paymentDetailsId, setPaymentDetailsId] = useState();
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const handleChange = (rangeDates) => {
        try {
            if (rangeDates)
                setSelectedDate([
                    moment(rangeDates[0]).startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
                    moment(rangeDates[1]).endOf('day').utc().format('YYYY-MM-DD HH:mm:ss')
                ]);
            else
                setSelectedDate([]);
        } catch (err) {
            message.error(err.message);
        }
    };

    const onExportExcelTransferDetails = async () => {
        if (_.isEmpty(selectedDate)) {
            message.info('Selecciona el rango de fechas a exportar!')
            return;
        }
        const reportIncomeExoensesService = getService('report-income-expenses');
        await reportIncomeExoensesService.find({
            query: {
                $client: { generateExcelWithDetails: true },
                establishment_id: establishmentFilters.establishment_id,
                establishment_branch_id: establishmentFilters.establishment_branch_id,
                date_end: selectedDate[1],
                date_start: selectedDate[0],
            }
        })
            .then((response) => window.open(response.path, '_blank'))
            .catch((error) => message.error(error.message || 'No se pudo exportar los registros!'))
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row>
                <Row
                    align='middle'
                    gutter={[16, 16]}
                    style={{
                        color: "var(--purple)",
                    }}
                >
                    <Col>
                        <BsCreditCard2Front size={30} />
                    </Col>
                    <Col>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Transferencias
                        </Typography.Title>
                    </Col>
                </Row>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row>
                <Col span={24}>
                    {
                        !establishmentFilters?.establishment_id ? (
                            <Box>
                                *Selecciona un restaurante para ver los registros*
                            </Box>
                        ) : (
                            <Grid
                                filterDefaultValues={{
                                    meta_establishment_id: establishmentFilters.establishment_id,
                                    meta_establishment_branch_id: establishmentFilters.establishment_branch_id,
                                    status: 'completed',
                                    type: 'bank',
                                    $sort: {
                                        status_date_completed: -1,
                                    },
                                    $and: [
                                        { status_date_completed: { $lte: selectedDate[1] } },
                                        { status_date_completed: { $gte: selectedDate[0] } },
                                    ],
                                }}
                                custom={true}
                                columns={columns(setPaymentDetailsId)}
                                source={'pay-withdrawal'}
                                permitFetch={!!(establishmentFilters.establishment_id)}
                                actions={{}}
                                title={
                                    <Row gutter={16} align="middle">
                                        <Col>
                                            <RangePicker
                                                locale={locale}
                                                format='YYYY-MM-DD'
                                                onChange={(rangeDates) => handleChange(rangeDates)}
                                            />
                                        </Col>
                                        <Col>
                                            <AsyncButton
                                                type="primary"
                                                style={{ borderRadius: '0.5rem' }}
                                                onClick={onExportExcelTransferDetails}
                                            >
                                                Exportar Excel
                                            </AsyncButton>
                                        </Col>
                                    </Row>
                                }
                            />
                        )

                    }

                </Col>
            </Row>
            {
                paymentDetailsId && (
                    <TransferDetails
                        onCancel={() => {
                            setPaymentDetailsId(undefined);
                        }}
                        visible={!!paymentDetailsId}
                        id={paymentDetailsId?.id}
                        date={paymentDetailsId?.date}
                        establishment_id={establishmentFilters?.establishment_id}
                    />
                )
            }
        </Layout.Content>
    );
}
export default Transfer; 