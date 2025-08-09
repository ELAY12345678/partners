
import numeral from "numeral";
import _ from "lodash";
import { Tag } from "antd";
import moment from "moment";
import Grid from "../../components/com/grid/GridOutPutAccount";

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


const OutputPayments = ({ pay_account_id }) => {
    
    return (
        <>
            <Grid
                source={'pay-withdrawal'}
                filterDefaultValues={{
                    pay_account_id,
                    $sort:{createdAt: -1}
                }}
                permitFetch={true}
                actions={{}}
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
                                <span style={{ color:  "#ff4d4f", fontSize: "1rem" }}>
                                    ${" "} {"-"}
                                    {numeral(record).format("0,0")}
                                </span>
                            );
                        },
                    },
                ]}
            />
        </>
    );
}

export default OutputPayments;




// import { Grid } from "../../components/com";
// import TableDataPayments from "./TableDataPayments";
// import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
// import numeral from "numeral";
// import moment from "moment";
// import { Tag } from "antd";
// import _ from "lodash";
// import { useEffect, useState } from "react";

// const STATUS = [
//     {
//         id: 'completed',
//         name: 'Completado',
//         color: 'success'
//     },
//     {
//         id: 'pending',
//         name: 'Pendiente',
//         color: 'processing'
//     },
//     {
//         id: 'rejected',
//         name: 'Rechazado',
//         color: 'error'
//     },
// ];

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
//                 showHeader={false}
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

// const OutputPayments = ({ pay_account_id, updateStatistic }) => {

//     const [expandedRows, setExpandedRows] = useState([]);


//     const defaultExpandable = {
//         expandedRowKeys:expandedRows,
//         onExpandedRowsChange:(rows)=> setExpandedRows(rows),
//         expandedRowRender: (record, index, indent, expanded) => {
//             return expanded && <Reservations  invoice_payment_id={record?.invoice_payment_id} createdAt={record?.createdAt} status={record?.status} type={record?.type}/>
//         },
//         expandIcon: ({ expanded, onExpand, record }) =>
//             record.invoice_payment_id ?
//                 expanded ? (
//                     <MdOutlineKeyboardArrowUp onClick={e => onExpand(record, e)} size='25' />
//                 ) : (
//                     <MdOutlineKeyboardArrowDown onClick={e => onExpand(record, e)} size='25' />
//                 )
//                 : null,
//         rowExpandable: (record) => record.invoice_payment_id,
//     };

//     useEffect(() => {
//         setExpandedRows([]);
//     }, [pay_account_id])

//     return (
//         <>
//             <TableDataPayments
//                 source='pay-withdrawal'
//                 updateStatistic={updateStatistic}
//                 filterDefaultValues={{
//                     pay_account_id,
//                     // amount: {
//                     //     $gt: 0
//                     // }
//                 }}
//                 pay_account_id={pay_account_id}
//                 expandable={defaultExpandable}
//             />
//         </>
//     );
// }

// export default OutputPayments;