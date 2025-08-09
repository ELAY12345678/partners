import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Layout, message, Button, TimePicker, Drawer, Select, InputNumber } from 'antd';
import { Grid } from '../../components/com';
import { useCities } from '../../hooks/useCities';
import { getService } from '../../services';
import { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import SelectField from "../../components/com/form/SelectField";
import { SimpleForm } from '../../components/com/form/';
import { MINUTES_STEPS_FOR_DISCOUNTS } from '../../constants';

const status = [
    {
        name: "Adquirido",
        id: "acquired",
    },
    {
        name: "Inactivo",
        id: "inactive",
    },
    {
        name: "Reclamado",
        id: "claimed",
    },
    {
        name: "Not Claimed",
        id: "notClaimed",
    },
    {
        name: "Expirado",
        id: "expired",
    },
    {
        name: "Cancelado",
        id: "canceled",
    },
    {
        name: "Pending Approval",
        id: "pendingApproval",
    },
    {
        name: "Pending Verificación por cupón",
        id: "pendingClaimedVerification",
    },
    {
        name: "Not Approval",
        id: "notApproved",
    },
    {
        name: "Canceled by Establishment",
        id: "canceledByEstablishment",
    },
];

const columns = ({ onEdit, onRemove, cities }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
        width: "70px",
    },
    {
        dataIndex: "user_id",
        key: "user_id",
        title: "User Id",
        sorter: true,
        width: "70px",
    },
    {
        dataIndex: "meta_user_first_name",
        key: "meta_user_first_name",
        title: "Usuario",
        sorter: true,
        width: "130px",
        render: (meta_user_first_name, { meta_user_last_name }) => meta_user_first_name + ' ' + meta_user_last_name
    },
    {
        dataIndex: "meta_user_phone",
        key: "meta_user_phone",
        title: "Teléfono",
        width: "100px",
        sorter: true,
    },
    {
        dataIndex: "meta_establishment_name",
        key: "meta_establishment_name",
        title: "Establecimiento",
        sorter: true,
        width: "150px",
    },
    {
        dataIndex: "meta_establishment_branch_address",
        key: "meta_establishment_branch_address",
        title: "Sucursal",
        sorter: true,
        width: "150px",
    },
    {
        dataIndex: "city_id",
        key: "city_id",
        title: "Ciudad",
        sorter: true,
        render: (value) => _.find(cities, ({ id }) => value === id)?.name || '',
        width: "110px",
    },
    {
        dataIndex: "status",
        key: "status",
        title: "Estado",
        sorter: true,
        width: "80px",
    },
    {
        dataIndex: "meta_day",
        key: "meta_day",
        title: "Fecha",
        sorter: true,
        width: "100px",
        render: (value) => value ? moment(value).format("YYYY-MM-DD") : '',
    },
    {
        dataIndex: "meta_start_hour",
        key: "meta_start_hour",
        title: "Hora",
        sorter: true,
        width: "70px",
        render: (value, record) => `${moment(value, "HH:mm:ss").format("h:mm a") || ""}`,
    },
    {
        dataIndex: "createdAt",
        key: "createdAt",
        title: "Creación",
        sorter: true,
        width: "100px",
        render: (value) => value ? moment(value).format("YYYY-MM-DD h:mm a") : '',
    },
    {
        dataIndex: "meta_percentage",
        key: "meta_percentage",
        title: "%",
        sorter: true,
        width: "50px",
        render: (value) => `${parseInt(value)}%`
    },
    {
        dataIndex: "persons",
        key: "persons",
        title: "Personas",
        sorter: true,
        width: "100px",
        render: (value) => `${value || ""}`
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        width: "90px",
        key: 'actions',
        render: (id, record) =>
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
            </>
    }
];

const Reservations = () => {

    const reservationService = getService('reservations');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [startHourFilter, setStartHourFilter] = useState();

    const [cities, loadingCities] = useCities();

    const onEdit = (record) => {
        setSelectedReservation(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await reservationService.remove(id)
            .then(() => {
                message.success("Reservación eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la reservación! ' + error?.message)
            )
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='reservations'
                filterDefaultValues={{
                    meta_start_hour: startHourFilter,
                    $sort: {
                        meta_day: -1
                    }
                }}
                searchField="q"
                searchText="Esta... o usuario..."
                search={true}
                searchById={true}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove, cities })}
                actions={{}}
                filters={
                    <>
                        <InputNumber
                            alwaysOn
                            source="establishment_branch_id"
                            name="establishment_branch_id"
                            label="Id sucursal"
                            placeholder="Id sucursal"
                            allowEmpty
                            style={{ width: '110px' }}
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
                        />
                        <SelectField
                            alwaysOn
                            source="status"
                            name="status"
                            label="Estado"
                            placeholder="Estado"
                            allowEmpty
                            choices={status}
                            size="medium"
                            style={{ width: '12rem' }}
                        />
                    </>
                }
                title={
                    <TimePicker
                        style={{ width: '8rem' }}
                        minuteStep={MINUTES_STEPS_FOR_DISCOUNTS}
                        secondStep={60}
                        format='HH:mm:ss'
                        placeholder="Hora inicio"
                        onChange={(value) => value ? setStartHourFilter(moment(value).format('HH:mm:00')) : setStartHourFilter()}
                    />
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={'Editar Reserva'}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedReservation();
                    }}
                >
                    <SimpleForm
                        source='reservations'
                        textAcceptButton={'Guardar'}
                        id={selectedReservation.id}
                        initialValues={selectedReservation}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setUpdateSource(!updateSource);
                            setSelectedReservation();
                        }}
                    >
                        <Select
                            flex={1}
                            name='status'
                            label="Estado"
                            size='large'
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
                            flex={1}
                            name='persons'
                            label="Comensales"
                            size='large'
                        />
                        <InputNumber
                            flex={1}
                            name='previous_persons_change_by_establishment'
                            label="Cambio de Numero de Personas x el Establecimiento"
                            size='large'
                        />
                        <InputNumber
                            flex={1}
                            name='reported_invoice_amount'
                            label="Valor total factura"
                            size='large'
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </SimpleForm>
                </Drawer>

            }
        </Layout.Content>
    );
}

export default Reservations;