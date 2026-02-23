import { useEffect, useState } from "react";
import { Col, Divider, Drawer, Form, Layout, message, Row, Statistic, Tag, Select, InputNumber, Button, Input, DatePicker, } from "antd";
import _, { debounce } from "lodash";
import moment from "moment/moment";
import numeral from "numeral";
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';
import { getService } from "../../api";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import { FileUploader, SelectField, SimpleForm } from "../../components/com/form";
import { useToppings } from "./hooks/useToppings";
import { Box } from "../../components/Styles";
import { RoundedButton } from "../../components/com/grid/Styles";
import AsyncSelect from "../../components/asyncSelect";


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

const popUpsService = getService('pop-ups');

const columns = ({ handleEdit, popUpsOptions, handleChangePopUp }) => [
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
        title: "Nro. factura",
        dataIndex: "invoice_id",
        key: 'invoice_id',
        sorter: true,
        width: 120,
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
    {
        title: "No. de cuenta",
        key: 'meta_pay_bank_account_number',
        dataIndex: 'meta_pay_bank_account_number',
        sorter: true,
        width: 150,

    },
    {
        title: "No. Tarjeta",
        // dataIndex: "wompi_reference",
        key: 'credit_card_masked_number',
        sorter: true,
        width: 150,
        render: (_, record) => {
            const masked = record?.billing_composite?.[0]?.credit_card_masked_number;
            if (!masked) return '';
            return `**** **** **** ${masked}`;
        },
    },
    {
        title: "Perfil de facturación",
        // dataIndex: "wompi_reference",
        key: 'invoice_profile_legal_name',
        sorter: true,
        width: 200,
        render: (_, record) =>
            record?.billing_composite?.[0]?.invoice_profile_legal_name || '',

    },
    {
        title: "Nit",
        // dataIndex: "wompi_reference",
        key: 'invoice_profile_nit',
        sorter: true,
        width: 200,
        render: (_, record) =>
            record?.billing_composite?.[0]?.invoice_profile_nit || '',

    },
    {
        title: "Comercial asignado",
        // dataIndex: "wompi_reference",
        key: 'commercial_assigned',
        sorter: true,
        width: 200,
        render: (_, record) => `${record?.billing_composite?.[0]?.account_manager_user_first_name || ''} ${record?.billing_composite?.[0]?.account_manager_user_last_name || ''}`,

    },
    {
        title: "Fecha de primera factura",
        // dataIndex: "wompi_reference",
        key: 'first_completed_invoice_date',
        sorter: true,
        width: 200,
        render: (_, record) =>
            record?.billing_composite?.[0]?.first_completed_invoice_date ? moment(record?.billing_composite?.[0]?.first_completed_invoice_date).format("YYYY-MM-DD h:mm a") : '',

    },
    {
        title: "Dias desde primera factura",
        // dataIndex: "wompi_reference",
        key: 'days_since_first_invoice',
        sorter: true,
        width: 200,
        render: (_, record) =>
            record?.billing_composite?.[0]?.days_since_first_invoice || '',

    },
    {
        title: "Días en mora",
        // dataIndex: "wompi_reference",
        key: 'days_in_arrears',
        sorter: true,
        width: 200,
        render: (_, record) =>
            <span style={{ color: 'red' }}>
                {record?.billing_composite?.[0]?.days_in_arrears || ''}
            </span>

    },
    {
        title: "Pop-up",
        // dataIndex: "pop_up",
        key: 'pop_up',
        sorter: true,
        width: 220,
        render: (_, record) => {

            const popUpSelected = (popUpsOptions || []).find(({ establishments_ids_included }) => JSON.parse(establishments_ids_included || '[]')?.includes(record?.establishment_id));

            const popUpSelectedId = popUpSelected?.id || null;

            return (
                <AsyncSelect
                    options={[{ id: null, name: 'Ninguno' }, ...(popUpsOptions || [])]}
                    placeholder="Seleccionar Pop-up"
                    value={popUpSelectedId}
                    onChange={async (value, option) =>
                        handleChangePopUp({ record, popUpId: value, oldPopUp: popUpSelected })
                    }
                    style={{ width: '100%' }}
                />
            )
        }
    },
    {
        fixed: 'right',
        title: " ",
        dataIndex: 'id',
        width: 60,
        render: (id, record) => {
            return (
                <Row>
                    <Button
                        type="text"
                        onClick={() => handleEdit(record)}
                        icon={<AiOutlineEdit />}
                    />
                    {/* <AsyncButton
                        type="link"
                        onClick={() => onRemove({ id })}
                        icon={<AiOutlineDelete />}
                        confirmText="Desea eliminar?"
                    >
                    </AsyncButton> */}
                </Row>
            );
        },
    }
];

