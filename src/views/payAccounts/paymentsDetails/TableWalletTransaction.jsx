import React from 'react';
import { useState } from "react";
import _ from 'lodash';
import { Tag } from 'antd';
import moment from "moment";
import numeral from "numeral";
import { AiOutlinePlus } from 'react-icons/ai';
import { Grid } from "../../../components/com";
import { RoundedButton } from '../../../components/com/grid/Styles';

const TRANSACTION_TYPES = [
    { id: 'recharge', name: 'Recarga', color: 'green' },
    { id: 'sms_charge', name: 'Cargo SMS', color: 'orange' },
    { id: 'whatsapp_charge', name: 'Cargo WhatsApp', color: 'blue' },
    { id: 'refund', name: 'Reembolso', color: 'purple' },
];

const PAYMENT_METHODS = [
    { id: 'credit_card', name: 'Tarjeta de crédito' },
    { id: 'pse', name: 'PSE' },
    { id: 'bancolombia_transfer', name: 'Transferencia Bancolombia' },
    { id: 'nequi', name: 'Nequi' },
];

const PAYMENT_STATUS = [
    { id: 'pending', name: 'Pendiente', color: 'processing' },
    { id: 'completed', name: 'Completado', color: 'success' },
    { id: 'rejected', name: 'Rechazado', color: 'error' },
    { id: 'canceled', name: 'Cancelado', color: 'default' },
];

const CHANNELS = [
    { id: 'sms', name: 'SMS' },
    { id: 'whatsapp', name: 'WhatsApp' },
];

const formatAmount = (value) =>
    value !== null && value !== undefined ? `$ ${numeral(value).format("0,0.00")}` : '-';

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Tipo",
        dataIndex: "type",
        key: "type",
        sorter: true,
        render: (value) => {
            const type = _.find(TRANSACTION_TYPES, ({ id }) => id === value);
            return type?.name || value || '-';
        },
    },
    {
        title: "Monto",
        dataIndex: "amount",
        key: "amount",
        sorter: true,
        render: (value, record) => {
            const isCharge = ['sms_charge', 'whatsapp_charge'].includes(record?.type);
            return (
                <span style={{ color: isCharge ? "#ff4d4f" : "#52c41a", fontSize: "1rem" }}>
                    {isCharge ? '-' : '+'}{formatAmount(value)}
                </span>
            );
        },
    },
    {
        title: "Saldo anterior",
        dataIndex: "balance_before",
        key: "balance_before",
        sorter: true,
        render: formatAmount,
    },
    {
        title: "Saldo posterior",
        dataIndex: "balance_after",
        key: "balance_after",
        sorter: true,
        render: formatAmount,
    },
    {
        title: "Método de pago",
        dataIndex: "payment_method",
        key: "payment_method",
        sorter: true,
        render: (value) =>
            _.find(PAYMENT_METHODS, ({ id }) => id === value)?.name || value || '-',
    },
    {
        title: "Estado de pago",
        dataIndex: "payment_status",
        key: "payment_status",
        sorter: true,
        render: (value) => {
            const status = _.find(PAYMENT_STATUS, ({ id }) => id === value);
            return status ? (
                <Tag color={status.color}>{status.name}</Tag>
            ) : (value || '-');
        },
    },
    // {
    //     title: "Referencia",
    //     dataIndex: "payment_reference",
    //     key: "payment_reference",
    //     sorter: true,
    //     render: (value) => value || '-',
    // },
    // {
    //     title: "Campaña",
    //     dataIndex: "campaign_id",
    //     key: "campaign_id",
    //     sorter: true,
    //     render: (value) => value || '-',
    // },
    // {
    //     title: "Unidades",
    //     dataIndex: "meta_units",
    //     key: "meta_units",
    //     sorter: true,
    //     render: (value) => value ?? '-',
    // },
    // {
    //     title: "Precio unitario",
    //     dataIndex: "meta_unit_price",
    //     key: "meta_unit_price",
    //     sorter: true,
    //     render: (value) =>
    //         value !== null && value !== undefined
    //             ? `$ ${numeral(value).format("0,0.0000")}`
    //             : '-',
    // },
    // {
    //     title: "País",
    //     dataIndex: "meta_country_code",
    //     key: "meta_country_code",
    //     sorter: true,
    //     render: (value) => value || '-',
    // },
    {
        title: "Canal",
        dataIndex: "meta_channel",
        key: "meta_channel",
        sorter: true,
        render: (value) =>
            _.find(CHANNELS, ({ id }) => id === value)?.name || value || '-',
    },
    // {
    //     title: "Descripción",
    //     dataIndex: "description",
    //     key: "description",
    //     render: (value) => value || '-',
    // },
    {
        title: "Fecha",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (value) =>
            value ? moment(value).format("YYYY/MM/DD - h:mm a") : '-',
    },
];

const TableWalletTransaction = ({ establishment_branch_id }) => {
    const [updateSource, setUpdateSource] = useState(false);
    return (
       <>
         <Grid
                source='table-wallet-transactions'
                filterDefaultValues={{
                    $sort: {
                        createdAt: -1
                    },
                    establishment_branch_id
                }}
                actions={{}}
                updateSource={updateSource}
                columns={columns}
                // extra={
                //         <RoundedButton
                //             type="primary"
                //             icon={<AiOutlinePlus />}
                //             // onClick={() => setDrawerVisible(true)}
                //         >
                //             Nuevo transacción
                //         </RoundedButton>
                // }
            />
       </>
    );
};

export default TableWalletTransaction;
