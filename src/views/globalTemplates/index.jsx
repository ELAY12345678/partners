import React, { useState } from 'react';
import { Button, Drawer, Input, Layout, message } from 'antd';
import { Grid } from '../../components/com';
import { RoundedButton } from '../../components/com/grid/Styles';
import { AiOutlineEdit, AiOutlinePlus, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { getService } from '../../services';
import { SimpleForm } from '../../components/com/form/';
import { useNavigate } from 'react-router-dom';

const columns = ({ onEdit, onRemove, navigate }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
        width: 120
    },
    {
        dataIndex: "name",
        key: "name",
        title: "Nombre",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        render: (id, record) =>
            <>
                <Button
                    type='text'
                    shape='circle'
                    icon={<AiOutlineEye />}
                    onClick={() => navigate(
                        '/dashboard/management/global-templates/details',
                        {
                            state: {
                                template_id: id,
                                template_name: record?.name,
                            }
                        })}
                />
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

const GlobalTemplates = () => {
    const navigate = useNavigate();
    const templateService = getService('discount-templates');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [updateSource, setUpdateSource] = useState(false);

    const onEdit = (record) => {
        setSelectedTemplate(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await templateService.remove(id)
            .then(() => {
                message.success("Platilla eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la Platilla! ' + error?.message)
            )
    };


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='discount-templates'
                filterDefaultValues={{
                    type: 'global',
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove, navigate })}
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
                    title={`${selectedTemplate ? 'Editar' : 'Crear'} Platilla`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedTemplate();
                    }}
                >
                    <SimpleForm
                        source='discount-templates'
                        textAcceptButton={`${selectedTemplate ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedTemplate}
                        id={selectedTemplate?.id}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setSelectedTemplate();
                            setUpdateSource(!updateSource);
                        }}
                    >
                        <Input
                            type='hidden'
                            name='type'
                            initial='global'
                        />
                        <Input
                            flex={1}
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
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default GlobalTemplates;