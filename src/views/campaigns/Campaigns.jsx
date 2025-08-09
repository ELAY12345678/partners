import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES";
import { Button, DatePicker, Drawer, Image, Input, message, Row, Select, Tag } from 'antd';
import { Grid } from '../../components/com';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { IoStorefrontOutline,IoRestaurantOutline } from 'react-icons/io5';
import AsyncButton from '../../components/asyncButton';
import { RoundedButton } from '../../components/com/grid/Styles';
import { SimpleForm } from '../../components/com/form/';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';
import { FileUploader } from '../../components/com/form/';
import { getService } from '../../services';

import CampaignEstablishments from './CampaignEstablishments';
import CampaignMenuItems from './CampaignMenuItems';

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

const columns = ({ onRemove, onEdit, onWatch, onWatchMenuItems }) => [
    {
        title: "Id",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "path",
        render: (value) =>
            value && <Image
                size="large"
                alt="Campaign-Image"
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
        dataIndex: "date_start",
        sorter: true,
        title: "Fecha Inicio",
        render: (value) => moment(value).format("YYYY-MM-DD h:mm:ss a"),
    },
    {
        dataIndex: "date_end",
        sorter: true,
        title: "Fecha Fin",
        render: (value) => moment(value).format("YYYY-MM-DD h:mm:ss a"),
    },
    {
        title: "Descripción",
        dataIndex: "description",
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
                        onClick={() => onWatch({ id, name: record.name })}
                        icon={<IoStorefrontOutline />}
                    />
                     <Button
                        type="text"
                        onClick={() => onWatchMenuItems({ id, name: record.name })}
                        icon={<IoRestaurantOutline />}
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
                </Row>
            );
        },
    }
];


const Campaigns = () => {

    const campaignsService = getService('campaigns');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMenuItemsVisible, setModalMenuItemsVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState();

    const onRemove = async ({ id }) => {
        await campaignsService.remove(id)
            .then(() => {
                message.success("Campaña eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la campaña! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedCampaign({
            ...record,
            date_start: moment(record.date_start),
            date_end: moment(record.date_end),
        })
        setDrawerVisible(true);
    };

    const onWatch = (record) => {
        setSelectedCampaign(record);
        setModalVisible(true);
    };

    const onWatchMenuItems = (record) => {
        setSelectedCampaign(record);
        setModalMenuItemsVisible(true);
    };

    const handleUploadFinish = (field, url, file, _id) => {
        campaignsService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedCampaign({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        data.date_start = data.date_start ? moment(data.date_start).utc().format() : undefined;
        data.date_end = data.date_end ? moment(data.date_end).utc().format() : undefined;
        delete data.path;
        delete data.second_path;
        delete data.path_in_app;

        if (selectedCampaign && selectedCampaign.id) {
            await campaignsService.patch(selectedCampaign.id, data)
                .then(() => {
                    message.success("Campaña actualizada!");
                    setDrawerVisible(false);
                    setSelectedCampaign();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await campaignsService.create(data)
                .then(() => {
                    message.success("Campaña creada!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <>
            <Grid
                custom={true}
                source="campaigns"
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                searchField="name"
                searchText="Campañas..."
                search={true}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit, onWatch, onWatchMenuItems })}
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
                    title={`${selectedCampaign ? 'Editar' : 'Crear'} Banner`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedCampaign();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedCampaign}
                        onSubmit={handleSubmit}
                    >
                        {
                            selectedCampaign?.id && selectedCampaign?.path &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedCampaign({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedCampaign}
                                defaultImage={selectedCampaign?.path}
                                source="path"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="campaigns"
                                _id={selectedCampaign.id}
                                path={`campaigns_path/${+selectedCampaign?.id}`}
                            />
                        }
                        {
                            selectedCampaign?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Imagen Principal'
                                path={`campaigns_path/${selectedCampaign.id}/`}
                                name='path'
                                source='path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path", url, file, selectedCampaign.id)
                                }
                            />
                        }
                        {
                            selectedCampaign?.id && selectedCampaign?.second_path &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedCampaign({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedCampaign}
                                defaultImage={selectedCampaign?.second_path}
                                source="second_path"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="campaigns"
                                _id={selectedCampaign.id}
                                path={`campaigns_second_path/${+selectedCampaign?.id}`}
                            />
                        }
                        {
                            selectedCampaign?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Imagen Secundaria'
                                path={`campaigns_second_path/${selectedCampaign.id}/`}
                                name='second_path'
                                source='second_path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("second_path", url, file, selectedCampaign.id)
                                }
                            />
                        }
                        {
                            selectedCampaign?.id && selectedCampaign?.path_in_app &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedCampaign({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedCampaign}
                                defaultImage={selectedCampaign?.path_in_app}
                                source="path_in_app"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="campaigns"
                                _id={selectedCampaign.id}
                                path={`campaigns_path_in_app/${+selectedCampaign?.id}`}
                            />
                        }
                        {
                            selectedCampaign?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Imagen modal'
                                path={`campaigns_path_in_app/${selectedCampaign.id}/`}
                                name='path_in_app'
                                source='path_in_app'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path_in_app", url, file, selectedCampaign.id)
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
                        <DatePicker
                            flex={1}
                            size="large"
                            name='date_start'
                            label='Fecha Inicio'
                            locale={locale}
                            format='YYYY-MM-DD h:mm:ss'
                            showTime
                            secondStep={60}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha Inicio es requerida',
                                },
                            ]}
                        />

                        <DatePicker
                            flex={1}
                            size="large"
                            name='date_end'
                            label='Fecha Fin'
                            locale={locale}
                            format='YYYY-MM-DD h:mm:ss'
                            showTime
                            secondStep={60}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha Fin es requerida',
                                },
                            ]}
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
                        <Select
                            flex={1}
                            name='show_in_app'
                            label="Mostrar modal"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(['true','false'], (it, index) =>
                                    <Select.Option
                                        key={index}
                                        value={it}
                                    >
                                        {it === 'true' ? 'si' : 'no' }
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Input.TextArea
                            flex={1}
                            size="large"
                            name='description'
                            label='Descripción'
                            autoSize
                        />
                    </SimpleForm>
                </Drawer>
            }
            {
                modalVisible &&
                <CampaignEstablishments
                    modalVisible={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedCampaign();
                    }}
                    selectedCampaign={selectedCampaign}
                />
            }
            {
                modalMenuItemsVisible &&
                <CampaignMenuItems
                    modalVisible={modalMenuItemsVisible}
                    onCancel={() => {
                        setModalMenuItemsVisible(false);
                        setSelectedCampaign();
                    }}
                    selectedCampaign={selectedCampaign}
                />
            }
        </>
    );
}

export default Campaigns;