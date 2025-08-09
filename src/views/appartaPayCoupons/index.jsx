import { Button, DatePicker, Drawer, Input, InputNumber, Layout, message, Row, Select, Tag } from 'antd';
import _ from 'lodash';
import numeral from 'numeral';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/';
import { RoundedButton } from '../../components/com/grid/Styles';
import { getService } from '../../services';
import locale from "antd/es/date-picker/locale/es_ES";
import moment from 'moment';


const STATUS = [
    {
        id: "active",
        name: "Active",
    },
    {
        id: "inactive",
        name: "Inactive",
    },
];
const CODE_TYPE = [
    {
        id: null,
        name: "Ninguno",
    },
    {
        id: "pay_benefit",
        name: "Pay Benefit",
    },
];

const columns = ({ onEdit, onRemove }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
    },
    {
        dataIndex: "name",
        key: "name",
        title: "Nombre",
        sorter: true,
    },
    {
        dataIndex: "nanoid",
        key: "nanoid",
        title: "Código",
    },
    {
        dataIndex: "amount",
        key: "amount",
        title: "Monto",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
    },
    {
        dataIndex: "max_quantity_uses",
        key: "max_quantity_uses",
        title: "Maxima cantidad de usos",
        sorter: true,
    },
    {
        dataIndex: "max_quantity_uses_per_user",
        key: "max_quantity_uses_per_user",
        title: "Maxima cantidad de usos por persona",
        sorter: true,
    },
    {
        dataIndex: "expire_date",
        key: "expire_date",
        title: "Fecha y hora de expiración",
        sorter: true,
        render: (value) => value ? moment(value).format("YYYY-MM-DD h:mm a") : "",
    },
    {
        dataIndex: "type",
        key: "type",
        title: "Tipo",
    },
    {
        dataIndex: "status",
        key: "status",
        title: "Estado",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <Row>
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
                </Row>
            );
        },
    }
];

const AppartaPayCoupons = () => {

    const appartaPayCouponsService = getService('pay-cupons-code');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [fieldsValue, setFieldsValue] = useState();


    const onEdit = (record) => {
        const { type, ...rest } = record;
        setFieldsValue({ type });
        setSelectedCoupon({
            ...rest,
            expire_date: record?.expire_date ? moment(record.expire_date) : undefined
        });
        setDrawerVisible(true);
    }

    const onRemove = async ({ id }) => {
        await appartaPayCouponsService.remove(id)
            .then(() => {
                message.success("Cupón eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Cupón! ' + error?.message)
            )
    }

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        data.expire_date = data?.expire_date ? moment(data.expire_date).utc().format('YYYY-MM-DD hh:mm:00') : undefined;

        if (selectedCoupon && selectedCoupon.id) {
            await appartaPayCouponsService.patch(selectedCoupon.id, data)
                .then(() => {
                    message.success("Cupón actualizado!");
                    setSelectedCoupon();
                    setFieldsValue();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await appartaPayCouponsService.create(data)
                .then(() => {
                    message.success("Cupón Creado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='pay-cupons-code'
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove })}
                actions={{}}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedCoupon ? 'Editar' : 'Crear'} Cupón`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCoupon();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedCoupon}
                        onSubmit={handleSubmit}
                        allowNull={true}
                    >
                        <Input
                            flex={1}
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.4}
                            size='large'
                            name='amount'
                            label='Monto'
                            validations={[
                                {
                                    required: true,
                                    message: `Monto es requerido`
                                }
                            ]}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        <DatePicker
                            flex={0.6}
                            locale={locale}
                            showTime
                            name='expire_date'
                            label='Fecha y hora expiración'
                            format='YYYY-MM-DD h:mm a'
                        />
                        <Input
                            flex={1}
                            name='nanoid'
                            label='Código'
                            validations={[
                                {
                                    required: true,
                                    message: `Código es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='max_quantity_uses'
                            label='Maxima cantidad de usos'
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
                            name='max_quantity_uses_per_user'
                            label='Maxima cantidad de usos por persona'
                            validations={[
                                {
                                    required: true,
                                    message: `Este camp es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={1}
                            name='type'
                            label="Tipo de codigo"
                            size='large'
                            initial={fieldsValue?.type}
                            onSelect={(value) => setFieldsValue({ ...fieldsValue, type: value })}
                        >
                            {
                                _.map(CODE_TYPE, ({ id, name }, index) =>
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
                            fieldsValue?.type === 'pay_benefit' && (
                                <InputNumber
                                    flex={1}
                                    size='large'
                                    name='pay_benefit_id'
                                    label='Id beneficio'
                                    validations={[
                                        {
                                            required: fieldsValue?.type === 'pay_benefit',
                                            message: `Este camp es requerido`
                                        }
                                    ]}
                                />
                            )
                        }
                        <Select
                            flex={1}
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(STATUS, ({ id, name }, index) =>
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
                </Drawer>
            }
        </Layout.Content>
    );
}

export default AppartaPayCoupons;