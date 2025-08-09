import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Col, Divider, Layout, Row, Typography, message } from 'antd';

import { IoDocumentTextOutline } from 'react-icons/io5';
import { AiOutlineDownload, AiOutlineEye } from 'react-icons/ai';


import { Grid } from '../../../../components/com';
import AsyncButton from '../../../../components/asyncButton';
import { getService } from '../../../../services';
import { Box } from '../../../../components';

const serviceSiigoInvoices = getService("get-siigo-invoice");

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

const columns = ({ navigate }) => [
    {
        title: "N° Factura",
        dataIndex: "integration_number",
        sorter: true,
    },
    {
        title: "Nit. Factura",
        dataIndex: "meta_invoice_nit",
        sorter: true,
    },
    {
        title: "Periodo Facturado",
        dataIndex: "id",
        render: (id, { date_start, date_end }) => {
            return (
                <span>
                    {moment(date_start).format('LL')} - {moment(date_end).format('LL')}
                </span>
            );
        },
    },
    {
        title: "Comisión AppartaPay",
        dataIndex: 'commission_sub_apparta_pay_tax_incl',
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block', textAlign: 'right' }}>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "Comisión Reserva",
        dataIndex: "commission_sub_reservation_commission_tax_incl",
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block', textAlign: 'right' }}>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "Comisión total IVA incluido",
        dataIndex: "commission_total_amount_tax_incl",
        render: (record) => {
            return (
                <span style={{ width: '100%', display: 'inline-block', textAlign: 'right' }}>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (value, record) => {
            return (
                <Row>
                    <Button
                        type="link"
                        onClick={() => {
                            navigate(`/dashboard/establishment/billing/invoice/detail/${value}`);
                        }}
                        icon={<AiOutlineEye />}
                    >
                        ver detalles
                    </Button>
                    <AsyncButton
                        type="link"
                        onClick={() => handleDownload(record.integration_id)}
                        icon={<AiOutlineDownload />}
                    >
                        descargar
                    </AsyncButton>
                </Row>
            );
        },
        align: "center",
        width: "400px",
    }
];

const OldInvoices = () => {
    const navigate = useNavigate();
    const meta_establishment_id = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters.establishment_id);

    return (
        <>
                    {
                        !meta_establishment_id ? (
                            <Box>
                                *Selecciona un restaurante para ver los registros*
                            </Box>
                        ) : (
                            <Grid
                                custom={true}
                                filterDefaultValues={{
                                    meta_establishment_id,
                                    status: {
                                        $in: ['pending_integration_invoice', 'completed']
                                    },
                                    $sort: {
                                        id: -1,
                                    },
                                }}
                                columns={columns({ navigate })}
                                source={"invoices"}
                                permitFetch={!!(meta_establishment_id)}
                                actions={{}}
                            />
                        )}
                        </>
    );
}
export default OldInvoices; 