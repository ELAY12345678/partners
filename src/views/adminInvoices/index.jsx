import { useState } from "react";
import { Col, Layout, message, Row, Tag } from "antd";
import _ from "lodash";
import moment from "moment/moment";
import numeral from "numeral";
import { getService } from "../../api";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import { FileUploader, SelectField } from "../../components/com/form";


const INVOICE_PAYMENT_METHOD = [
    {
        id: 'credit_card',
        name: 'Tarjeta de credito'
    },
    {
        id: 'bank_transfer',
        name: 'Débito automático'
    },
    {
        id: 'manual_payment_invoice',
        name: 'Factura'
    },
];

const INVOICE_PAYMENT_METHOD_NAMES = {
    credit_card: "credit_card",
    bank_transfer: "bank_transfer",
    apparta_pay: "apparta_pay",
    manual_payment_invoice: 'manual_payment_invoice',
};

const INVOICE_PAYMENT_METHOD_DICTIONARY = {
    credit_card: "Tarjeta de credito",
    bank_transfer: "Débito automático",
    apparta_pay: "AppartaPay",
    manual_payment_invoice: 'Factura',
};

const INVOICE_STATUS = [
    {
        id: 'completed',
        name: 'Completado'
    },
    {
        id: 'pending',
        name: 'Pendiente'
    },
    {
        id: 'rejected',
        name: 'Rechazado'
    },
    {
        id: 'crossed',
        name: 'Cruzado'
    },
];

const TYPE_RESERVATION_STATUS = [
    {
        id: 'app_reservations',
        name: 'Reservas'
    },
    {
        id: 'tmp_platform',
        name: 'TMP'
    }
];


const INVOICE_STATUS_COLOR = {
    completed: 'success',
    rejected: 'error',
    pending: 'processing',
};

const INVOICE_STATUS_DICTIONARY = {
    completed: 'Completado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    crossed: 'Cruzado',
};

const INVOICE_STATUS_DICTIONARY_NAMES = {
    completed: 'completed',
    pending: 'pending',
    rejected: 'rejected',
    crossed: 'crossed',
};

const columns = [
    {
        title: "Id",
        dataIndex: "id",
        key: 'id',
        sorter: true,
        width: 80,
    },
    {
        title: "Establecimiento",
        dataIndex: "establishment",
        key: 'establishment',
        render: (value) => value?.name,
        width: 200,
    },
    {
        title: "Sucursal",
        dataIndex: "establishment_branch",
        key: 'establishment_branch',
        width: 200,
        render: (value) => value?.address
    },
    {
        title: "Metodo de pago",
        dataIndex: "method",
        key: 'method',
        sorter: true,
        render: (value) => INVOICE_PAYMENT_METHOD_DICTIONARY?.[value] || value,
        width: 200,
    },
    {
        title: "Estado",
        dataIndex: "status",
        key: 'status',
        sorter: true,
        width: 130,
        render: (value) => (<Tag color={INVOICE_STATUS_COLOR?.[value] || ''} >
            {INVOICE_STATUS_DICTIONARY?.[value] || value}
        </Tag>)
    },
    {
        title: "Monto total",
        dataIndex: "total_amount",
        key: 'total_amount',
        sorter: true,
        width: 130,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
    },
    {
        title: "Tipo",
        dataIndex: "type",
        key: 'type',
        sorter: true,
        width: 120,
        render: (value) => value == 'app_reservations' ? 'Reservas' : value == 'tmp_platform' ? 'TMP' : 'otras'
    },

    {
        title: "Fecha fin",
        dataIndex: "date_end",
        key: 'date_end',
        sorter: true,
        render: (value, record) => (record?.method === INVOICE_PAYMENT_METHOD_NAMES.credit_card || record?.method === INVOICE_PAYMENT_METHOD_NAMES.bank_transfer) && value && moment(value).format("YYYY-MM-DD h:mm a"),
        width: 200,
    },
    {
        title: "Wompi reference",
        dataIndex: "wompi_reference",
        key: 'wompi_reference',
        sorter: true,
        width: 150,
    },
    {
        title: "Ultimo intento de cobro",
        dataIndex: "last_payment_intent_date",
        key: 'last_payment_intent_date',
        sorter: true,
        render: (value) => value && moment(value).format("YYYY-MM-DD h:mm a"),
        width: 200,
    },
];

