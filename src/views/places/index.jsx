import React, { useState } from 'react';
import _ from 'lodash';
import { Layout, message, Button, Tag, Image, Drawer, Select, Input, InputNumber } from 'antd';
import { Grid } from '../../components/com';
import { useCities } from '../../hooks/useCities';
import { getService } from '../../services';
import { RoundedButton } from '../../components/com/grid/Styles';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { FileUploader, SimpleForm } from '../../components/com/form/';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';

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
        dataIndex: "cover_path",
        key: "cover_path",
        title: "Foto",
        render: (value) =>
            value && <Image
                width={50}
                height={50}
                alt="cover_path"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 64,
                    height: 64,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value}`
                }}
                style={{
                    borderRadius: '50%',
                }}
                fallback="data:image/png;base64,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"
            />
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

const Places = () => {

    const placesService = getService('places');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState();
    const [updateSource, setUpdateSource] = useState(false);

    const [cities] = useCities();

    const onEdit = (record) => {
        setSelectedPlace(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await placesService.remove(id)
            .then(() => {
                message.success("Zona eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el lugar! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (selectedPlace && selectedPlace.id) {
            await placesService.patch(selectedPlace.id, data)
                .then(() => {
                    message.success("Lugar actualizado!");
                    setSelectedPlace();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await placesService.create(data)
                .then(() => {
                    message.success("Lugar creado correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const handleUploadFinish = async (field, url, file, _id) => {
        placesService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedPlace({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='places'
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
                    title={`${selectedPlace ? 'Editar' : 'Crear'} Lugar`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedPlace();
                    }}
                >
                    {
                        selectedPlace?.id && selectedPlace?.cover_path &&
                        <GalleryUploader
                            refresh={(e, response) => {
                                setSelectedPlace({ ...response });
                                setUpdateSource(!updateSource);
                            }}
                            size="large"
                            record={selectedPlace}
                            defaultImage={selectedPlace.cover_path}
                            source="cover_path"
                            withCropper={true}
                            setterVisibleCropper={() => { }}
                            reference="places"
                            _id={selectedPlace.id}
                            path={`places_cover_path/${+selectedPlace.id}/`}
                        />
                    }
                    {
                        selectedPlace?.id &&
                        <FileUploader
                            flex={1}
                            preview={false}
                            path={`places_cover_path/${selectedPlace.id}/`}
                            name='cover_path'
                            source='cover_path'
                            style={{ borderRadius: '0.5rem' }}
                            onFinish={(url, file) =>
                                handleUploadFinish("cover_path", url, file, selectedPlace.id)
                            }
                        />
                    }
                    <SimpleForm
                        textAcceptButton={`${selectedPlace ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedPlace}
                        onSubmit={handleSubmit}
                    // source="banners"
                    // id={selectedBanner.id}
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
                            name='city_id'
                            label="Ciudad"
                            validations={[{ required: true, message: 'Ciudad es requerida' }]}
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
                            name='lat'
                            label='Latitud'
                            size='large'
                        // validations={[{ required: true, message: 'Latitud es requerida' }]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='lng'
                            label='Longitud'
                            size='large'
                        // validations={[{ required: true, message: 'Longitud es requerida' }]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='position'
                            label='Posicion'
                            size='large'
                        />
                        <Select
                            flex={0.5}
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
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Places;