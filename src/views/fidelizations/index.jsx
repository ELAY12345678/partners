import React, { useState } from 'react';
import { Layout, Drawer, InputNumber, Select, Button, message } from 'antd';
import { Grid } from '../../components/com';
import { getService } from '../../services';
import { SimpleForm } from '../../components/com/form/';
import { RoundedButton } from '../../components/com/grid/Styles';

import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import _ from 'lodash';

const TYPES = [
    { id: 'administration', name: 'administration' },
    { id: 'reservation_claimed', name: 'reservation_claimed' },
    { id: 'pay_payment', name: 'pay_payment' },
    { id: 'review_created', name: 'review_created' },
    { id: 'reservation_not_claimed', name: 'reservation_not_claimed' },
    { id: 'converted_to_appartaWallet', name: 'converted_to_appartaWallet' }
];

const columns = ({ onEdit, onRemove }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
    },
    {
        dataIndex: "user_id",
        key: "user_id",
        title: "User Id",
        sorter: true,
    },
    {
        dataIndex: "points_add",
        key: "points_add",
        title: "Points Add",
        sorter: true,
    },
    {
        dataIndex: "points_substract",
        key: "points_substract",
        title: "Points Subtract",
        sorter: true,
    },
    {
        dataIndex: "type",
        key: "type",
        title: "Tipo",
        sorter: true,
    },
    {
        dataIndex: "description",
        key: "description",
        title: "Descripción",
        sorter: true,
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

const Fidelizations = () => {

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedFidelizations, setSelectedFidelizations] = useState();
    const [updateSource, setUpdateSource] = useState(false);


    const onEdit = (record) => {
        setSelectedFidelizations(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        const fidelizationService = getService('fidelizations');

        await fidelizationService.remove(id)
            .then(() => {
                message.success("Finalización eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la finalización! ' + error?.message)
            )
    };



    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='fidelizations'
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
                    title={`${selectedFidelizations ? 'Editar' : 'Crear'} puntos`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedFidelizations();
                    }}
                >
                    <SimpleForm
                        source='fidelizations'
                        id={selectedFidelizations?.id}
                        textAcceptButton={`${selectedFidelizations ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedFidelizations}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setSelectedFidelizations();
                            setUpdateSource(!updateSource);
                        }}
                    >
                        <InputNumber
                            flex={1}
                            size="large"
                            name='user_id'
                            label='User Id'
                            validations={[
                                {
                                    required: true,
                                    message: ` User Id es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={1}
                            name='type'
                            label="Tipo"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Tipo es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(TYPES, ({ id, name }, index) =>
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
                            name='points_add'
                            label='Points Add'
                        />
                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='points_substract'
                            label='Points Subtract'
                        />
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Fidelizations;