import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES";
import { Button, DatePicker, Drawer, Input, InputNumber, message, Select, Tag, Form } from 'antd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/';
import { getService } from '../../services';
import { RoundedButton } from '../../components/com/grid/Styles';
import { useBanks } from '../../hooks/useBanks';
import CampaignAppartaPayEstablishments from './CampaignAppartaPayEstablishments';

const STATUS = [
    {
        id: "active",
        name: "Active",
        color: 'green'
    },
    {
        id: "inactive",
        name: "Inactive",
        color: 'red'
    },
];

const TYPES = [
    {
        id: "credit_card",
        name: "Tarjeta de crédito",
    }
];

const CALCULATOR_TYPES = [
    {
        id: "percentage",
        name: "Porcentaje",
    },
    {
        id: "amount_fixed",
        name: "Monto fijo",
    },
];

const FRANCHISES = [
    {
        id: "american-express",
        name: "American Express",
    },
    {
        id: "diners-club",
        name: "Diners Club",
    },
    {
        id: "mastercard",
        name: "MasterCard",
    },
    {
        id: "visa",
        name: "VISA",
    },
];

const CONDITION = [
    {
        id: "specific",
        name: "Especifico",
    },
    {
        id: "general",
        name: "General",
    },
];

const WAY_REDEEM = [
    {
        id: "before_payment",
        name: "Antes del pago",
    },
    {
        id: "after_payment",
        name: "Después del pago",
    },
];



const columns = ({ banks, onEdit, onRemove, onWatch }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: true,
    },
    {
        title: "Tipo",
        dataIndex: "type",
        key: "type",
        sorter: true,
        render: (value) => _.find(TYPES, ({ id }) => id === value)?.name || value
    },
    {
        title: "Franquicia",
        dataIndex: "franchise",
        key: "franchise",
        sorter: true,
        render: (value) => _.find(FRANCHISES, ({ id }) => id === value)?.name || value
    },
    {
        title: "Banco",
        dataIndex: "bank_id",
        key: "bank_id",
        sorter: true,
        render: (value) => _.find(banks, ({ id }) => id === value)?.name || value
    },
    {
        title: "Fecha inicio",
        dataIndex: "date_start",
        key: "date_start",
        sorter: true,
        render: (value) => moment(value).format("YYYY-MM-DD h:mm:ss a")
    },
    {
        title: "Fecha fin",
        dataIndex: "date_end",
        key: "date_end",
        sorter: true,
        render: (value) => moment(value).format("YYYY-MM-DD h:mm:ss a")
    },
    {
        title: "Dias exp.",
        dataIndex: "days_to_expire_bonus",
        key: "days_to_expire_bonus",
        sorter: true,
    },
    {
        title: "Condición",
        dataIndex: "condition_type",
        key: "condition_type",
        sorter: true,
        render: (value) => _.find(CONDITION, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Redención",
        dataIndex: "way_redeem",
        key: "way_redeem",
        sorter: true,
        render: (value) => _.find(WAY_REDEEM, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Estado",
        dataIndex: "status",
        sorter: true,
        render: (value) => {
            const status = _.find(STATUS, ({ id }) => id === value) || value
            return <Tag color={status?.color || 'default'} >
                {status?.name || status}
            </Tag>
        }
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <>
                    <Button
                        type="text"
                        onClick={() => onEdit(record)}
                        icon={<AiOutlineEdit />}
                    />
                    <AsyncButton
                        type="link"
                        onClick={() => onRemove({ id })}
                        icon={<AiOutlineDelete />}
                        confirmText="Desea eliminar?"
                    >
                    </AsyncButton>
                    {
                        record?.condition_type === CONDITION[0].id &&
                        <Button
                            type="text"
                            onClick={() => onWatch({ id, name: record?.name })}
                            icon={<AiOutlineEye />}
                        />
                    }
                </>
            );
        },
    }
];

