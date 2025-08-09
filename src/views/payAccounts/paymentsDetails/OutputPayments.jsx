import { useState } from "react";
import TableDataPayments from "./TableDataPayments";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import numeral from "numeral";
import moment from "moment";
import { DatePicker, Drawer, Input, InputNumber, message, Tag } from "antd";
import _ from "lodash";
import Grid  from "../../../components/com/grid/GridOutPutAccount";
import { getService } from "../../../services";
import { SelectField, SimpleForm } from '../../../components/com/form/';
import { RoundedButton } from '../../../components/com/grid/Styles';
import { AiOutlinePlus } from "react-icons/ai";


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

// const Reservations = ({invoice_payment_id, createdAt, status, type}) => {
//     return (
//         <div style={{padding: '0px 20px'}}>
//             <Grid
//                 limit={10}
//                 source={'reservations'}
//                 filterDefaultValues={{
//                     invoice_payment_id,
//                     $sort: {
//                         id: -1
//                     },
//                     commission_tax_incl: {
//                         $gt: 0
//                     }
//                 }}
//                 permitFetch={true}
//                 actions={{}}
//                 columns={[
//                     {
//                         key: 'id',
//                         title: 'Id reserva',
//                         dataIndex: 'id',
//                         ellipsis: true,
//                     },
//                     {
//                         key: 'type',
//                         title: 'Tipo',
//                         ellipsis: true,
//                         render:()=> type,
//                     },
//                     {
//                         title: "Fecha de la transacción",
//                         keys: "createdAt",
//                         sorter: true,
//                         render: (record) => `${moment(`${record?.meta_day} ${record?.meta_start_hour}`,'YYYY-MM-DD HH:mm:ss').format("YYYY/MM/DD - h:mm a")}`,
//                     },
//                     {
//                         sorter: true,
//                             title: "Estado",
//                             key: "status",
//                             render: () => {
//                                 const statusF = _.find(STATUS, ({ id }) => id === status) || status
//                                 return <Tag color={statusF?.color} >
//                                     {statusF?.name || statusF}
//                                 </Tag>
//                             }

//                     },
//                     {
//                         title: "Monto",
//                         key: "commission_tax_incl",
//                         dataIndex: "commission_tax_incl",
//                         render: (record) => {
//                             return (
//                                 <span style={{ color:  "#ff4d4f" , fontSize: "1rem" }}>
//                                     ${" "} {"-"}
//                                     {numeral(record).format("0,0")}
//                                 </span>
//                             );
//                         },
//                     },
//                 ]}
//                 scroll={{}}
//                 transparent={true}
//             />
//         </div>
//     )
// }

const OutputPayments = ({ pay_account_id, updateStatistic, establishment_branch_id }) => {

    const source = 'pay-withdrawal';
    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    // const defaultExpandable = {
    //     expandedRowRender: (record, index, indent, expanded) => {
    //         return expanded && <Reservations  invoice_payment_id={record?.invoice_payment_id} createdAt={record?.createdAt} status={record?.status} type={record?.type}/>
    //     },
    //     expandIcon: ({ expanded, onExpand, record }) =>
    //         record.invoice_payment_id ?
    //             expanded ? (
    //                 <MdOutlineKeyboardArrowUp onClick={e => onExpand(record, e)} size='25' />
    //             ) : (
    //                 <MdOutlineKeyboardArrowDown onClick={e => onExpand(record, e)} size='25' />
    //             )
    //             : null,
    //     rowExpandable: (record) => record.invoice_payment_id,
    // };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        const payPayments = getService(source);

        if (data.bonus_expiration_date)
            data.bonus_expiration_date = moment(data.bonus_expiration_date)
                .utcOffset(-5)
                .format("YYYY-MM-DD");
        await payPayments.create(data)
            .then(() => {
                message.success(`Nuevo ${source === "pay-withdrawal" ? 'egreso' : 'ingreso'} registrado de manera exitosa`);
                setDrawerVisible(false);
                setUpdateSource(!updateSource);
                updateStatistic();
            })
            .catch(err => message.error(err.message));
    };

    return (
        <>
            {
                establishment_branch_id ? (
                    <Grid
                        updateSource={updateSource}
                        source={'pay-withdrawal'}
                        filterDefaultValues={{
                            pay_account_id,
                            $sort: { createdAt: -1 }
                        }}
                        permitFetch={true}
                        actions={{}}
                        extra={
                      
                                <RoundedButton
                                    type="primary"
                                    icon={<AiOutlinePlus />}
                                    onClick={() => setDrawerVisible(true)}
                                >
                                    Nuevo {source === "pay-withdrawal" ? 'egreso' : 'ingreso'}
                                </RoundedButton>
                         
                        }
                        columns={[
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
                                render: (record) => `${record !== null ? record : "Tipo no definido"}`,
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
                                        <span style={{ color: "#ff4d4f", fontSize: "1rem" }}>
                                            ${" "} {"-"}
                                            {numeral(record).format("0,0")}
                                        </span>
                                    );
                                },
                            },
                        ]}
                    />
                ) : (
                    <>
                        <TableDataPayments
                            type='output'
                            source='pay-withdrawal'
                            updateStatistic={updateStatistic}
                            filterDefaultValues={{
                                pay_account_id
                            }}
                            pay_account_id={pay_account_id}
                        // expandable={defaultExpandable}
                        />
                    </>
                )
            }
  {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title={`${'Crear'} ${source === "pay-withdrawal"  ? 'egreso' : 'ingreso'}`}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        textAcceptButton='Crear'
                        scrollToFirstError
                        onSubmit={handleSubmit}
                    >
                        <Input
                            type='hidden'
                            name='pay_account_id'
                            initial={pay_account_id}
                        />
                        <InputNumber
                            flex={1}
                            label='Cantidad'
                            name="amount"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: 'Cantidad es requerida' }]}
                        />
                        <Input.TextArea
                            flex={1}
                            label='Motivo'
                            name="description"
                            autoSize
                            validations={[{ required: true, message: 'Motivo es requerido' }]}
                        />
                        {
                            source === "pay-withdrawal"  ? (
                                <SelectField
                                    flex={1}
                                    label='Tipo de egreso'
                                    name="type"
                                    choices={OUTPUT_TYPE}
                                    validations={[{ required: true, message: 'Tipo de egreso es requerido' }]}
                                />
                            ) : null
                        }
                        <SelectField
                            flex={1}
                            label='Estado'
                            name="status"
                            choices={STATUS}
                            validations={[{ required: true, message: 'Estado es requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default OutputPayments;