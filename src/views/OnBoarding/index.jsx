import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Input, Layout, message, Select, Tag } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from '../../components/com';
import { ColorField } from '../../components/com/fields';
import { SimpleForm } from '../../components/com/form/';
import { RoundedButton } from '../../components/com/grid/Styles';
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

const SHOW_SCREEN = [
    {
        id: "home",
        name: "Home",
    },
    {
        id: "home_apparta_pay",
        name: "Home apparta pay",
    },
]

const columns = ({ onEdit, onRemove, navigate }) => [
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
        dataIndex: "show_screen",
        key: "show_screen",
        title: "Show screen",
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
                <Button
                    type="text"
                    onClick={() => navigate(
                        '/dashboard/management/on-boarding/screens',
                        {
                            state: {
                                onboarding_process_id: id,
                                onboarding_name: `${record?.name}`,
                            }
                        })}
                    icon={<AiOutlineEye />}
                />
            </>
    }
];

const OnBoarding = () => {
    const navigate = useNavigate();

    const onBoardingService = getService('onboarding-processes');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedOnBoarding, setSelectedOnBoarding] = useState();

    const onEdit = (record) => {
        setSelectedOnBoarding(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await onBoardingService.remove(id)
            .then(() => {
                message.success("On boarding eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar! ' + error?.message)
            )
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='onboarding-processes'
                filterDefaultValues={{
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
                    title={`${selectedOnBoarding ? 'Editar' : 'Crear'} On boarding`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedOnBoarding();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={`${selectedOnBoarding ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedOnBoarding}
                        onSubmit={() => {
                            setUpdateSource(!updateSource);
                            setDrawerVisible(false);
                            setSelectedOnBoarding();
                        }}
                        source="onboarding-processes"
                        id={selectedOnBoarding?.id}
                    >

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
                        <Select
                            flex={1}
                            size='large'
                            name='show_screen'
                            label="Show Screen"
                            validations={[{ required: true, message: 'Show Screen es requerida' }]}
                        >
                            {
                                _.map(SHOW_SCREEN, ({ id, name }, index) =>
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
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[{ required: true, message: 'Estado es requerido' }]}
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
                        <Input
                            flex={1}
                            size='large'
                            name='description_last_button'
                            label='Texto ultimo botón'
                        />
                        <ColorField
                            flex={0.5}
                            name="background_color_image"
                            label="Color de fondo"
                            placeholder="background_color_image"
                            initial={selectedOnBoarding?.background_color_image || '#f7f7f7'}
                            presetColors={['#f7f7f7']}
                        />
                        <ColorField
                            flex={0.5}
                            name="background_color_button"
                            label="Color de botón"
                            placeholder="background_color_button"
                            initial={selectedOnBoarding?.background_color_button || '#35D172'}
                            presetColors={['#35D172']}
                        />
                        <ColorField
                            flex={0.5}
                            name="text_color_button"
                            label="Color de texto"
                            placeholder="text_color_button"
                            initial={selectedOnBoarding?.text_color_button || '#fff'}
                            presetColors={['#fff']}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default OnBoarding