const SelectField = ({ choices, ...rest }) => {
    return (
        <Select
            {...rest}
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

const CampaignsAppartaPay = () => {

    const [form] = Form.useForm();
    const selectedCampaignId = Form.useWatch('id', form);
    const selectedCalculatorType = Form.useWatch('amount_calculator_type', form);

    const payCampaignService = getService('pay-campaigns');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState();
    const [modalVisible, setModalVisible] = useState(false);


    const [banks] = useBanks();

    const onRemove = async ({ id }) => {
        await payCampaignService.remove(id)
            .then(() => {
                message.success("Campaña eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la campaña! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedCampaign(
            {
                ..._.mapValues(record, (value) => { if (value !== null) { return value; } }),
                date_start: record.date_start && moment(record.date_start),
                date_end: record.date_end && moment(record.date_end),
            }
        );
        setDrawerVisible(true);
    };

    const onWatch = (record) => {
        setSelectedCampaign(record);
        setModalVisible(true);
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        data.date_start = data.date_start ? moment(data.date_start).utc().format() : undefined;
        data.date_end = data.date_end ? moment(data.date_end).utc().format() : undefined;

        const { id, ...rest } = data;

        if (selectedCampaignId) {
            await payCampaignService.patch(selectedCampaignId, {...rest })
                .then(() => {
                    message.success("Campaña actualizada!");
                    setSelectedCampaign();
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await payCampaignService.create({...rest })
                .then(() => {
                    message.success("Campaña creada!");
                    setSelectedCampaign();
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                source='pay-campaigns'
                columns={columns({ banks, onEdit, onRemove, onWatch })}
                updateSource={updateSource}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedCampaign();
                                form.resetFields();
                            }}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                actions={{}}
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedCampaignId ? 'Editar' : 'Crear'} Campaña`}
                    size='large'
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setSelectedCampaign();
                        form.resetFields();
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        form={form}
                        textAcceptButton={`${selectedCampaignId ? 'Actualizar' : 'Crear'}`}
                        onSubmit={handleSubmit}
                        noAcceptButtonBlock={true}
                        initialValues={selectedCampaign}
                    >
                        <Input
                            type='hidden'
                            name='id'
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='type'
                            label='Tipo'
                            choices={TYPES}
                            validations={[
                                {
                                    required: true,
                                    message: `Tipo es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='franchise'
                            label='Franquicia'
                            choices={FRANCHISES}
                            validations={[
                                {
                                    required: true,
                                    message: `Franquicia es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='bank_id'
                            label='Banco'
                            choices={banks}
                            validations={[
                                {
                                    required: true,
                                    message: `Banco es requerido`
                                }
                            ]}
                        />
                        <DatePicker
                            flex={0.5}
                            name='date_start'
                            label='Fecha Inicio'
                            locale={locale}
                            showTime
                            format='YYYY-MM-DD h:mm:ss a'
                            secondStep={60}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha Inicio es requerida',
                                },
                            ]}
                        />
                        <DatePicker
                            flex={0.5}
                            name='date_end'
                            label='Fecha Fin'
                            locale={locale}
                            showTime
                            format='YYYY-MM-DD h:mm:ss a'
                            secondStep={60}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha Fin es requerida',
                                },
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='days_to_expire_bonus'
                            label='Dias expiración'
                            validations={[
                                {
                                    required: true,
                                    message: `Dias exp. es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='amount_calculator_type'
                            label='Tipo de calculo'
                            choices={CALCULATOR_TYPES}
                            validations={[
                                {
                                    required: true,
                                    message: `Este campo es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='amount'
                            label='Monto'
                            validations={[
                                {
                                    required: selectedCalculatorType === CALCULATOR_TYPES[1].id,
                                    message: `Monto. es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='percentage'
                            label='Porcentaje'
                            validations={[
                                {
                                    required: selectedCalculatorType === CALCULATOR_TYPES[0].id,
                                    message: `Porcentaje es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='bin_code'
                            label='Código Bin'
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='max_amount'
                            label='Monto máximo'
                            validations={[
                                {
                                    required: selectedCalculatorType === CALCULATOR_TYPES[0].id,
                                    message: `Monto máximo es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='min_amount'
                            label='Monto mínimo'
                            validations={[
                                {
                                    required: true,
                                    message: `Monto mínimo es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='quantity_available'
                            label='Cantidad Disponible'
                            validations={[
                                {
                                    required: true,
                                    message: `Este campo es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='quantity_available_per_person'
                            label='Cantidad por persona'
                            validations={[
                                {
                                    required: true,
                                    message: `Este campo es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='condition_type'
                            label='Condición'
                            choices={CONDITION}
                            validations={[
                                {
                                    required: true,
                                    message: `Condición es requerida`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='way_redeem'
                            label='Redención'
                            choices={WAY_REDEEM}
                            validations={[
                                {
                                    required: true,
                                    message: `Redención es requerida`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            size='large'
                            name='status'
                            label='Estado'
                            choices={STATUS}
                            validations={[
                                {
                                    required: true,
                                    message: `Estado es requerido`
                                }
                            ]}
                        />
                        <Input.TextArea
                            flex={1}
                            name='description'
                            label='Descripción'
                            autoSize
                        />
                        <Input.TextArea
                            flex={1}
                            name='path'
                            label='Path'
                            autoSize
                        />
                    </SimpleForm>
                </Drawer>
            }
            {
                modalVisible &&
                <CampaignAppartaPayEstablishments
                    modalVisible={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedCampaign();
                    }}
                    selectedCampaign={selectedCampaign}
                />
            }
        </>
    );
}

export default CampaignsAppartaPay;