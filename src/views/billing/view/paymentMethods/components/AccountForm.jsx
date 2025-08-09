import { Button, Col, Form, Input, InputNumber, message, Row, Select } from "antd";
import _ from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../../services";
import { FormContainerStyled, Title } from "./styles";
import AsyncButton from "../../../../../components/asyncButton";
import { useResetFormOnCloseModal } from "../hooks/useResetFormOnCloseModal";
import { useBanks } from "../../../../../hooks/useBanks";

const DOCUMENT_TYPES = _.sortBy(
    [
            {
        value: "id",
        label: "Cédula",
    },
    {
        value: "foreigner_id",
        label: "Cédula de extranjería",
    },
    {
        value: "passport",
        label: "Pasaporte",
    },
    {
        value: "ti",
        label: "Tarjeta de identidad",
    },
    {
        value: "nit",
        label: "NIT",
    }
    ],
    'label',
);

const ACCOUNT_TYPES = [
    {
        id: "current",
        name: "Corriente",
    },
    {
        id: "saving",
        name: "Ahorros",
    },
];

const AccountForm = ({ onClose, onFinish, open, payAccountId }) => {
    const payBanks = getService('pay-banks');

    const [form] = Form.useForm();
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const [banks, isLoadingBanks] = useBanks();

    const [hasError, setHasError] = useState(true);

    const handleSubmit = async () => {
        await form.validateFields()
            .then(async () => {
                const {
                    owner_name,
                    account_number,
                    document,
                    ...rest
                } = form.getFieldsValue();
                if (establishmentFilters?.establishment_id) {
                    await payBanks.create({
                        ...rest,
                        owner_name,
                        name:owner_name,
                        transaction_type: 'receive',
                        pay_account_id:payAccountId,
                        account_number: `${account_number}`,
                        document: `${document}`,
                        ...establishmentFilters,
                    })
                        .then(() => {
                            message.success("¡Felicidades! Tu método de pago fue agregado exitosamente.");
                            if (onFinish) {
                                onFinish();
                            }
                            if (onClose) {
                                onClose();
                            }
                            form.resetFields();
                        })
                        .catch((error) => {
                            message.error(error?.message || "¡Ups! Hubo un error al agregar tu método de pago. Inténtalo nuevamente.")
                        });
                } else {
                    message.error("Debes seleccionar un restaurante!")
                }
            }).catch(() => {
            })
    };

    useResetFormOnCloseModal({
        open,
        form,
    });

    return (
        <Col flex={'auto'} >
            <Title >
                Datos Cta. ahorros/Corriente
            </Title>
            <FormContainerStyled>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    onChange={() => {
                        form.validateFields().then((response) => {
                            setHasError(false);
                        }).catch((error) => {
                            setHasError(true);
                        })
                    }}
                >

                    <Form.Item
                        name={'account_number'}
                        label="Número de la cuenta"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[
                            { required: true, message: 'Ingresa el número de cuenta' },
                            { type: 'number', message: 'Ingresa un número valido' }
                        ]}
                    >
                        <InputNumber
                            size="middle"
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                            placeholder="Escribe el número de la cuenta"
                        />
                    </Form.Item>



                    <div style={{ display: 'flex', gap: '10px' }}>

                        <Form.Item
                            name={'bank_id'}
                            label="Banco"
                            style={{ width: '60%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[{ required: true, message: 'Seleccina el banco' }]}
                        >
                            <Select
                                size="middle"
                                loading={isLoadingBanks}
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%', }}
                                placeholder={"Selecciona el banco"}
                                onChange={() => {
                                    form.validateFields().then((response) => {
                                        setHasError(false);
                                    }).catch((error) => {
                                        setHasError(true);
                                    })
                                }}
                            >
                                {
                                    _.map(banks, ({ name, id }) => (
                                        <Select.Option key={id} value={id}  style={{fontSize: '12px'}}>
                                            {name}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name={"account_type"}
                            label="Tipo de la cuenta"
                            style={{ width: '40%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[
                                { required: true, message: 'Ingresa el tipo de cuenta' },
                            ]}
                        >
                            <Select
                                size="middle"
                                options={_.map(ACCOUNT_TYPES, ({ name, id }) => ({ label: name, value: id }))}
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                                placeholder="Selecciona el tipo"
                                onChange={() => {
                                    form.validateFields().then((response) => {
                                        setHasError(false);
                                    }).catch((error) => {
                                        setHasError(true);
                                    })
                                }}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name={'account_reference'}
                        label="Referencia bancaria"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[{ type: 'string' }]}
                    >
                        <Input
                            size="middle"
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px' }}
                            placeholder={"Escribe la referencia bancaria"}
                        />
                    </Form.Item>
                    <Form.Item
                        name={'owner_name'}
                        label="Nombre del titular"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[{ required: true, message: "Ingresa el nombre del titular de la cuenta" }, { type: 'string' }]}
                    >
                        <Input
                            size="middle"
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px' }}
                            placeholder={"Escribe el nombre del titular"}
                        />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name={'document_type'}
                            label="Tipo documento"
                            style={{ width: '40%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[{ required: true, message: 'Escoge un tipo de documento' }]}
                        >
                            <Select
                                size="middle"
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px' }}
                                placeholder="Seleccina el tipo"
                                options={DOCUMENT_TYPES}
                                onChange={() => {
                                    form.validateFields().then((response) => {
                                        setHasError(false);
                                    }).catch((error) => {
                                        setHasError(true);
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"document"}
                            label="Identificación"
                            style={{ width: '60%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[{ required: true, message: 'Ingresa el número de documento' }]}
                        >
                            <InputNumber
                                size="middle"
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                                placeholder="Escribe el número"
                            />
                        </Form.Item>
                    </div>
                </Form>
            </FormContainerStyled>
            <Row gutter={8} >
                <Col span={12}>
                    <Button
                        block
                        size="large"
                        type="primary"
                        ghost
                        style={{
                            fontWeight: '700',
                            borderRadius: '6px'
                        }}
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                </Col>

                <Col span={12}>
                    <AsyncButton
                        block
                        size="large"
                        type="primary"
                        style={{
                            fontWeight: '700',
                            borderRadius: '6px',
                        }}
                        onClick={handleSubmit}
                        disabled={hasError}
                    >
                        Agregar método
                    </AsyncButton>
                </Col>

            </Row>
        </Col>
    )
};

export default AccountForm;