const formatter = value => {
    const [start, end] = `${value}`.split('.') || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$ ${end ? `${v}.${end}` : `${v}`}`;
};

const AdminInvoices = () => {

    const [form] = Form.useForm();

    const methodPayment = Form.useWatch('method', form);
    const typePayment = Form.useWatch('type', form);

    const invoicePaymentsService = getService('invoice-payments');
    const establishmentBranchesService = getService('establishments-branchs');
    const creditCardsService = getService('credit-cards');
    const payBanksService = getService('pay-banks');


    const [updateSource, setUpdateSource] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState();


    const { toppings, loading } = useToppings();

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
            await handlePayPendingGroup({ id: idInvocices })
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


    // Inicion buscador de sucursales

    const [establishmentBranchesOptions, setEstablishmentBranchesOptions] = useState([]);

    const getEstablishmentBranches = (value) => {
        if (value === '') {
            setEstablishmentBranchesOptions([])
            return;
        }
        establishmentBranchesService.find({
            query: {
                q: value,
                $client: {
                    fullName: true
                },
            }
        })
            .then((data) => {
                if (!_.isEmpty(data))
                    setEstablishmentBranchesOptions(_.sortBy(data, [({ full_name }) => full_name]));
            })
            .catch((err) => message.error(err));
    };

    const debounceGetEstablishmentBranches = debounce(getEstablishmentBranches, 500, { maxWait: 800 });

    const [establishmentBranchSelected, setEstablishmentBranchSelected] = useState();

    // Fin buscador de sucursales


    const handleEdit = (record) => {
        setSelectedInvoice(record);
        form.setFieldsValue({
            ...record
        })
        setDrawerVisible(true);
    };


    const [creditCardsOptions, setCreditCardsOptions] = useState([]);
    const [payBanksOptions, setPayBanksOptions] = useState([]);
    const [popUpsOptions, setPopUpsOptions] = useState([]);

    const getCreditCards = (filters) => {
        creditCardsService.find({
            query: filters,
        })
            .then(({ data }) => {
                if (!_.isEmpty(data))
                    setCreditCardsOptions(data);
            })
            .catch((err) => { });
    };

    const getPayBanks = (establishment_id) => {
        if (!establishment_id) return;
        payBanksService.find({
            query: {
                establishment_id,
                transaction_type: 'receive',
                $limit: 10000,
            }
        }).then(({ data }) => {
            if (!_.isEmpty(data))
                setPayBanksOptions(data);
        })
            .catch((err) => { });
    };


    const getPaymentMethods = async (establishment_id, establishment_branch_id, typePaymentInvoice) => {
        if (!establishment_id) return;

        let invoiceProfileId = null;
        if (typePaymentInvoice === 'tmp_platform') {
            const establishmentBranch = await establishmentBranchesService.get(establishment_branch_id, {
                query: {
                    $client: {
                        skipJoins: true
                    }
                }
            });
            invoiceProfileId = establishmentBranch?.invoice_profile_id;
        }

        if (invoiceProfileId) {
            getCreditCards({
                invoice_profile_id: invoiceProfileId,
                $limit: 10000,
            });
        } else {
            getCreditCards({
                user_id: 'null',
                establishment_id,
                $limit: 10000,
            });
        }
    }


    const getPopUps = async () => {

        await popUpsService.find({
            query: {
                type: 'system',
                $limit: 10000,
            }
        })
            .then(({ data }) => {
                if (!_.isEmpty(data))
                    setPopUpsOptions(data);
            })
            .catch((err) => { });
    };


    const handleChangePopUp = async ({ record, popUpId, oldPopUp }) => {

        try {

            // primero eliminar el pop-up actual

            if (oldPopUp) {

                const old_establishments_ids_included = oldPopUp?.establishments_ids_included;

                const old_establishments_ids_included_array = JSON.parse(old_establishments_ids_included || '[]');

                if (!old_establishments_ids_included_array.includes(record?.establishment_id)) {
                    // message.error('El pop-up ya esta incluido en el establecimiento!');
                    return;
                }

                const old_establishments_ids_included_information = oldPopUp?.establishments_ids_included_information;

                const old_establishments_ids_included_information_array = JSON.parse(old_establishments_ids_included_information || '[]');
                const hasEstablishment = _.find(old_establishments_ids_included_information_array, (it) => it?.establishment_id === record?.establishment_id)?.full_name;

                if (!hasEstablishment) {

                    return;
                }

                await popUpsService.patch(oldPopUp?.id, {
                    establishments_ids_included: JSON.stringify(old_establishments_ids_included_array?.filter(it => it !== record?.establishment_id)),
                    establishments_ids_included_information: JSON.stringify(old_establishments_ids_included_information_array?.filter(it => it?.establishment_id !== record?.establishment_id))
                });
            }

            // y luego agregar el nuevo pop-up

            const newPopUp = _.find(popUpsOptions, ({ id }) => id === popUpId);
            if (newPopUp) {
                const establishments_ids_included = newPopUp?.establishments_ids_included;

                const establishments_ids_included_array = JSON.parse(establishments_ids_included || '[]');

                if (establishments_ids_included_array.includes(record?.establishment_id)) {
                    // message.error('El pop-up ya esta incluido en el establecimiento!');
                    return;
                }
                establishments_ids_included_array.push(record?.establishment_id);

                const establishments_ids_included_information = newPopUp?.establishments_ids_included_information;


                const establishments_ids_included_information_array = JSON.parse(establishments_ids_included_information || '[]');
                const hasEstablishment = _.find(establishments_ids_included_information_array, (it) => it?.establishment_id === record?.establishment_id)?.full_name;
                if (hasEstablishment) {
                    // message.error('El pop-up ya esta incluido en el establecimiento!');
                    return;
                }
                establishments_ids_included_information_array.push({
                    establishment_id: record?.establishment_id,
                    full_name: record?.establishment?.name
                });


                await popUpsService.patch(newPopUp?.id, {
                    establishments_ids_included: JSON.stringify(establishments_ids_included_array),
                    establishments_ids_included_information: JSON.stringify(establishments_ids_included_information_array)
                });
            }

            await getPopUps();
            message.success('Pop-up actualizado exitosamente!');
        } catch (error) {
            message.error(error?.message || "Ha ocurrido un error!");
        }
    };

    const handleExport = async (filters) => {
        await invoicePaymentsService.find({
            query: {
                ...filters,
                $client: { exportExcelBankTransfer: true }
            }
        })
            .then((response) => {
                window.location.href = response?.path;
                // window.open(response.path, '_blank')
            })
            .catch((error) => message.error(error.message || 'No se pudo exportar los registros!'))
    }

    const onCloseDrawer = () => { 
        form.resetFields();
        setSelectedInvoice();
        setEstablishmentBranchSelected(null);
        setCreditCardsOptions([]);
        setPayBanksOptions([]);
        setTimeout(() => {
            setDrawerVisible(false);
        }, 500); 
    }

    const handleSubmit = async (err, data, form) => {

        try {

            if (err) return message.error(err);

            if (selectedInvoice?.id) {
                await invoicePaymentsService.patch(selectedInvoice.id, data)
                    .then(() =>
                        message.success("Factura actualizada!")
                    )
            } else {
                const [establishment_id, establishment_branch_id, invoice_profile_id] = data?.establishment_branch_id?.split('-');
                await invoicePaymentsService.create({
                    create_invoice_payments_directly: true,
                    ...data,
                    establishment_id: Number(establishment_id),
                    establishment_branch_id: Number(establishment_branch_id),
                    invoice_profile_id: Number(invoice_profile_id),
                })
                    .then(() =>
                        message.success("Factura creada!")
                    )
            }
            setUpdateSource(!updateSource);
            onCloseDrawer();
        } catch (error) {
            message.error(error?.message || "Ha ocurrido un error!");
        }
    };


    useEffect(() => {
        setCreditCardsOptions([]);
        if (establishmentBranchSelected) {
            const [establishment_id, establishment_branch_id] = establishmentBranchSelected?.split('-');
            getPaymentMethods(establishment_id, establishment_branch_id, typePayment);
        }
    }, [establishmentBranchSelected, typePayment]);

    useEffect(() => {
        setPayBanksOptions([]);
        if (establishmentBranchSelected) {
            const [establishment_id, establishment_branch_id] = establishmentBranchSelected?.split('-');
            getPayBanks(establishment_id);
        }
    }, [establishmentBranchSelected]);


    useEffect(() => {
        getPopUps();
    }, []);


    useEffect(() => {
        form.setFieldsValue({
            credit_card_id: null,
            meta_pay_bank_id: null,
        })
    }, [methodPayment, typePayment, establishmentBranchSelected])




    return (
        <>
            <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />

                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Facturado Ultimo Mes"
                                    value={toppings?.total_billed_last_month}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Pendiente Ultimo Mes"
                                    value={toppings?.total_pending_last_month}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Rechazado Ultimo Mes"
                                    value={toppings?.total_rejected_last_month}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Aprobado+Cruzado Ultimo Mes"
                                    value={toppings?.total_approved_and_crossed_last_month}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                </Row>

                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />

                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Facturado Historico"
                                    value={toppings?.total_billed_historical}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Pendiente Historico"
                                    value={toppings?.total_pending_historical}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Rechazado Historico"
                                    value={toppings?.total_rejected_historical}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                    <Col span={6}>
                        <Box>
                            <Col span={24}>
                                <Statistic
                                    title="Total Aprobado+Cruzado Historico"
                                    value={toppings?.total_approved_and_crossed_historical}
                                    precision={2}
                                    loading={loading}
                                />
                            </Col>
                        </Box>
                    </Col>
                </Row>

                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />

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
                        date_end: {
                            $gt: moment('2023-08-31', 'YYYY-MM-DD').endOf('day').format()
                        },
                        $client: {
                            billingComposite: true
                        }
                    }}
                    searchField="q"
                    searchText="Buscar"
                    search={true}
                    permitFetch={true}
                    actions={{}}
                    updateSource={updateSource}
                    columns={columns({ handleEdit, popUpsOptions, handleChangePopUp })}
                    extra={
                        <Row wrap={false}>
                            <Col flex="auto">
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
                                            disabled={_.isEmpty(selectedRecords)}
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
                                            disabled={_.isEmpty(selectedRecords)}
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
                                                !_.isEmpty(selectedRecords) ? !_.every(selectedRecords, item => item.establishment_branch_id === selectedRecords[0]?.establishment_branch_id && item.status === "pending" && item?.method == 'credit_card') : true
                                                //selectedRecords.some(item => item.establishment_branch_id !== selectedRecords[0]?.establishment_branch_id  && item.status !== 'pending')
                                                // _.every(selectedRecords, ['establishment_branch_id', selectedRecords[0]?.establishment_branch_id]) ||  _.isEmpty(selectedRecords)
                                            }
                                            onClick={async () => await tryToReceiveGroupInvoice({ selectedRecords: selectedRecords })}
                                        >
                                            Cobrar agrupados {!_.isEmpty(selectedRecords) ? _.every(selectedRecords, item => item.establishment_branch_id === selectedRecords[0]?.establishment_branch_id && item.status === "pending" && item?.method == 'credit_card') ? `$${numeral(_.sumBy(selectedRecords, 'total_amount_tax_incl') || '').format("0,0")}` : '' : ''}
                                        </AsyncButton></Col>
                                    <Col>
                                        <AsyncButton
                                            type="primary"
                                            style={{ borderRadius: '0.5rem' }}
                                            disabled={_.isEmpty(selectedRecords)}
                                            onClick={async () => await handleUpdateStatus({ selectedRecords: selectedRecords, newStatus: INVOICE_STATUS_DICTIONARY_NAMES.crossed })}
                                        >
                                            Cruzar pagos
                                        </AsyncButton>
                                    </Col>
                                </Row>
                            </Col>
                            <Col flex="none">
                                <RoundedButton
                                    icon={<AiOutlinePlus />}
                                    type={"primary"}
                                    onClick={() => {
                                        setDrawerVisible(true);
                                        form.resetFields();
                                        setSelectedInvoice();
                                    }}
                                >
                                    Agregar factura
                                </RoundedButton>
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

                            <SelectField
                                alwaysOn
                                source="havent_credit_card"
                                name="havent_credit_card"
                                label="Tiene tarjeta de crédito"
                                placeholder="Tiene tarjeta de crédito"
                                allowEmpty
                                choices={[
                                    {
                                        id: 'true',
                                        name: 'Si'
                                    },
                                    {
                                        id: 'false',
                                        name: 'No'
                                    }
                                ]}
                                size="medium"
                                style={{ width: '15rem' }}
                            />
                            <DatePicker
                                alwaysOn
                                source="first_invoice_month"
                                name="first_invoice_month"
                                label="Mes de primera factura"
                                placeholder="Mes de primera factura"
                                allowEmpty
                                locale='es'
                                picker="month"
                                format="YYYY-MM-01"
                                size="medium"
                                style={{ width: '15rem' }}
                            />

                            <SelectField
                                alwaysOn
                                source="pop_up_id"
                                name="pop_up_id"
                                label="Pop-up"
                                placeholder="Pop-up"
                                allowEmpty
                                choices={popUpsOptions}
                                size="medium"
                                style={{ width: '15rem' }}
                            />
                        </>
                    }
                    exportButton
                    onClickExport={handleExport}
                />
            </Layout.Content>

            {
                drawerVisible
                ?
                (<Drawer
                    title={`${selectedInvoice?.id ? 'Editar' : 'Crear'} factura`}
                    placement="right"
                    width={520}
                    open={drawerVisible}
                    onClose={() => {
                      
                        onCloseDrawer();
                

                    }}
                >
                    {
                        selectedInvoice?.id ? (
                            <div style={{ padding: '0px 8px', marginBottom: '10px' }}>
                                <Input
                                    flex={1}
                                    readOnly
                                    size='large'
                                    defaultValue={`${selectedInvoice?.establishment?.name} - ${selectedInvoice?.establishment_branch?.address}`}

                                />
                            </div>
                        ) : null
                    }
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedInvoice}
                        onSubmit={handleSubmit}
                        form={form}
                    // source="banners"
                    // id={selectedBanner.id}
                    >


                        {
                            selectedInvoice?.id ? null : (
                                <Select
                                    flex={1}
                                    showSearch
                                    name='establishment_branch_id'
                                    placeholder="Añadir sucursal"
                                    allowClear
                                    onSearch={debounceGetEstablishmentBranches}
                                    value={establishmentBranchSelected}
                                    onClear={() => setEstablishmentBranchSelected()}
                                    onSelect={(value) => {
                                        setEstablishmentBranchSelected(value);

                                        const establishmentBranch = _.find(establishmentBranchesOptions, ({ establishment_branch_id }) => establishment_branch_id === value);
                                        if (establishmentBranch?.establishment_id) {
                                            // getInvoiceProfiles(establishmentBranch?.establishment_id);
                                        }
                                    }}
                                    optionFilterProp="children"
                                    style={{ width: '100%' }}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        _.map(establishmentBranchesOptions, ({ establishment_branch_id, establishment_id, full_name, invoice_profile_id }, index) =>
                                            <Select.Option key={index} value={`${establishment_id}-${establishment_branch_id}-${invoice_profile_id}`}>
                                                {full_name}
                                            </Select.Option>
                                        )
                                    }
                                </Select>
                            )
                        }

                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='total_amount_tax_excl'
                            label='Monto total (sin IVA)'
                            validations={[
                                {
                                    required: true,
                                    message: `Monto total es requerido`
                                }
                            ]}
                            formatter={formatter}
                            parser={value => value?.replace(/\$\s?|(,*)/g, '')}

                        />

                        <Select
                            flex={0.5}
                            name='type'
                            label="Tipo"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Tipo es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(TYPE_RESERVATION_STATUS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>

                        <Select
                            flex={0.5}
                            name='method'
                            label="Método de pago"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Método de pago es requerido`
                                }
                            ]}
                        >
                            {
                                _.map([
                                    {
                                        id: 'credit_card',
                                        name: 'Tarjeta de credito'
                                    },
                                    {
                                        id: 'bank_transfer',
                                        name: 'Débito automático'
                                    },
                                ], ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>




                        {
                            selectedInvoice?.id ? null :
                                methodPayment === 'bank_transfer' ? (
                                    <Select
                                        flex={0.5}
                                        name='meta_pay_bank_id'
                                        label="No. de cuenta"
                                        size='large'
                                        validations={[
                                            {
                                                required: true,
                                                message: `No. de cuenta es requerido`
                                            }
                                        ]}
                                    >
                                        {
                                            _.map(payBanksOptions, ({ id, account_number }, index) =>
                                                <Select.Option key={index} value={id}>
                                                    {account_number}
                                                </Select.Option>
                                            )
                                        }
                                    </Select>

                                ) : (
                                    <Select
                                        flex={0.5}
                                        name='credit_card_id'
                                        label="Tarjeta de crédito"
                                        size='large'
                                        validations={[
                                            {
                                                required: true,
                                                message: `Tarjeta de crédito es requerida`
                                            }
                                        ]}
                                    >
                                        {
                                            _.map(creditCardsOptions, ({ id, masked_number,...rest }, index) =>
                                                <Select.Option key={index} value={id}>
                                                    **** **** **** {(masked_number || '')?.replace(/\*/g, '')} {rest?.default === 'true' ? ' (Por defecto)' : ''}
                                                </Select.Option>
                                            )
                                        }
                                    </Select>
                                )
                        }



                        <Select
                            flex={0.5}
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Estado es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(INVOICE_STATUS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>



                    </SimpleForm>
                </Drawer>) : null
            }
        </>

    )
}

export default AdminInvoices;
