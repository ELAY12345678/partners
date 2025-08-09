import React, { useEffect, useState } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { useSelector } from 'react-redux';
import { Row, message, Table, Typography, Tooltip, Col, DatePicker } from 'antd';

import { IoAlertCircleOutline } from 'react-icons/io5'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'

import _ from 'lodash';
import AsyncButton from '../../../../components/asyncButton';
import { getService } from '../../../../services';
import { Box } from '../../../../components';
import { useInvoicesByYear } from '../../lib/useInvoicesByYear';
import styled from 'styled-components';
import { useInvoicesDetailsByMonth } from '../../lib/useInvoicesDetailsByMonth';

const StyledTable = styled(Table)`
    & .ant-table-thead>tr>th{
        background: #fff !important;
        color: #979696;
    }
    & .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before{
        display: none;
    }
    & .ant-table-tbody .ant-table-cell{
        border-bottom: 0px;
    }
`;

const invoicePaymentsService = getService('invoice-payments');

const handleDowloadExcelDetails = async ({ year, month, establishment_branch_id, establishment_id }) => {
    await invoicePaymentsService.find({
        query: {
            year,
            month,
            establishment_id,
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
};



const InvoiceDetails = ({ item = {}, expanded }) => {

    const currentUser = useSelector(({ appReducer }) => appReducer?.user);

    const USERS_ROLES = {
        admin: 'admin',
        user: 'user',
    };


    const subTableColumns = [
        {
            title: 'Descripción',
            dataIndex: 'week_range_name',
        },
        currentUser?.role === USERS_ROLES.admin && {
            title: 'Cantidad de Reservas',
            dataIndex: 'reservation_quantity',
            width: 100,
        },
        currentUser?.role === USERS_ROLES.admin ? {
            title: 'Cantidad de Comensales',
            dataIndex: 'total_persons',
            width: 100,
        } : {
            title: 'Cantidad',
            dataIndex: 'total_persons',
            width: 100,
        },
        {
            title: 'Precio por Unidad',
            dataIndex: 'avg_meta_commission_per_person',
            width: 150,
            render: (value) =>  value ? `$ ${numeral(value).format("0,0").replace(',', '.')}` : ''
        },
        {
            title: 'Subtotal',
            dataIndex: 'total_commission_tax_excl',
            width: 100,
            render: (value) => `$ ${numeral(value || "").format("0,0").replace(',', '.')}`
        },
        {
            title: 'IVA',
            dataIndex: 'total_commission_tax',
            width: 100,
            render: (value) => `$ ${numeral(value || "").format("0,0").replace(',', '.')}`
        },
        {
            title: 'Total',
            dataIndex: 'total_commission_tax_incl',
            width: 100,
            render: (value) => `$ ${numeral(value || "").format("0,0").replace(',', '.')}`
        },
    ];


    const { invoicesDetailsByMonth, isLoading } = useInvoicesDetailsByMonth({
        expanded,
        year: Number(moment(item?.date, 'YYYY-MM').format('YYYY')),
        month: Number(moment(item?.date, 'YYYY-MM').format('MM')),
    });


    return (
        <div style={{ padding: '15px 50px', background: '#fff' }}>
            <StyledTable
                size='small'
                bordered={false}
                pagination={false}
                columns={_.filter(subTableColumns, (col) => col)}
                dataSource={_.map(invoicesDetailsByMonth, (item, index) => ({ ...item, key: index }))}
                loading={isLoading}
            />
        </div>
    )
}

const columns = ({ establishment_branch_id, establishment_id }) => [
    {
        key: 'date',
        title: 'date',
        dataIndex: 'date',
        ellipsis: true,
        render: (value) => _.capitalize(moment(value, 'YYYY-MM').format('MMMM YYYY'))
    },
    {
        key: 'total_reservation_paid_amount',
        title: 'total_reservation_paid_amount',
        dataIndex: 'total_reservation_paid_amount',
        ellipsis: true,
        width: 150,
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
        ellipsis: true,
        width: 180,
        render: (value, record) => {
            return (
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
            );
        },
    }
];

const AccounStatus = () => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);const [selectedYear, setSelectedYear] = useState(moment());
    const { invoicesByYear, isLoading } = useInvoicesByYear({ year: (selectedYear.format('YYYY')) });
    const [expandedRows, setExpandedRows] = useState([]);

    const defaultExpandable = {
        expandedRowKeys: expandedRows,
        onExpandedRowsChange: (rows) => setExpandedRows(rows),
        expandedRowRender: (record, index, indent, expanded) => {
            return expanded && <InvoiceDetails item={record} expanded={expanded} />
        },
        expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
                <MdOutlineKeyboardArrowUp onClick={e => onExpand(record, e)} size='25' />
            ) : (
                <MdOutlineKeyboardArrowDown onClick={e => onExpand(record, e)} size='25' />
            )
    };

    const tableProps = {
        bordered: false,
        expandable: defaultExpandable,
        title: undefined,
        showHeader: false,
        footer: undefined,
        rowSelection: false,
        scroll: {},
        tableLayout: undefined,
    };


    useEffect(() => {
        setExpandedRows([]);
    }, [establishmentFilters]);


    return (
        <>
            {
                !establishmentFilters?.establishment_id ? (
                    <Box>
                        *Selecciona un restaurante para ver los registros*
                    </Box>
                ) : (

                    <div>
                        <Row justify={'space-between'} align={'middle'}>
                            <Col>
                                <Typography.Title level={4} >
                                    Estado de la cuenta  <span>
                                        <Tooltip placement='bottomLeft' title={'Consulta el estado de tus cuentas de cada periodo con la comisión por reservas y pagos por Appartapay.'}>

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
                            columns={columns({ ...establishmentFilters })}
                            dataSource={_.map(invoicesByYear, (item, index) => ({ ...item, key: index }))}
                        />
                    </div>
                )}
        </>
    );
}
export default AccounStatus;
