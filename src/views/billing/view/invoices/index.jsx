import React, { useState } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Row, message, Table, Typography, Tooltip, Col, DatePicker } from 'antd';

import { IoAlertCircleOutline } from 'react-icons/io5'

import AsyncButton from '../../../../components/asyncButton';
import { getService } from '../../../../services';
import { Box } from '../../../../components';
import { useInvoicesByYear } from '../../lib/useInvoicesByYear';

const serviceSiigoInvoices = getService("get-siigo-invoice");
const invoicePaymentsService = getService('invoice-payments');

export const downloadPDF = (base64) => {
    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement("a");
    const fileName = `${new Date().getTime()}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = fileName;
    downloadLink.click();
}

async function handleDownload(id) {
    try {
        const response = await serviceSiigoInvoices.get(id);
        downloadPDF(response?.invoice?.base64);
    } catch (e) {
        message.error(e.message);
    }
}

const handleDowloadExcelDetails = async ({ year, month, establishment_branch_id }) => {
    await invoicePaymentsService.find({
        query: {
            year,
            month,
            establishment_branch_id,
            $client: {
                generateCommissionsAccountStatusExcelDetails: true,
            }
        }
    }).then((response) => {
        return window.open(response, '_blank');
    }).catch((error) => {
        message.error(error?.message || "Ha ocurrido un error, intenta nuevamente!");
    })
}

const columns = ({ establishment_branch_id, establishment_id }) => [
    {
        title: 'date',
        dataIndex: 'date',
        ellipsis: true,
        render: (value) => _.capitalize(moment(value, 'YYYY-MM').format('MMMM YYYY'))
    },
    {
        title: 'total_reservation_paid_amount',
        dataIndex: 'total_reservation_paid_amount',
        width: 150,
        ellipsis: true,
        render: (value, record) => {
            const total = (record?.total_completed_pay_payments_commission_total_amount_tax_incl || 0)
                + (record?.total_pending_pay_payments_commission_total_amount_tax_incl || 0)
                + (record?.total_reservation_paid_amount || 0)
                + (record?.total_reservation_pending_amount || 0)
                + (record?.total_amount_tmp || 0);
            return `$ ${numeral(total || "").format("0,0").replace(',', '.')}`
        }
    },
    {
        title: 'action',
        key: 'action',
        width: 300,
        ellipsis: true,
        render: (value, record) => {
            return (
                <Row gutter={8} wrap={false}>
                    <Col>
                        <AsyncButton
                            type="primary"
                            ghost
                            disabled={!record?.integration_id}
                            onClick={() => handleDownload(record?.integration_id)}
                        >
                            <span style={{ color: '#000' }}>

                                Exportar PDF
                            </span>
                        </AsyncButton>
                    </Col>
                    <Col>
                        <AsyncButton
                            type="primary"
                            ghost
                            onClick={() => handleDowloadExcelDetails({
                                year: Number(moment(record?.date, 'YYYY-MM').format('YYYY')),
                                month: Number(moment(record?.date, 'YYYY-MM').format('MM')),
                                establishment_branch_id,
                                establishment_id,
                            })}
                        >
                            <span style={{ color: '#000' }}>

                                Exportar Excel
                            </span>
                        </AsyncButton>
                    </Col>

                </Row>

            );
        },
    }
];

const tableProps = {
    bordered: false,
    title: undefined,
    showHeader: false,
    footer: undefined,
    rowSelection: false,
    scroll: {},
    tableLayout: undefined,
};


const Invoices = () => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);const [selectedYear, setSelectedYear] = useState(moment());
    const { invoicesByYear, isLoading } = useInvoicesByYear({ year: (selectedYear.format('YYYY'))});

    return (
        <>
            {
                !establishmentFilters?.establishment_id ? (
                    <Box>
                        *Selecciona un restaurante para ver los registros*
                    </Box>
                ) : (

                    <div>
                        <Row justify={'space-between'} align='middle'>
                            <Col>

                                <Typography.Title level={4} >
                                    Facturas  <span>
                                        <Tooltip placement='bottomLeft' title={'Consulta todas las facturas de tu restaurante y lleva el control exportando excel o pdf.'}>
                                            <IoAlertCircleOutline />
                                        </Tooltip>
                                    </span>
                                </Typography.Title>
                            </Col>
                            <Col>
                                <DatePicker
                                    picker="year"
                                    value={selectedYear}
                                    onChange={(year) => setSelectedYear(year)}
                                    style={{
                                        border: '0px'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Table
                            loading={isLoading}
                            {...tableProps}
                            pagination={{
                                position: ['none', 'none'],
                            }}
                            columns={columns({ ...establishmentFilters})}
                            dataSource={invoicesByYear}
                        />
                    </div>
                )}
        </>
    );
}
export default Invoices;
