import { useState, useEffect } from "react";
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from "antd";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getService } from "../../../../../services";
import { useInvoiceProfile } from "../lib/useInvoiceProfiles";
import { FormContainerStyled, Title } from "./styles";
import AsyncButton from "../../../../../components/asyncButton";
import { useResetFormOnCloseModal } from "../hooks/useResetFormOnCloseModal";
import { useEstablishmentBranchInvoiceProfice } from "../lib/useEstablishmentBranchInvoiceProfice";


const DOCUMENT_TYPES = _.sortBy(
    [
        { label: 'CC', value: 'CC' },
        { label: 'CE', value: 'CE' },
        { label: 'PPN', value: 'PPN' },
        { label: 'SSN', value: 'SSN' },
        { label: 'LIC', value: 'LIC' },
        { label: 'NIT', value: 'NIT' },
        { label: 'TI', value: 'TI' },
        { label: 'DNI', value: 'DNI' },
    ],
    'label',
);


const CreditCardForm = ({ selectAsDefault, onClose, onFinish, open }) => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const creditCards = getService('credit-cards-establishments');

    const [form] = Form.useForm();
    const { loadingInvoiceProfiles, invoiceProfiles } = useInvoiceProfile();

    const { establishmentBranchInvoiceProfile } = useEstablishmentBranchInvoiceProfice(establishmentFilters?.establishment_branch_id);

    const [hasError, setHasError] = useState(true);


    const handleSubmit = async () => {

        await form.validateFields()
            .then(async () => {
                const {
                    exp_date,
                    cvc,
                    identification_number,
                    masked_number,
                    ...rest
                } = form.getFieldsValue();
                if (establishmentFilters?.establishment_id) {
                    await creditCards.create({
                        ...rest,
                        establishment_id: establishmentFilters?.establishment_id,
                        establishment_branch_id: establishmentFilters?.establishment_branch_id,
                        cvc: String(cvc),
                        identification_number: String(identification_number),
                        masked_number: String(masked_number),
                        exp_month: String(exp_date)?.slice(0, 2),
                        exp_year: String(exp_date)?.slice(3),
                        default: selectAsDefault ? "true" : "false",
                        by_profiles_ids: "true",
                    })
                        .then((response) => {
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
                    message.error("Debes seleccionar una dirección!")
                }
            }).catch(() => {

            })
    };

    const formatExpireDate = (value) => {
        const inputDate = value;
        let formattedDate = inputDate.replace(/\D/g, '');
        if (formattedDate.length > 2) {
            formattedDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2)}`;
        }
        return formattedDate;
    };

    useResetFormOnCloseModal({
        open,
        form,
    });

    useEffect(() => {
        if (establishmentBranchInvoiceProfile) {
            form.setFieldValue('invoices_profiles_ids', [establishmentBranchInvoiceProfile]);
        } else {
            form.setFieldValue('invoices_profiles_ids', []);
        }
    }, [establishmentBranchInvoiceProfile, establishmentFilters?.establishment_branch_id]);



    return (
        <Col flex={'auto'} >
            <Title >
                Datos de la tarjeta de crédito
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
                        name={'invoices_profiles_ids'}
                        label="Perfiles de facturación responsables"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[{
                            required: true,
                            message: establishmentFilters?.establishment_branch_id && !establishmentBranchInvoiceProfile ? "Debes crear un perfil de facturación para esta dirección" : 'Seleccina el/los perfiles'
                        }]}
                    >
                        <Select
                            size="middle"
                            mode='multiple'
                            maxTagCount='responsive'
                            loading={loadingInvoiceProfiles}
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%', }}
                            placeholder={"Seleccina el perfil de facturación"}
                            options={
                                establishmentFilters?.establishment_branch_id ?  _.map(_.filter(invoiceProfiles, ({id})=> id=== establishmentBranchInvoiceProfile), ({ legal_name, id }) => ({ label: legal_name, value: id })):
                                _.map(invoiceProfiles, ({ legal_name, id }) => ({ label: legal_name, value: id }))
                            }
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
                        name={'owner_name'}
                        label="Nombre del titular"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[{ required: true, message: "Ingresa el nombre del titular de la tarjeta" }, { type: 'string' }]}
                    >
                        <Input
                            size="middle"
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px' }}
                            placeholder={"Escribe el nombre del titular"}
                        />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name={'type_document'}
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
                            name={"identification_number"}
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

                    <Form.Item
                        name={'masked_number'}
                        label="Número de la tarjeta"
                        labelCol={{ style: { fontWeight: '700' } }}
                        rules={[
                            { required: true, message: 'Ingresa el número de la tarjeta' },
                            { type: 'number', min: 1000000000000, message: 'Ingresa un número valido' }
                        ]}
                    >
                        <InputNumber
                            // min={1}
                            minLength={13}
                            maxLength={19}
                            size="middle"
                            style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                            placeholder="Escribe el número de la tarjeta"
                            formatter={(value) => `${value}`.replace(/(.{4})/g, '$1 ').trim()}
                        />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item
                            name={"exp_date"}
                            label="MM/AA"
                            style={{ width: '50%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[
                                { required: true, message: 'Ingresa la fecha de vencimiento' },
                                {
                                    message: 'Por favor, ingrese una fecha de vencimiento válida',
                                    validator: (_, value) => {
                                        if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(value) || String(value).length === 0 || !value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Por favor, ingrese una fecha de vencimiento válida');
                                    },
                                },
                            ]}
                        >
                            <Input
                                minLength={5}
                                maxLength={5}
                                size="middle"
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                                placeholder="Escribe fecha"
                                onChange={(event) => {
                                    form.setFieldValue('exp_date', formatExpireDate(event.target.value))
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"cvc"}
                            label="CVV"
                            style={{ width: '50%' }}
                            labelCol={{ style: { fontWeight: '700' } }}
                            rules={[
                                { required: true, message: 'Ingresa el código de seguridad' },
                                {
                                    validator: (_, value) => {
                                        if ((!String(value).includes(' ') && !!Number(value)) || String(value).length === 0 || !value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ingresa un código valido'))
                                    }
                                }
                            ]}
                        >
                            <Input
                                size="middle"
                                maxLength={4}
                                style={{ borderColor: '#CCCCCC', borderRadius: '6px', width: '100%' }}
                                placeholder="***"
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
}

export default CreditCardForm;