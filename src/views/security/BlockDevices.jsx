import { useState } from "react";
import { Grid } from "../../components/com";
import { RoundedButton } from "../../components/com/grid/Styles";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { Button, DatePicker, Drawer, Input, message, Select, Tag } from "antd";
import { SimpleForm } from "../../components/com/form/";
import AsyncButton from "../../components/asyncButton";
import { getService } from "../../services";
import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";
import _ from "lodash";

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

const columns = ({ onEdit, onRemove }) => [
    {
        key: "id",
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: "device_id",
        dataIndex: "device_id",
        title: "Id dispositivo",
        sorter: true,
    },
    {
        key: "note",
        dataIndex: "note",
        title: "Nota",
    },
    {
        key: "block_users",
        dataIndex: "block_users",
        title: "Block users",
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color={value === 'inactive' ? 'red' : 'orange'}>{value}</Tag>

    },
    {
        key: "expire_date",
        dataIndex: "expire_date",
        title: "Fecha expiración",
        render: (value) => value && moment(value).format('YYYY-MMM-DD  h:mm:ss a'),
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

const BlockDevices = () => {

    const devicesBlockListService = getService('black-list-device-id');


    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);

    const onEdit = (record) => {
        setSelectedDevice({
            ...record,
            expire_date: record?.expire_date ? moment(record.expire_date) : undefined,
        });
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await devicesBlockListService.remove(id)
            .then(() => {
                message.success("Dispositivo eliminado de la lista!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el dispositivo! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        const { id, ...rest } = data;

        if (selectedDevice?.id) {
            await devicesBlockListService.patch(selectedDevice.id, { ...rest })
                .then(() => {
                    message.success("Id dispositivo actualizado!");
                    setDrawerVisible(false);
                    setSelectedDevice();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await devicesBlockListService.create({ ...rest })
                .then(() => {
                    message.success("Id dispositivo agregado correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                source="black-list-device-id"
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove })}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    },
                }}
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
                actions={{}}
                filters={
                    <>
                        <Input
                            source="device_id"
                            name="device_id"
                            label="device_id"
                            placeholder="device_id"
                            allowEmpty
                            size="medium"
                            style={{ width: '15rem' }}
                        />
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedDevice ? 'Editar' : 'Crear'}`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedDevice();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedDevice ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedDevice}
                        onSubmit={handleSubmit}
                        allowNull={true}
                    >
                        <Input
                            flex={1}
                            label="Id dispositivo"
                            size='large'
                            name="device_id"
                            validations={[
                                {
                                    required: true,
                                    message: `Id dispositivo es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={1}
                            name='block_users'
                            label="Block users"
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
                        <DatePicker
                            flex={1}
                            locale={locale}
                            showTime
                            name='expire_date'
                            label='Fecha expiración'
                            format='YYYY-MM-DD h:mm a'
                        />
                        <Input.TextArea
                            flex={1}
                            label="Nota"
                            size='large'
                            name="note"
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BlockDevices;