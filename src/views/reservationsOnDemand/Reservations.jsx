import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Drawer, Input, InputNumber, Layout, message, Select, Tag, TimePicker, Form } from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import { Grid } from '../../components/com';
import _ from 'lodash';
import moment from 'moment';
import { SimpleForm } from '../../components/com/form/';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { RoundedButton } from '../../components/com/grid/Styles';
import SelectField from "../../components/com/form/SelectField";
import { getService } from '../../services';

const { RangePicker } = DatePicker;


const STATUS = [
    {
        id: 'approved',
        name: 'Aprobada',
        color: 'green'
    },
    {
        id: 'canceled_by_user',
        name: 'Cancelada por el usuario',
        color: 'red'
    },
    {
        id: 'in_progress',
        name: 'En progreso',
        color: 'blue'
    },
    {
        id: 'rejected',
        name: 'Rechazada',
        color: 'red'
    },
    {
        id: 'requested',
        name: 'Solicitada',
        color: 'purple'
    },
]

const columns = ({ onEdit }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
        width: "70px",
    },
    {
        key: "user_id",
        dataIndex: "user_id",
        title: "User Id",
        sorter: true,
        width: "90px",
    },
    {
        key: "meta_user_first_name",
        dataIndex: "meta_user_first_name",
        title: "Usuario",
        sorter: true,
        width: "150px",
        render: (meta_user_first_name, record) => meta_user_first_name + ' ' + record.meta_user_last_name
    },
    {
        key: "meta_user_phone",
        dataIndex: "meta_user_phone",
        title: "Teléfono",
        sorter: true,
        width: "100px",
    },
    {
        key: "meta_user_email",
        dataIndex: "meta_user_email",
        title: "Correo",
        sorter: true,
        width: "150px",
    },
    {
        key: "restaurant_name",
        dataIndex: "restaurant_name",
        title: "Restaurante",
        sorter: true,
        width: "150px",
    },
    {
        key: "restaurant_address",
        dataIndex: "restaurant_address",
        title: "Dirección y ciudad",
        sorter: true,
        width: "200px",
    },
    // {
    //     key: "restaurant_city_name",
    //     dataIndex: "restaurant_city_name",
    //     title: "Ciudad",
    //     sorter: true,
    //     render: (value) => _.capitalize(value)
    // },
    {
        key: "reservation_date",
        dataIndex: "reservation_date",
        title: "Fecha",
        sorter: true,
        render: (value) => moment(value).utc().format('DD-MM-YYYY'),
        width: "100px",
    },
    {
        key: "reservation_start_hour",
        dataIndex: "reservation_start_hour",
        title: "Hora",
        sorter: true,
        width: "100px",
        render: (value) => moment(value, 'HH:mm:ss').format('h:mm a')
    },
    {
        key: "reservation_persons",
        dataIndex: "reservation_persons",
        title: "Personas",
        width: "90px",
        sorter: true,
    },
    {
        key: "special_occasion",
        dataIndex: "special_occasion",
        title: "Ocasión",
        width: "150px",
    },
    {
        key: "status",
        dataIndex: "status",
        title: "Estado",
        sorter: true,
        width: "180px",
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
        key: 'actions',
        width: "100px",
        render: (id, record) =>
            <Button
                type="text"
                onClick={() => onEdit(record)}
                icon={<AiOutlineEdit />}
            />
    }

]

