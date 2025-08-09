import React, { useState } from 'react';
import _ from 'lodash';
import { Layout, message, Button, Tag, Image, Drawer, Select, Input, InputNumber } from 'antd';
import { Grid } from '../../components/com';
import { getService } from '../../services';
import { RoundedButton } from '../../components/com/grid/Styles';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { FileUploader, SimpleForm } from '../../components/com/form/';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';
import { useCities } from '../../hooks/useCities';

const HIDDEN = [
    {
        id: "true",
        name: "true",
    },
    {
        id: "false",
        name: "false",
    },
];

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
        dataIndex: "position",
        key: "position",
        title: "Posición",
        sorter: true,
    },
    {
        dataIndex: "campaign_id",
        key: "campaign_id",
        title: "Id campaña",
        sorter: true,
    },
    {
        dataIndex: "city_id",
        key: "city_id",
        title: "Ciudad",
        sorter: true,
        render: (value) => _.find(cities, ({id})=> id === value)?.name
    },
    {
        dataIndex: "hide",
        key: "hide",
        title: "¿Oculta?",
        sorter: true,
        render: (value) => value === 'true' ? <Tag color="green">True</Tag> : <Tag color="red">False</Tag>
    },
    {
        dataIndex: "apparta_web_status",
        key: "apparta_web_status",
        title: "Web status",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        dataIndex: "status_app",
        key: "status_app",
        title: "App status",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">True</Tag> : <Tag color="red">Inactive</Tag>
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

const Categories = () => {

    const categoriesService = getService('categories');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [cities, loadingCities] = useCities();


    const onEdit = (record) => {
        setSelectedCategory(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await categoriesService.remove(id)
            .then(() => {
                message.success("Categoria eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la Categoria! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (selectedCategory && selectedCategory.id) {
            await categoriesService.patch(selectedCategory.id, data)
                .then(() => {
                    message.success("Categoria actualizada!");
                    setSelectedCategory();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await categoriesService.create(data)
                .then(() => {
                    message.success("Categoria creada correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const handleUploadFinish = async (field, url, file, _id) => {
        categoriesService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedCategory({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='categories'
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    },
                    parent_id: 1,
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
                    title={`${selectedCategory ? 'Editar' : 'Crear'} Categoria`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCategory();
                    }}
                >
                    {
                        selectedCategory?.id && selectedCategory?.cover_path &&
                        <GalleryUploader
                            refresh={(e, response) => {
                                setSelectedCategory({ ...response });
                                setUpdateSource(!updateSource);
                            }}
                            size="large"
                            record={selectedCategory}
                            defaultImage={selectedCategory.cover_path}
                            source="cover_path"
                            withCropper={true}
                            setterVisibleCropper={() => { }}
                            reference="categories"
                            _id={selectedCategory.id}
                            path={`categories_cover_path/${+selectedCategory.id}/`}
                        />
                    }
                    {
                        selectedCategory?.id &&
                        <FileUploader
                            flex={1}
                            preview={false}
                            path={`categories_cover_path/${selectedCategory.id}/`}
                            name='cover_path'
                            source='cover_path'
                            style={{ borderRadius: '0.5rem' }}
                            onFinish={(url, file) =>
                                handleUploadFinish("cover_path", url, file, selectedCategory.id)
                            }
                        />
                    }
                    <SimpleForm
                        textAcceptButton={`${selectedCategory ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedCategory}
                        onSubmit={handleSubmit}
                        allowNull={true}
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
                        <InputNumber
                            flex={0.5}
                            name='position'
                            label='Posicion'
                            size='large'
                            validations={[{ required: true, message: 'Posicion es requerida' }]}
                        />
                        <Select
                            flex={0.5}
                            name='hide'
                            label="Oculta"
                            size='large'
                            validations={[{ required: true, message: 'Estado es requerido' }]}
                        >
                            {
                                _.map(HIDDEN, ({ id, name }, index) =>
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
                            name='campaign_id'
                            label='Id campaña'
                            size='large'
                        />
                         <Select
                            flex={0.5}
                            name='city_id'
                            label="Ciudad"
                            size='large'
                            allowClear
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
                        <Select
                            flex={0.5}
                            name='status_app'
                            label="App status"
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
                        <Select
                            flex={0.5}
                            name='apparta_web_status'
                            label="Web status"
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
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Categories;