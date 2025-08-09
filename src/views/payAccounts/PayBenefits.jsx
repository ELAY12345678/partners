import { Button, DatePicker, Drawer, Input, InputNumber, message, Select, Tag, Form } from "antd";
import _ from "lodash";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { Grid } from "../../components/com";
import { SimpleForm } from "../../components/com/form/";
import { RoundedButton } from "../../components/com/grid/Styles";
import { useCities } from "../../hooks/useCities";
import { getService } from "../../services";
import SelectFieldFilter from "../../components/com/form/SelectField";
import AsyncButton from "../../components/asyncButton";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import RichTextField from "../../components/richTextField";

const TYPES = [
    {
        id: "general",
        name: "General",
    },
    {
        id: "specific",
        name: "Especifico",
    },
];

const CALCULATOR_TYPE = [
    {
        id: "percentage",
        name: "Porcentaje",
    },
    {
        id: "amount_fixed",
        name: "Monto fijo",
    },
];

const STATUS = [
    {
        id: 'active',
        name: 'Activo',
        color: 'success'
    },
    {
        id: 'inactive',
        name: 'Inactivo',
        color: 'magenta'
    },
    {
        id: 'expired',
        name: 'Expired',
        color: 'error'
    },
    {
        id: 'inactive_until',
        name: 'Inactivo hasta',
        color: 'processing'
    },
];


const SelectField = ({ choices, ...rest }) => {
    return (
        <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
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

const columns = ({ cities, onEdit, onRemove, navigate }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "name",
        dataIndex: "name",
        title: "Nombre",
        sorter: true,
    },
    {
        key: "city_id",
        dataIndex: "city_id",
        title: "Ciudad",
        sorter: true,
        render: (value) => _.find(cities, ({ id }) => id === value)?.name || value
    },
    {
        key: "expire_day",
        dataIndex: "expire_day",
        title: "Fecha expiración",
        sorter: true,
        render: (value) => moment(value).format('YYYY-MM-DD h:mm:ss a')
    },
    {
        key: "type",
        dataIndex: "type",
        title: "Tipo",
        sorter: true,
        render: (value) => _.find(TYPES, ({ id }) => id === value)?.name || value
    },
    {
        key: "status",
        dataIndex: "status",
        title: "Estado",
        sorter: true,
        render: (value) => {
            const status = _.find(STATUS, ({ id }) => id === value) || value
            return <Tag color={status?.color} >
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
                    <Button
                        type="text"
                        onClick={() => navigate(
                            '/dashboard/management/pay-accounts/benefit',
                            {
                                state: {
                                    pay_benefit_id: id,
                                    benefit_name: `${record?.name}`,
                                    isSpecific: record?.type === TYPES[1].id,
                                    city_id: record?.city_id
                                }
                            })}
                        icon={<AiOutlineEye />}
                    />
                </>
            );
        },
    }
];