const AdminInvoices = () => {
    const invoicePaymentsService = getService('invoice-payments');

    const [updateSource, setUpdateSource] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);

    const handleDownload = async () => {
        const invoicePaymentsService = getService('invoice-payments');

        await invoicePaymentsService.find({
            query: {
                $client: {
                    exportExcelPendingBankTransfer: true,
                }
            }
        })
            .then((response) => window.open(response.path, '_blank'))
            .catch((error) => message.error(error.message || 'No se pudo exportar los registros!'))
    };

    const handleUploadFinish = async (url, _id) => {
        const invoicePaymentsService = getService('invoice-payments');

        await invoicePaymentsService.find(
            {
                query: {
                    $client: { importExcelCompletedBankTransferFilePath: `${url}` }
                }
            }
        )
            .then((response) => {
                message.success(response.message);
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    const handlePayPendingAndRejected = async ({ id }) => {

        await invoicePaymentsService.find({
            query: {
                $client: {
                    receiveByCreditCardInvoicePaymentId: id
                }
            }
        }).catch((error) => {
            message.error(error?.message || "Ha ocurrido un error!");
        })
    };

    const handlePayPendingGroup = async ({ id }) => {
        await invoicePaymentsService.find({
            query: {
                $client: {
                    receiveByCreditCardInvoicePaymentId: id
                }
            }
        }).catch((error) => {
            message.error(error?.message || "Ha ocurrido un error!");
        })
    };

    const tryToReceiveByCreditCardInvoice = async ({ selectedRecords }) => {
        try {
            const data = _.filter(selectedRecords, ({ method, status }) => method === INVOICE_PAYMENT_METHOD_NAMES.credit_card && (status === INVOICE_STATUS_DICTIONARY_NAMES.pending || status === INVOICE_STATUS_DICTIONARY_NAMES.rejected));

            for (let index = 0; index < data.length; index++) {
                await handlePayPendingAndRejected({ id: data[index]?.id })
            }
            message.info("Los pagos estan siendo procesados!");
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                    setUpdateSource(!updateSource);
                }, 8000);
            });
        } catch (error) {
            message.error(error?.message || "Ha ocurrido un error!");
        }
    };

    const tryToReceiveGroupInvoice = async ({ selectedRecords }) => {
        try {
            const idInvocices = _.map(selectedRecords, 'id').join(',')
            await handlePayPendingGroup({id: idInvocices })
            message.info("Los pagos estan siendo procesados!");
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                    setUpdateSource(!updateSource);
                }, 8000);
            });
        } catch (error) {
            message.error(error?.message || "Ha ocurrido un error!");
        }
    };

    const setNewStatus = async ({ id, newStatus }) => {
        await invoicePaymentsService.patch(id, {
            status: newStatus
        })
            .catch((error) => {
                message.error(error?.message || "Ha ocurrido un error!");
            });
    };

    const handleUpdateStatus = async ({ selectedRecords, newStatus }) => {
        try {
            const data = selectedRecords || [];
            if (data.length) {

                for (let index = 0; index < data.length; index++) {
                    await setNewStatus({ id: data[index]?.id, newStatus })
                }
                setUpdateSource(!updateSource);
                if (newStatus === INVOICE_STATUS_DICTIONARY_NAMES.completed) {
                    message.success('Pagos completados exitosamente!');
                } else {
                    message.success('Pagos completados exitosamente!');
                }
            }

        } catch (error) {
            message.error(error?.message || "Ha ocurrido un error!");
        }
    };

    // console.log('selectedRecordsselectedRecords', !_.isEmpty(selectedRecords) ? _.every(selectedRecords, ['establishment_branch_id', selectedRecords[0]?.establishment_branch_id]) && _.every(selectedRecords, ['status', selectedRecords[0]?.pending]): true)
    console.log('selectedRecordsselectedRecords',  !_.every(selectedRecords, item => item.establishment_branch_id === selectedRecords[0]?.establishment_branch_id && item?.status === "pending" && item?.method == 'credit_card'),selectedRecords)

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                selection={true}
                onChangeSelection={(_, selectedRecords) => {
                    setSelectedRecords(selectedRecords);
                }}
                maxSelection={10}
                custom={true}
                source="invoice-payments"
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    },
                    method: {
                        $nin: [INVOICE_PAYMENT_METHOD_NAMES.apparta_pay]
                    },
                    date_end:{
                        $gt: moment('2023-08-31', 'YYYY-MM-DD').endOf('day').format()
                    }
                }}
                searchField="q"
                searchText="Buscar"
                search={true}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns}
                extra={
                    <Row gutter={[8, 8]}>
                        <Col>
                            <AsyncButton
                                type="primary"
                                style={{ borderRadius: '0.5rem' }}
                                onClick={handleDownload}
                            >
                                Exportar pagos por débito automático pendientes
                            </AsyncButton>
                        </Col>
                        <Col>
                            <FileUploader
                                preview={false}
                                path={`invoicesPayments/import/`}
                                style={{ borderRadius: '0.5rem', height: '32px !important' }}
                                title='Importar pagos'
                                allowTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                                onFinish={(url) =>
                                    handleUploadFinish(url)
                                }
                            />
                        </Col>
                        <Col>
                            <AsyncButton
                                type="primary"
                                style={{ borderRadius: '0.5rem' }}
                                disabled={ _.isEmpty(selectedRecords)}
                                onClick={async () => await handleUpdateStatus({ selectedRecords: selectedRecords, newStatus: INVOICE_STATUS_DICTIONARY_NAMES.completed })}
                            >
                                Completar pago
                            </AsyncButton>
                        </Col>
                        <Col>
                            <AsyncButton
                                type="primary"
                                danger
                                style={{ borderRadius: '0.5rem' }}
                                disabled={ _.isEmpty(selectedRecords)}
                                onClick={async () => await handleUpdateStatus({ selectedRecords: selectedRecords, newStatus: INVOICE_STATUS_DICTIONARY_NAMES.rejected })}
                            >
                                Rechazar pago
                            </AsyncButton>
                        </Col>
                        <Col>
                            <AsyncButton
                                type="primary"
                                style={{ borderRadius: '0.5rem' }}
                                disabled={
                                    _.some(selectedRecords, ({ method, status }) => method !== INVOICE_PAYMENT_METHOD_NAMES.credit_card || (status !== INVOICE_STATUS_DICTIONARY_NAMES.pending && status !== INVOICE_STATUS_DICTIONARY_NAMES.rejected)) || _.isEmpty(selectedRecords)
                                }
                                onClick={async () => await tryToReceiveByCreditCardInvoice({ selectedRecords: selectedRecords })}
                            >
                                Cobrar
                            </AsyncButton></Col>
                        <Col>
                            <AsyncButton
                                type="primary"
                                style={{ borderRadius: '0.5rem' }}
                                disabled={
                                    // !_.isEmpty(selectedRecords) ? selectedRecords.some(item => item.establishment_branch_id !== selectedRecords[0]?.establishment_branch_id) : true
                                    !_.isEmpty(selectedRecords) ? !_.every(selectedRecords, item => item.establishment_branch_id === selectedRecords[0]?.establishment_branch_id && item.status === "pending"  && item?.method == 'credit_card') : true
                                    //selectedRecords.some(item => item.establishment_branch_id !== selectedRecords[0]?.establishment_branch_id  && item.status !== 'pending')
                                    // _.every(selectedRecords, ['establishment_branch_id', selectedRecords[0]?.establishment_branch_id]) ||  _.isEmpty(selectedRecords)
                                }
                                onClick={async () => await tryToReceiveGroupInvoice({ selectedRecords: selectedRecords })}
                            >
                                Cobrar agrupados {!_.isEmpty(selectedRecords) ? _.every(selectedRecords, item => item.establishment_branch_id === selectedRecords[0]?.establishment_branch_id && item.status === "pending"  && item?.method == 'credit_card') ?  `$${numeral(_.sumBy(selectedRecords, 'total_amount_tax_incl') || '').format("0,0")}` : '' : '' }
                            </AsyncButton></Col>
                            <Col>
                            <AsyncButton
                                type="primary"
                                style={{ borderRadius: '0.5rem' }}
                                disabled={ _.isEmpty(selectedRecords)}
                                onClick={async () => await handleUpdateStatus({ selectedRecords: selectedRecords, newStatus: INVOICE_STATUS_DICTIONARY_NAMES.crossed })}
                            >
                                Cruzar pagos
                            </AsyncButton>
                        </Col>
                    </Row>
                }

                filters={
                    <>
                        <SelectField
                            alwaysOn
                            source="status"
                            name="status"
                            label="Estado"
                            placeholder="Estado"
                            allowEmpty
                            choices={INVOICE_STATUS}
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                        <SelectField
                            alwaysOn
                            source="method"
                            name="method"
                            label="Metodo de pago"
                            placeholder="Metodo de pago"
                            allowEmpty
                            choices={INVOICE_PAYMENT_METHOD}
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                        <SelectField
                            alwaysOn
                            source="type"
                            name="type"
                            label="Tipo"
                            placeholder="Tipo"
                            allowEmpty
                            choices={TYPE_RESERVATION_STATUS}
                            size="medium"
                            style={{ width: '15rem' }}
                        />

                    </>
                }
            />
        </Layout.Content>
    )
}

export default AdminInvoices;
