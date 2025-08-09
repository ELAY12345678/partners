import _ from 'lodash';
import { Drawer, Input, InputNumber, Select, Tag, DatePicker, message } from 'antd';
import moment from "moment";
import numeral from "numeral";
import { useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import { Grid } from "../../components/com";
import { SimpleForm } from '../../components/com/form/';
import { RoundedButton } from '../../components/com/grid/Styles';
import locale from "antd/es/date-picker/locale/es_ES";
import { getService } from '../../services';

const STATUS = [
    {
        id: 'completed',
        name: 'Completado',
        color: 'success'
    },
    {
        id: 'pending',
        name: 'Pendiente',
        color: 'processing'
    },
    {
        id: 'rejected',
        name: 'Rechazado',
        color: 'error'
    },
];

const OUTPUT_TYPE = [
    { id: "bank", name: "Bancario" },
    { id: "administration", name: "Administrativo" },
    { id: "event", name: "Evento" },
    { id: "consumption", name: "Consumo" },
    { id: "reservation_commissions", name: "Comisión de reservas" },
];

const INCOME_TYPE = [
    { id: "event", name: "Evento" },
    { id: "administration", name: "Adminstration" },
    { id: "referrar", name: "Referido" },
    { id: "consumption", name: "Consumo" },
    { id: "bonus", name: "Bono" },
];

const SelectField = ({ choices, ...rest }) => {
    return (
        <Select
            {...rest}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                _.map(choices, ({ id, name }, index) =>
                    <Select.Option
                        key={index}
                        value={id}
                    >
                        {name}
                    </Select.Option>
                )
            }
        </Select>
    );
};

const TableDataPayments = ({ source, filterDefaultValues, permitFetch, updateStatistic, pay_account_id ,expandable}) => {

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: true,
        },
        // source === "pay-payments"
        // && {
        //     title: "Id usuario",
        //     dataIndex: "user",
        //     key: "user_id",
        //     render: (record) => {
        //         return record
        //             ? `${record?.id}`
        //             : "Usuario no asociado";
        //     },
        // },
        source === "pay-payments"
        && {
            title: "Usuario",
            dataIndex: "user",
            key: "user",
            render: (record) => {
                return record
                    ? `${record?.first_name} ${record?.last_name
                    }`
                    : "Usuario no asociado";
            },
        },
        filterDefaultValues?.user_id
        && {
            title: "Establecimiento",
            key: "establishment",
            render: (record) => {
                return record
                    ? `${record?.establishment?.name}-${record?.establishment_branch?.address}`
                    : "Establecimiento no asociado";
            },
        },
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            sorter: true,
            render: (record) => `${record !== null ? record : "Tipo no definido"}`,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Cupón",
            dataIndex: "meta_pay_coupon_name",
            keys: "meta_pay_coupon_name",
            sorter: true,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Beneficio",
            dataIndex: "meta_pay_benefit_name",
            keys: "meta_pay_benefit_name",
            sorter: false,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Fecha de expiración",
            dataIndex: "bonus_expiration_date",
            keys: "bonus_expiration_date",
            sorter: true,
            render: (record) => record && `${moment(record).subtract(1, 'second').format("YYYY/MM/DD")}`,
        },
        {
            title: "Fecha de la transacción",
            dataIndex: "createdAt",
            keys: "createdAt",
            sorter: true,
            render: (record) => `${moment(record).format("YYYY/MM/DD")}`,
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            sorter: true,
            render: (value) => {
                const status = _.find(STATUS, ({ id }) => id === value) || value
                return <Tag color={status?.color} >
                    {status?.name || status}
                </Tag>
            }
        },
        {
            title: "Monto",
            key: "amount",
            dataIndex: "amount",
            render: (record) => {
                return (
                    <span style={{ color: source === "pay-withdrawal" || filterDefaultValues?.user_id ? "#ff4d4f" : "#52c41a", fontSize: "1rem" }}>
                        ${" "} {source === "pay-withdrawal" || filterDefaultValues?.user_id ? "-" : "+"}
                        {numeral(record).format("0,0")}
                    </span>
                );
            },
        },
        source === "pay-payments"
        && {
            title: "Monto disponible",
            key: "amount_available",
            dataIndex: "amount_available",
            render: (record) => {
                return <span> $ {numeral(record).format("0,0")}</span>;
            },
            align: "center",
        },
    ];

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        const payPayments = getService(source);

        if (data.bonus_expiration_date)
            data.bonus_expiration_date = moment(data.bonus_expiration_date)
                .utcOffset(-5)
                .format("YYYY-MM-DD");
        await payPayments.create(data)
            .then(() => {
                message.success(`Nuevo ${source === "pay-withdrawal" || filterDefaultValues?.user_id ? 'egreso' : 'ingreso'} registrado de manera exitosa`);
                setDrawerVisible(false);
                setUpdateSource(!updateSource);
                updateStatistic();
            })
            .catch(err => message.error(err.message));
    };

    return (
        <>
            <Grid
                source={source}
                filterDefaultValues={{
                    $sort: {
                        createdAt: -1
                    },
                    ...filterDefaultValues
                }}
                permitFetch={permitFetch}
                actions={{}}
                updateSource={updateSource}
                columns={_.filter(columns, (record) => typeof record === 'object')}
                expandable={expandable}
            />
        </>
    );
}

export default TableDataPayments;