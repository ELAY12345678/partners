import React, { useState } from 'react';
import _ from 'lodash';
import { Image, Button, message, Row, Tag, Drawer, Input, Select, InputNumber, Col } from 'antd';
import { Grid } from "../../components/com";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { RoundedButton } from '../../components/com/grid/Styles';
import { getService } from '../../services';
import { SimpleForm } from '../../components/com/form/SimpleForm';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';
import { FileUploader } from '../../components/com/form/';

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

const ACTION_TYPES = [
    {
        id: "go_to_screen",
        name: "Ir a pantalla",
    },
    {
        id: "modal",
        name: "Modal",
    },
];

const ACTION_SCREENS = [
    {
        id: "restaurant",
        name: "Restaurante",
    },
    {
        id: "restaurants_with_nams",
        name: "Restaurante con ñams",
    },
    {
        id: "events",
        name: "Eventos",
    },
    {
        id: "event",
        name: "Evento",
    },
    {
        id: "category",
        name: "Categoria",
    },
    {
        id: "geo",
        name: "Mapa",
    },
    {
        id: "find",
        name: "Busqueda",
    },
    {
        id: "reservation",
        name: "Reservaciones",
    },
    {
        id: "account",
        name: "My Cuenta",
    },
    {
        id: "cms",
        name: "CMS",
    },
    {
        id: "deals",
        name: "Deals",
    },
    {
        id: "campaigns",
        name: "Campañas",
    },
];

const columns = ({ onRemove, onEdit }) => [
    {
        title: "Id",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "image_path",
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
                </Row>
            );
        },
    }
];

const Banners = ({ getBanners }) => {

    const bannersService = getService('banners');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState();
    const [updateSource, setUpdateSource] = useState(false);

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
        _.forEach(record, (value, key) => {
            if (value === null) {
                delete record[key]
            }
        })
        setSelectedBanner(record);
        setDrawerVisible(true);
    };

    const handleUploadFinish = async (field, url, file, _id) => {
        await bannersService
            .patch(_id, {
                [field]: String(url),
            })
            .then((response) => {

                setUpdateSource(!updateSource)
                setSelectedBanner({
                    ...response
                });

            })
            .catch((err) =>
                message.error(err.message)
            );
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        if (selectedBanner && selectedBanner.id) {
            await bannersService.patch(selectedBanner.id, data)
                .then(() => {
                    message.success("Banner actualizado!");
                    setDrawerVisible(false);
                    setSelectedBanner();
                    setUpdateSource(!updateSource);
                    getBanners();
                })
                .catch(err => message.error(err.message));
        } else {
            await bannersService.create(data)
                .then(() => {
                    message.success("Banner Creado!");
                    setDrawerVisible(false);
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
                source="banners"
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
                columns={columns({ onRemove, onEdit })}
                extra={
                    <div>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
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
                    title={`${selectedBanner ? 'Editar' : 'Crear'} Banner`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedBanner();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedBanner}
                        onSubmit={handleSubmit}
                    // source="banners"
                    // id={selectedBanner.id}
                    >
                        {
                            selectedBanner?.id && selectedBanner?.image_path ? (
                                <GalleryUploader
                                    // refresh={(e, response) => {
                                    //     setDataSource({ ...response });
                                    //     props.onSubmit(null, response);
                                    // }}
                                    defaultImage={selectedBanner?.image_path}
                                    size="large"
                                    record={selectedBanner}
                                    source="image_path"
                                    withCropper={true}
                                    setterVisibleCropper={() => { }}
                                    reference="banners"
                                    _id={selectedBanner.id}
                                    path={`banners_path/${+selectedBanner?.id}`}
                                />
                            ) : null
                        }
                        {
                            selectedBanner?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                path={`banners_path/${selectedBanner.id}/`}
                                name='banner_path'
                                source='banner_path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("image_path", url, file, selectedBanner.id)
                                }
                            />
                        }
                        <Input
                            flex={1}
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
                            name='action_screen'
                            label="Acción Pantalla"
                            size='large'
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
                        <Select
                            flex={0.5}
                            name='action_type'
                            label="Tipo"
                            size='large'
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
                        <InputNumber
                            flex={0.5}
                            name='action_screen_id'
                            label='Acción pantalla id'
                            size='large'
                        />
                        <Select
                            flex={0.5}
                            name='status'
                            label="Estado"
                            size='large'
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
                        <Input.TextArea
                            flex={1}
                            name='modal_html'
                            label='Acción HTML'
                            autoSize
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default Banners;