const ReservationsOnDemand = () => {

    const [form] = Form.useForm();
    const statusValue = Form.useWatch('status', form);
    const idValue = Form.useWatch('id', form);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedDate, setSelectedDate] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState();


    const handleChange = (rangeDates) => {
        try {
            setSelectedDate(_.map(rangeDates, (date) => date.format("YYYY-MM-DD")));
        } catch (err) {
            message.error(err.message);
        }
    };

    const onEdit = (record) => {
        setSelectedReservation(
            {
                ...record,
                reservation_start_hour: record.reservation_start_hour &&  moment(record.reservation_start_hour, 'HH:mm:ss'),
                reservation_date: record.reservation_date &&  moment(record.reservation_date).utc()
            }
        )
        setDrawerVisible(true);
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        if (data.reservation_start_hour)
            data.reservation_start_hour = moment(data.reservation_start_hour).format('HH:mm:ss');
        if (data.reservation_date)
            data.reservation_date = moment(data.reservation_date).format();
        if (!data.status)
            data.status = statusValue.status;

        const reservationService = getService('reservation-on-demand');

        if (idValue) {
            const { status, reservation_date, reservation_start_hour } = data;
            await reservationService.patch(idValue, { status, reservation_date, reservation_start_hour })
                .then(() => {
                    message.success("Reserva actualizada!");
                    setSelectedReservation();
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            const { id, ...rest } = data;
            await reservationService.create({ ...rest })
                .then(() => {
                    message.success("Reserva creada correctamente!");
                    setSelectedReservation();
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
                source="reservation-on-demand"
                updateSource={updateSource}
                searchField="q"
                searchText="Usuario, dirección... "
                search={true}
                searchById={true}
                filters={
                    <>
                        <SelectField
                            alwaysOn
                            source="status"
                            name="status"
                            label="Estado"
                            placeholder="Estado"
                            allowEmpty
                            choices={STATUS}
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                    </>
                }
                columns={columns({ onEdit })}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    },
                    $and: [
                        { reservation_date: { $lte: selectedDate[1] } },
                        { reservation_date: { $gte: selectedDate[0] } },
                    ],
                }}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedReservation();
                                form.resetFields();
                            }}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                actions={{}}
                title={
                    <>
                        <RangePicker
                            locale={locale}
                            onChange={(rangeDates) => handleChange(rangeDates)}
                        />
                    </>
                }
            />
            {
                drawerVisible && (
                    <Drawer
                        size='large'
                        title={`${idValue ? 'Editar' : 'Crear'} Reserva`}
                        placement="right"
                        visible={drawerVisible}
                        onClose={() => {
                            setSelectedReservation();
                            form.resetFields();
                            setDrawerVisible(false);
                        }}
                    >
                        <SimpleForm
                            form={form}
                            textAcceptButton={`${idValue ? 'Actualizar' : 'Crear'}`}
                            onSubmit={handleSubmit}
                            initialValues={selectedReservation}
                        >
                            <Input
                                type='hidden'
                                name='id'
                            />
                            <InputNumber
                                flex={0.5}
                                size='large'
                                label="User Id"
                                name="user_id"
                                validations={[
                                    {
                                        required: true,
                                        message: `User Id es requerido`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <InputNumber
                                flex={0.5}
                                size='large'
                                label="Teléfono"
                                name="meta_user_phone"
                                validations={[
                                    {
                                        required: true,
                                        message: `Teléfono es requerido`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <Input
                                flex={1}
                                size='large'
                                label="Correo"
                                name="meta_user_email"
                                validations={[
                                    {
                                        required: true,
                                        message: `Correo es requerido`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <Input
                                flex={1}
                                size='large'
                                label="Restaurante"
                                name="restaurant_name"
                                validations={[
                                    {
                                        required: true,
                                        message: `Restaurante es requerido`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <Input
                                flex={1}
                                size='large'
                                label="Dirección"
                                name="restaurant_address"
                                validations={[
                                    {
                                        required: true,
                                        message: `Dirección es requerida`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <Input
                                flex={0.5}
                                size='large'
                                label="Ciudad"
                                name="restaurant_city_name"
                                validations={[
                                    {
                                        required: true,
                                        message: `Ciudad es requerida`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <InputNumber
                                flex={0.5}
                                size='large'
                                label="Teléfono"
                                name="meta_user_phone"
                                validations={[
                                    {
                                        required: true,
                                        message: `Teléfono es requerido`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <InputNumber
                                flex={0.5}
                                size='large'
                                label="Personas"
                                name="reservation_persons"
                                validations={[
                                    {
                                        required: true,
                                        message: `Personas es requerida`
                                    }
                                ]}
                                disabled={!!idValue}
                            />
                            <Input
                                flex={0.5}
                                label="Ocasión"
                                size='large'
                                name="special_occasion"
                                disabled={!!idValue}
                            />
                            <DatePicker
                                flex={0.5}
                                size='large'
                                label="Fecha"
                                name="reservation_date"
                                format="DD-MM-YYYY"
                                locale={locale}
                                validations={[
                                    {
                                        required: true,
                                        message: `Fecha es requerida`
                                    }
                                ]}
                            />
                            <TimePicker
                                flex={0.5}
                                size='large'
                                label="Hora"
                                name="reservation_start_hour"
                                format="h:mm a"
                                validations={[
                                    {
                                        required: true,
                                        message: `Hora es requerida`
                                    }
                                ]}
                            />
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
                            {
                                statusValue === STATUS[3].id &&
                                <Input.TextArea
                                    flex={1}
                                    name='rejected_reason'
                                    label='Razón de rechazo'
                                    autoSize
                                    validations={[
                                        {
                                            required: true,
                                            message: 'Razón es requerida',
                                        },
                                    ]}
                                />
                            }

                        </SimpleForm>
                    </Drawer>
                )

            }
        </>
    );
}

export default ReservationsOnDemand;