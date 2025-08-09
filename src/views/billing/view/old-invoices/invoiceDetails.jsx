import React from 'react';
import numeral from 'numeral';
import { Button, Col, Divider, Layout, Row, Typography } from 'antd';
import { IoIosArrowBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Grid } from '../../../../components/com';

const columns = [
    {
        title: "N° Factura",
        dataIndex: "invoice_id",
        sorter: true,
    },
    {
        title: "IVA de la Comisión",
        dataIndex: "commission_tax_amount",
        render: (record) => {
            return (
                <span>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "Comisión SIN IVA",
        dataIndex: "commission_total_amount_tax_excl",
        render: (record) => {
            return (
                <span>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "comisión IVA incluido",
        dataIndex: "commission_total_amount_tax_incl",
        render: (record) => {
            return (
                <span>
                    ${numeral(record).format('0,0')}
                </span>
            );
        },
        sorter: true,
    },
    {
        title: "DETALLES",
        dataIndex: "details",
        sorter: true,
    }
];

const InvoiceDetails = (props) => {

    const meta_establishment_id = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters.establishment_id);
    const navigate = useNavigate();
    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row>
                <Row
                    align='middle'
                    gutter={[16, 16]}
                >
                    <Col>
                        <Button
                            type='text'
                            shape='circle'
                            style={{
                                color: "var(--purple)",
                                display: 'grid',
                                placeContent: 'center'
                            }}
                            onClick={() => navigate(-1)}
                        >
                            <IoIosArrowBack size={25} />
                        </Button>
                    </Col>
                    <Col>
                        <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>
                            Volver a Lista de facturas comisiones
                        </Typography.Title>
                    </Col>
                </Row>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Row>
                <Col span={24}>
                    {
                        props.id && (
                            <Grid
                                filterDefaultValues={{
                                    meta_establishment_id,
                                    $limit: 10000,
                                    status: {
                                        $in: ['pending_integration_invoice', 'completed']
                                    },
                                    $sort: {
                                        id: -1,
                                    },
                                }}
                                columns={columns}
                                source={`invoice-details/${props.id}`}
                                permitFetch={!!(props.id)}
                                actions={{}}
                            />
                        )
                    }
                </Col>
            </Row>
        </Layout.Content>
    );
}
export default InvoiceDetails; 