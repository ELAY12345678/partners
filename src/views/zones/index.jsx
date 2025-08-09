import { Button, Drawer, Input, InputNumber, Layout, message, Select, Tag } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/';
import { RoundedButton } from '../../components/com/grid/Styles';
import { useCities } from '../../hooks/useCities';
import { getService } from '../../services';

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

const columns = ({ onEdit, onRemove, cities }) => [
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
        dataIndex: "city_id",
        key: "city_id",
        title: "Ciudad",
        render: (value) => _.find(cities, ({ id }) => value === id)?.name || ''
    },
    {
        dataIndex: "position",
        key: "position",
        title: "Posición",
        sorter: true,
    },
    {
        dataIndex: "lat",
        key: "lat",
        title: "Lat",
        sorter: true,
    },
    {
        dataIndex: "lng",
        key: "lng",
        title: "Lng",
        sorter: true,
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

const Zones = () => {

    const zonesService = getService('zones');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedZone, setSelectedZone] = useState();
    const [updateSource, setUpdateSource] = useState(false);

    const [cities] = useCities();


    const onEdit = (record) => {
        setSelectedZone(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await zonesService.remove(id)
            .then(() => {
                message.success("Zona eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la zona! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (selectedZone && selectedZone.id) {
            await zonesService.patch(selectedZone.id, data)
                .then(() => {
                    message.success("Zona actualizada!");
                    setSelectedZone();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await zonesService.create(data)
                .then(() => {
                    message.success("Zona creada correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='zones'
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove, cities })}
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
                    title={`${selectedZone ? 'Editar' : 'Crear'} Zona`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedZone();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedZone}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            flex={0.5}
                            name='id'
                            label='Id'
                            validations={[
                                {
                                    required: true,
                                    message: `Id es requerido`
                                }
                            ]}
                        />
                        <Input
                            flex={0.5}
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
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
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='position'
                            label='Posición'
                            validations={[
                                {
                                    required: true,
                                    message: `Posición es requerido`
                                }
                            ]}
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
                        <InputNumber
                            flex={0.5}
                            name='lat'
                            label="Latitud"
                        />
                        <InputNumber
                            flex={0.5}
                            name='lng'
                            label="Longitud"
                        />
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Zones;