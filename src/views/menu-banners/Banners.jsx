import React, { useState } from 'react';
import _ from 'lodash';
import { Image, Button, message, Row, Tag, Drawer, Input, Select, InputNumber, Form } from 'antd';
import { Grid } from "../../components/com";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { RoundedButton } from '../../components/com/grid/Styles';
import { getService } from '../../services';
import { SimpleForm } from '../../components/com/form/SimpleForm';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';
import { FileUploader } from '../../components/com/form/';
import BannersEstablishments from './BannersEstablishments';


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

const TYPE = [
    {
        id: "specific",
        name: "Especifico",
    },
    {
        id: "general",
        name: "General",
    },
];

const ACTION_TYPES = [
    {
        id: "go_to_screen",
        name: "Ir a pantalla",
    },
    {
        id: "external_link",
        name: "Link externo",
    },
    {
        id: "open_modal",
        name: "Modal",
    },
];

const ACTION_SCREENS = [
    {
        id: "product",
        name: "Producto",
    },
    {
        id: "establishment_profile",
        name: "Perfil de restaurante",
    },
];

const LOCATION_SCREEN = [
    {
        id: "gift",
        name: "Gift",
    },
    {
        id: "button",
        name: "Bottom",
    },
    {
        id: "top",
        name: "Top",
    },
    {
        id: "modal",
        name: "Modal",
    },
];

const columns = ({ onRemove, onEdit, onWatch }) => [
    {
        title: "Id",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "path_image",
        render: (value) =>
            value && <Image
                size="large"
                alt="Banner"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 90,
                    height: 35,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value}`
                }}
            />
    },
    {
        title: "Nombre",
        dataIndex: "name",
        sorter: true,
    },
    {
        title: "Tipo",
        dataIndex: "type",
        sorter: true,
        render: (value) => _.find(TYPE, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Tipo de acción",
        dataIndex: "action_type",
        sorter: true,
        render: (value) => _.find(ACTION_TYPES, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Acción pantalla",
        dataIndex: "action_screen",
        sorter: true,
        render: (value) => _.find(ACTION_SCREENS, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Acción pantalla Id",
        dataIndex: "action_screen_id",
        sorter: true,
    },
    {
        title: "Ubicación",
        dataIndex: "location_screen",
        sorter: true,
        render: (value) => _.find(LOCATION_SCREEN, ({ id }) => id === value)?.name || ""
    },
    {
        title: "Estado",
        dataIndex: "status",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <Row>
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
                    {
                        record.type === TYPE[0].id &&
                        <Button
                            type="text"
                            onClick={() => onWatch({ id, name: record?.name })}
                            icon={<AiOutlineEye />}
                        />
                    }
                </Row>
            );
        },
    }
];

const Banners = ({ getBanners }) => {

    const [form] = Form.useForm();
    const selectedBannerId = Form.useWatch('id', form);
    const selectedType = Form.useWatch('action_type', form);

    const bannersService = getService('menu-banners');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const onRemove = async ({ id }) => {
        await bannersService.remove(id)
            .then(() => {
                message.success("Banner eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el banner! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedBanner({
            ..._.mapValues(record, (value) => { if (value !== null) { return value; } })
        });
        setDrawerVisible(true);
    };

    const onWatch = (record) => {
        setSelectedBanner(record);
        setModalVisible(true);
    };

    const handleUploadFinish = (field, url, file, _id) => {
        bannersService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedBanner({
                    ...response
                });
                form.setFieldsValue(
                    {
                        ..._.mapValues(response, (value) => { if (value !== null) { return value; } })
                    }
                );
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);
        delete data.path_image;

        const { id, ...rest } = data;

        if (selectedBannerId) {
            await bannersService.patch(selectedBannerId, {...rest})
                .then(() => {
                    message.success("Banner actualizado!");
                    setDrawerVisible(false);
                    setSelectedBanner();
                    form.resetFields();
                    setUpdateSource(!updateSource);
                    getBanners();
                })
                .catch(err => message.error(err.message));
        } else {
            await bannersService.create({...rest})
                .then(() => {
                    message.success("Banner Creado!");
                    setDrawerVisible(false);
                    setSelectedBanner();
                    form.resetFields();
                    setUpdateSource(!updateSource);
                    getBanners();
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                custom={true}
                source="menu-banners"
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                searchField="name"
                searchText="Banners..."
                search={true}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit, onWatch })}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedBanner();
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
                    title={`${selectedBannerId ? 'Editar' : 'Crear'} Banner`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedBanner();
                    }}
                >
                    <SimpleForm
                        form={form}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                        initialValues={selectedBanner}
                    >
                        <Input
                            type='hidden'
                            name='id'
                        />
                        {
                            selectedBannerId && selectedBanner?.path_image &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedBanner({ ...response });
                                    form.setFieldsValue(
                                        {
                                            ..._.mapValues(response, (value) => { if (value !== null) { return value; } })
                                        }
                                    );
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedBanner}
                                source="path_image"
                                defaultImage={selectedBanner.path_image}
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="banners"
                                _id={selectedBannerId}
                                path={`apparta-menu/modals/`}
                            />
                        }
                        {
                            selectedBannerId &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                path={`apparta-menu/modals/`}
                                name='path_image'
                                source='path_image'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path_image", url, file, selectedBannerId)
                                }
                            />
                        }
                        <Input
                            flex={1}
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
                        <Select
                            flex={1}
                            name='action_type'
                            label="Tipo de acción"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Tipo de acción" es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(ACTION_TYPES, ({ id, name }, index) =>
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
                            selectedType === ACTION_TYPES[0].id &&
                            <Select
                                flex={1}
                                name='action_screen'
                                label="Acción Pantalla"
                                size='large'
                                validations={[
                                    {
                                        required: true,
                                        message: `Acción es requerida`
                                    }
                                ]}
                            >
                                {
                                    _.map(ACTION_SCREENS, ({ id, name }, index) =>
                                        <Select.Option
                                            key={index}
                                            value={id}
                                        >
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        }
                        {
                            selectedType === ACTION_TYPES[0].id &&
                            <InputNumber
                                flex={1}
                                name='action_screen_id'
                                label='Acción pantalla id'
                                size='large'
                                validations={[
                                    {
                                        required: true,
                                        message: `Id requerido`
                                    }
                                ]}
                            />
                        }
                        <Input
                            flex={1}
                            name='external_link'
                            size="large"
                            label='Link externo'
                            validations={[
                                {
                                    required: true,
                                    message: `Link es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={0.5}
                            name='type'
                            label="Tipo"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Tipo es requerido`
                                }
                            ]}
                        >
                            {
                                _.map(TYPE, ({ id, name }, index) =>
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
                            flex={0.5}
                            name='location_screen'
                            label="Ubicación"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Ubicación es requerida`
                                }
                            ]}
                        >
                            {
                                _.map(LOCATION_SCREEN, ({ id, name }, index) =>
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
                            validations={[
                                {
                                    required: true,
                                    message: `Estado es requerido`
                                }
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
            {
                modalVisible &&
                <BannersEstablishments
                    modalVisible={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedBanner();
                    }}
                    selectedBannerProgramming={selectedBanner}
                />
            }
        </>
    );
}

export default Banners;