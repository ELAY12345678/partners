import React, { useState } from 'react';
import { message, Button, Tag, Drawer, Input, Select, InputNumber, DatePicker } from 'antd';
import { getService } from '../../services';
import { Grid } from '../../components/com';
import { RoundedButton } from '../../components/com/grid/Styles';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { useCities } from '../../hooks/useCities';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';
import { SimpleForm } from '../../components/com/form/';
import SelectField from "../../components/com/form/SelectField";

const status = [
    {
        id: "active",
        name: "Activo",
    },
    {
        id: "inactive",
        name: "Inactivo",
    },
];
const types = [
    {
        id: "allBranches",
        name: "allBranches",
    },
    {
        id: "specificBranches",
        name: "specificBranches",
    },
];
const discount_applies_to = [
    {
        id: "reservation",
        name: "Reserva",
    },
    {
        id: "num_persons",
        name: "Cada Persona",
    },
];
const condition_type = [
    {
        id: "newUsers",
        name: "newUsers",
    },
    {
        id: "allUsers",
        name: "allUsers",
    },
    {
        id: "ByConditions",
        name: "ByConditions",
    },
];

const columns = ({ onEdit, cities }) => [
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
        dataIndex: "code",
        key: "code",
        title: "Código del cupón",
        sorter: true,
    },
    {
        dataIndex: "code",
        key: "code",
        title: "Código del cupón",
        sorter: true,
    },
    {
        dataIndex: "status",
        key: "status",
        title: "Código del cupón",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">{value}</Tag> : <Tag color="red">{value}</Tag>
    },
    {
        dataIndex: "amount_campaign",
        key: "amount_campaign",
        title: "Campaña monto total",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
    },
    {
        dataIndex: "amount_discount_per_use",
        key: "amount_discount_per_use",
        title: "Valor descuento",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
    },
    {
        dataIndex: "use_type",
        key: "use_type",
        title: "Aplicar descuento a",
        sorter: true,
        render: (value) => _.find(discount_applies_to, ({ id }) => id === value)?.name || value
    },
    {
        dataIndex: "type",
        key: "type",
        title: "Aplica para",
        sorter: true
    },
    {
        dataIndex: "city_id",
        key: "city_id",
        title: "Ciudad",
        render: (value) => _.find(cities, ({ id }) => value === id)?.name || ''
    },
    {
        dataIndex: "start_date_time",
        key: "start_date_time",
        title: "Fecha inicio",
        sorter: true,
        render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
    },
    {
        dataIndex: "end_date_time",
        key: "end_date_time",
        title: "Fecha fin",
        sorter: true,
        render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
    },
    {
        dataIndex: "claims_by_user",
        key: "claims_by_user",
        title: "Usos por usuario",
        sorter: true,
    },
    {
        dataIndex: "condition_type",
        key: "condition_type",
        title: "Tipo de condición",
        sorter: true,
    },
    {
        dataIndex: "condition_user_no_reservation_days",
        key: "condition_user_no_reservation_days",
        title: "Condición: Usuarios sin reservas en x días",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        render: (id, record) =>
            <Button
                type="text"
                onClick={() => onEdit(record)}
                icon={<AiOutlineEdit />}
            />
    }
]

const Coupons = () => {

    const couponsService = getService('coupons');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState();
    const [selectedCondition, setSelectedCondition] = useState();

    const [cities, loadingCities] = useCities();

    const onEdit = (record) => {
        setSelectedCoupon({
            ...record,
            start_date_time: moment(record.start_date_time),
            end_date_time: moment(record.end_date_time)
        });
        setSelectedCondition(record?.condition_type);
        setDrawerVisible(true);
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        data.start_date_time = data.start_date_time ? moment(data.start_date_time).utc().format() : undefined;
        data.end_date_time = data.end_date_time ? moment(data.end_date_time).utc().format() : undefined;

        if (selectedCoupon && selectedCoupon.id) {
            await couponsService.patch(selectedCoupon.id, data)
                .then(() => {
                    message.success("Cupón actualizado!");
                    setSelectedCoupon();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await couponsService.create(data)
                .then(() => {
                    message.success("Cupón creado correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                source='coupons'
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, cities })}
                actions={{}}
                searchField="q"
                searchText="Nombre"
                search={true}
                filters={
                    <>
                        <SelectField
                            alwaysOn
                            source="status"
                            name="status"
                            label="Estado"
                            placeholder="Estado"
                            allowEmpty
                            choices={status}
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                        <SelectField
                            alwaysOn
                            source="city_id"
                            name="city_id"
                            label="Ciudad"
                            placeholder="Ciudad"
                            allowEmpty
                            choices={cities}
                            size="medium"
                            loading={loadingCities}
                            style={{ width: '15rem' }}
                        />
                        <SelectField
                            alwaysOn
                            source="condition_type"
                            name="condition_type"
                            label="Tipo de condición"
                            placeholder="Tipo de condición"
                            allowEmpty
                            choices={condition_type}
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                    </>
                }
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
                    width={520}
                    title={`${selectedCoupon ? 'Editar' : 'Crear'} cupón`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCoupon();
                        setSelectedCondition();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedCoupon}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            flex={1}
                            name="name"
                            label="Nombre"
                            size='large'
                            validations={[{ required: true, message: "Nombre es requerido" }]}
                        />
                        <Input
                            flex={1}
                            name="code"
                            label="Código del cupón"
                            size='large'
                            validations={[{ required: true, message: "Código es requerido" }]}
                        />
                        <Select
                            flex={0.5}
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
                                _.map(status, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <InputNumber
                            flex={0.5}
                            name="amount_campaign"
                            label="Monto Total"
                            size='large'
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                        <InputNumber
                            flex={0.5}
                            name="amount_discount_per_use"
                            label="Valor Descuento"
                            size='large'
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                        <Select
                            flex={0.5}
                            name='use_type'
                            label="Aplicar descuento a:"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Este campo es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(discount_applies_to, ({ id, name }, index) =>
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
                            flex={1}
                            name='type'
                            label="Aplica para"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Este campo es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(types, ({ id, name }, index) =>
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
                            flex={1}
                            name='city_id'
                            label="Ciudad"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Ciudad es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(cities, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <DatePicker
                            flex={0.5}
                            size='large'
                            name="start_date_time"
                            label="Fecha Inicio"
                            format='YYYY-MM-DD HH:mm:ss'
                            secondStep={60}
                            showTime
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                        <DatePicker
                            flex={0.5}
                            size='large'
                            name="end_date_time"
                            label="Fecha Fin"
                            format='YYYY-MM-DD HH:mm:ss'
                            secondStep={60}
                            showTime
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name="claims_by_user"
                            label="Usos por usuario"
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                        <Select
                            flex={0.5}
                            name='condition_type'
                            label="Tipo de Condición"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Este campo es requerido',
                                },
                            ]}
                            onChange={(value) => setSelectedCondition(value)}
                        >
                            {
                                _.map(condition_type, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <InputNumber
                            flex={0.5}
                            initial={0}
                            min={0}
                            size='large'
                            name="condition_user_no_reservation_days"
                            label="Condición: Usuarios sin reservas  x dias"
                            validations={[{ required: selectedCondition === 'ByConditions', message: "Este campo es requerido" }]}
                        />
                        <Input.TextArea
                            flex={1}
                            name='condition_terms'
                            label='Términos'
                            autoSize
                            validations={[{ required: true, message: "Este campo es requerido" }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default Coupons;