const PayBenefits = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const benefitId = Form.useWatch('id', form);
    const calculatorTypeValue = Form.useWatch('calculator_type', form);
    const statusValue = Form.useWatch('status', form);

    const payBenefitsService = getService("pay-benefits");

    const [cities, loadingCities] = useCities();

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBenefits, setSelectedBenefits] = useState();

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        if (data?.expire_day)
            data.expire_day = moment(data.expire_day).utc().format();
        if (data?.inactive_until)
            data.inactive_until = moment(data.inactive_until).utc().format();

        const { id, ...rest } = data;

        if (benefitId) {
            await payBenefitsService.patch(benefitId, { ...rest })
                .then(() => {
                    message.success("Beneficio actualizado!");
                    setSelectedBenefits(undefined);
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await payBenefitsService.create({ ...rest })
                .then(() => {
                    message.success("Beneficio Creado!");
                    setSelectedBenefits(undefined);
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const onRemove = async ({ id }) => {
        await payBenefitsService.remove(id)
            .then(() => {
                message.success("Beneficio eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Beneficio! ' + error?.message)
            )
    };

    const onEdit = (record) => {

        setSelectedBenefits(
            {
                ..._.mapValues(record, (value) => { if (value !== null) { return value; } }),
                expire_day: record.expire_day && moment(record.expire_day),
                inactive_until: record.inactive_until && moment(record.inactive_until),
            }
        );
        setDrawerVisible(true);
    };

    return (
        <>
            <Grid
                custom={true}
                source="pay-benefits"
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    }
                }}
                searchById={true}
                searchField="q"
                searchText="Buscar..."
                search={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ cities, onEdit, onRemove, navigate })}
                filters={
                    <>
                        <SelectFieldFilter
                            alwaysOn
                            loading={loadingCities}
                            source="city_id"
                            name="city_id"
                            label="city_id"
                            placeholder="Ciudad"
                            allowClear
                            choices={cities}
                            size="medium"
                            style={{
                                width: '15em'
                            }}
                        />
                    </>
                }
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedBenefits(undefined);
                                form.resetFields();
                            }}
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
                    title={`${benefitId ? 'Editar' : 'Crear'} Beneficio`}
                    placement="right"
                    width={600}
                    visible={drawerVisible}
                    onClose={() => {
                        setSelectedBenefits(undefined);
                        form.resetFields();
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        form={form}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                        allowNull={true}
                        initialValues={selectedBenefits}
                    >
                        <Input
                            type='hidden'
                            name='id'
                        />
                        <Input
                            flex={0.5}
                            name='name'
                            label='Nombre'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            name='city_id'
                            label="Ciudad"
                            size='large'
                            allowClear
                            choices={cities}
                        />
                        <SelectField
                            flex={0.5}
                            name='type'
                            label="Tipo"
                            size='large'
                            allowClear
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
                            name='calculator_type'
                            label="Tipo de calculo"
                            size='large'
                            allowClear
                            choices={CALCULATOR_TYPE}
                            validations={[
                                {
                                    required: true,
                                    message: `Tipo de calculo es requerido`
                                }
                            ]}
                        />
                        {
                            calculatorTypeValue === CALCULATOR_TYPE[0].id &&
                            <InputNumber
                                flex={0.5}
                                name='percentage'
                                label='Porcentaje'
                                size="large"
                                validations={[
                                    {
                                        required: true,
                                        message: `Porcentaje es requerido`
                                    }
                                ]}
                            />
                        }
                        {
                            calculatorTypeValue === CALCULATOR_TYPE[1].id &&
                            <InputNumber
                                flex={0.5}
                                name='amount_fixed'
                                label='Monto fijo'
                                size="large"
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                validations={[
                                    {
                                        required: true,
                                        message: `Monto fijo es requerido`
                                    }
                                ]}
                            />
                        }
                        <InputNumber
                            flex={0.5}
                            name='budget'
                            label='Presupuesto'
                            size="large"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[
                                {
                                    required: true,
                                    message: `Presupuesto es requerido`
                                }
                            ]}
                        />
                        <SelectField
                            flex={0.5}
                            name='status'
                            label="Estado"
                            size='large'
                            allowClear
                            choices={STATUS}
                            validations={[
                                {
                                    required: true,
                                    message: `Estado es requerido`
                                }
                            ]}
                        />
                        <Input
                            flex={1}
                            name='assumed_by'
                            label='Asumido por'
                            size="large"
                        />
                        <RichTextField
                            flex={1}
                            name='terms'
                            label='Términos'
                            defaultValue={selectedBenefits?.terms}
                        />
                        <Input.TextArea
                            flex={1}
                            name='details'
                            label='Detalles'
                            size="large"
                            autoSize
                        />
                        <SelectField
                            flex={0.5}
                            name='use_with_own_reservation'
                            label="Disponible usar con reserva propia"
                            size='large'
                            allowClear
                            choices={[
                                {
                                    id: 'true',
                                    name: 'Si',
                                },
                                {
                                    id: 'false',
                                    name: 'No',
                                },
                            ]}
                        />
                        <InputNumber
                                flex={0.5}
                                name='min_reservation_claimed'
                                label='Mínimo de reservas claimed'
                                size="large"
                            />
                        <DatePicker
                            flex={0.5}
                            name='expire_day'
                            label='Día de expiración'
                            size="large"
                            showTime
                            validations={[
                                {
                                    required: true,
                                    message: `Expiración es requerida`
                                }
                            ]}
                        />
                        {
                            statusValue === STATUS[3].id &&
                            <DatePicker
                                flex={0.5}
                                name='inactive_until'
                                label='Inactivo hasta'
                                size="large"
                                showTime
                                validations={[
                                    {
                                        required: true,
                                        message: `Fecha requerida`
                                    }
                                ]}
                            />
                        }
                        <InputNumber
                            flex={0.5}
                            name='quantity_available'
                            label='Cantidad disponible'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Cantidad disponible es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='days_to_expire'
                            label='Horas para expirar'
                            size="large"
                        />
                        <InputNumber
                            flex={0.5}
                            name='quantity_per_person'
                            label='Cantidad por persona'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Cantidad por persona es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='max_valid_amount'
                            label='Max monto valido'
                            size="large"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[
                                {
                                    required: true,
                                    message: `Max monto es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='min_valid_amount'
                            label='Min monto valido'
                            size="large"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[
                                {
                                    required: true,
                                    message: `Min monto es requerido`
                                }
                            ]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default PayBenefits;