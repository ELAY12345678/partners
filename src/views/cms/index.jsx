import React, { useState } from 'react';
import { Button, Drawer, Input, Layout, message, Select, Tag } from 'antd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { RoundedButton } from '../../components/com/grid/Styles';
import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/';
import _ from 'lodash';
import { getService } from '../../services';
import AsyncButton from '../../components/asyncButton';

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
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
        width: 150,
    },
    {
        dataIndex: 'title',
        key: 'title',
        title: 'Titulo',
        sorter: true,
    },
    {
        dataIndex: "status",
        key: "status",
        title: "Estado",
        sorter: true,
        width: 200,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        width: 100,
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

const Cms = () => {

    const cmsService = getService('cms');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedCms, setSelectedCms] = useState();

    const onEdit = (record) => {
        setSelectedCms(record);
        setDrawerVisible(true);
    }

    const onRemove = async ({ id }) => {
        await cmsService.remove(id)
            .then(() => {
                message.success("Cms eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el cms! ' + error?.message)
            )
    }

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        if (selectedCms && selectedCms.id) {
            await cmsService.patch(selectedCms.id, data)
                .then(() => {
                    message.success("Cms actualizado!");
                    setDrawerVisible(false);
                    setSelectedCms();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await cmsService.create(data)
                .then(() => {
                    message.success("Cms creado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source="cms"
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                updateSource={updateSource}
                actions={{}}
                columns={columns({ onEdit, onRemove })}
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
                    title={`${selectedCms ? 'Editar' : 'Crear'} Cms`}
                    placement="right"
                    size='large'
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCms();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedCms}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            flex={1}
                            name='title'
                            label='Titulo'
                            validations={[
                                {
                                    required: true,
                                    message: `Titulo es requerido`
                                }
                            ]}
                        />
                        <Input.TextArea
                            flex={1}
                            name='body'
                            label="Descripción"
                            autoSize
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
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Cms;