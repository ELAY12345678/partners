import { Col, message, Row, Select } from "antd";
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";
import { useState } from "react";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import { FileUploader } from "../../components/com/form/";
import { getService } from "../../services";


const serviceWithdrawal = getService("pay-withdrawal");

const typeColor = {
    payment: "#19b055",
    withdrawal: "#d60915",
};

const STATUS = [
    {
        id: 'pending',
        name: 'Pendiente',
        color: 'warning'
    },
    {
        id: 'rejected',
        name: 'Rechazado',
        color: 'error'
    },
    {
        id: 'completed',
        name: 'Completado',
        color: 'success'
    },
];

const columns = ({ setUpdateSource }) => [
    {
        key: "type",
        dataIndex: "type",
        title: "Tipo",
        sorter: true,
    },
    {
        key: "createdAt",
        dataIndex: "createdAt",
        title: "Fecha Transacción",
        sorter: true,
        render: (value) => `${moment(value).format("YYYY/MM/DD")}`,
    },
    {
        key: "meta_pay_bank_legal_name",
        dataIndex: "meta_pay_bank_legal_name",
        title: "Usuario",
        sorter: true,
    },
    {
        key: "pay_account",
        dataIndex: "pay_account",
        title: "Establecimiento",
        render: (record) =>
            record?.establishment ? `${record?.establishment?.name}` : "Establecimiento no definido",
    },
    {
        key: "pay_account_branch",
        dataIndex: "pay_account",
        title: "Sucursal",
        render: (record) =>
            record?.establishment_branch ? `${record?.establishment_branch?.address}` : "Establecimiento no definido",
    },
    {
        key: 'data_bank',
        title: "Datos bancarios",
        render: (record) =>
            `${record?.meta_withdrawal_bank_name &&
                record?.meta_withdrawal_bank_account_number !== null
                ? record?.meta_withdrawal_bank_name +
                " - " +
                record?.meta_withdrawal_bank_account_number
                : "Cuenta bancaria no definida"
            }`,
        align: "center",
    },
    {
        title: "Monto",
        dataIndex: "amount",
        key: "amount",
        render: (record) => {
            return (
                <span style={{ color: typeColor["withdrawal"], fontSize: "1rem" }}>
                    $ -{numeral(record).format("0,0")}
                </span>
            );
        },
    },
    {
        key: 'status',
        dataIndex: "status",
        title: "Estado",
        sorter: true,
        render: (value, record) =>
            <Select
                value={value}
                onSelect={async (value) => {
                    try {
                        await serviceWithdrawal.patch(record.id, { status: value }, {});
                        message.success("Se ha actualizado el registro de manera exitosa");
                        setUpdateSource((prevValue) => !prevValue);
                    } catch (err) {
                        message.error(err.message);
                    }
                }}
            >
                {
                    _.map(STATUS, ({ id, name }, index) =>
                        <Select.Option value={id} key={index}>
                            {name}
                        </Select.Option>
                    )
                }
            </Select>
    }
];

const PayPending = () => {

    const payWithdrawalService = getService("pay-withdrawal");

    const [updateSource, setUpdateSource] = useState(false);

    const handleExportExcel = async () => {
        await payWithdrawalService.find({
            query: {
                $client: {
                    exports: "withdrawalPendingPayment",
                },
            },
        }).then((response) => {
            window.open(response.path, '_blank');
        }).catch((error) => {
            message.error(error.message);
        });
    };

    const handleImportExcel = async (url) => {
        await payWithdrawalService.create(
            { file_path: url },
            {
                query: {
                    $client: {
                        importExcel: "withdrawalCompletedPayment",
                    },
                },
            }
        ).then(() => {
            message.success('Pagos cargados con éxito!');
            setUpdateSource(!updateSource);
        }).catch((error) => {
            message.error(error.message);
        })
    };

    return (
        <>
            <Grid
                custom={true}
                source="pay-withdrawal"
                filterDefaultValues={{
                    status: 'pending',
                    type: 'bank'
                }}
                searchField="q"
                searchText="Buscar..."
                search={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ setUpdateSource })}
                title={
                    <Row gutter={16} align="middle">
                        <Col>
                            <FileUploader
                                preview={false}
                                path={`pay-withdrawal/`}
                                style={{ borderRadius: '0.5rem' }}
                                title='Importar pagos pendientes'
                                allowTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                                onFinish={(url) => handleImportExcel(url)}
                            />
                        </Col>
                        <Col>
                            <AsyncButton
                                type='primary'
                                size='middle'
                                style={{ borderRadius: '0.5rem' }}
                                onClick={handleExportExcel}
                            >
                                Exportar pagos pendientes
                            </AsyncButton>
                        </Col>
                        <Col>
                            <AsyncButton
                                type='primary'
                                size='middle'
                                style={{ borderRadius: '0.5rem' }}
                                onClick={() => window.open('https://api.apparta.co/job-create-pay-withdrawals?$client[createTo]=establishmentsBranhs', '_blank')}
                            >
                                Generar pagos pendientes
                            </AsyncButton>
                        </Col>
                    </Row>
                }
            />
        </>
    );
}

export default PayPending;