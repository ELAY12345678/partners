import { useNavigate } from "react-router-dom";
import { Button, Drawer, Input, message, Select, Tag } from "antd";
import _ from "lodash";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import { FileUploader, SimpleForm } from "../../components/com/form/";
import GalleryUploader from "../../components/com/gallery/GalleryUploader";
import { RoundedButton } from "../../components/com/grid/Styles";
import { getService } from "../../services";

const STATUS = [
    {
        id: "active",
        name: "Activo",
    },
    {
        id: "inactive",
        name: "Inactivo",
    },
];

const columns = ({ onRemove, onEdit, onWatch }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: true,
    },
    {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
        sorter: true,
    },
    {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        sorter: true,
        render: (value) => <Tag color={value === "active" ? "success" : "error"}> {value}</Tag>
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <>
                    <Button
                        type="text"
                        onClick={() => navigate(
                            '/dashboard/management/menu-banners/profile-group-details',
                            {
                                state: {
                                    menu_link_tree_group_id: id,
                                    menu_link_tree_group_name: record?.name
                                }
                            })}
                        icon={<AiOutlineEye />}
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
            );
        },
    }
];

const GroupProfile = () => {
    const navigate = useNavigate();
    const menuGroupService = getService("menu-linktree-groups");


    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();

    const onRemove = async ({ id }) => {
        await menuGroupService.remove(id)
            .then(() => {
                message.success("Grupo eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Grupo! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedGroup(record);
        setDrawerVisible(true);
    };

    const onWatch = (record) => {
        setSelectedGroup(record);
        // setModalVisible(true);
    };

    const handleUploadFinish = (field, url, file, _id) => {
        menuGroupService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedGroup({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        delete data.cover_path;
        delete data.background_path;
        delete data.logo_path;

        if (selectedGroup && selectedGroup.id) {
            await menuGroupService.patch(selectedGroup.id, data)
                .then(() => {
                    message.success("Grupo actualizada!");
                    setDrawerVisible(false);
                    setSelectedGroup();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await menuGroupService.create(data)
                .then(() => {
                    message.success("Grupo creada!");
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
                source="menu-linktree-groups"
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                searchField="name"
                searchText="Grupo..."
                search={true}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit, onWatch })}
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
                    title={`${selectedGroup ? 'Editar' : 'Crear'} Banner`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedGroup();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedGroup}
                        onSubmit={handleSubmit}
                    >
                        {
                            selectedGroup?.id && selectedGroup?.logo_path &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedGroup({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedGroup}
                                defaultImage={selectedGroup?.logo_path}
                                source="logo_path"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="menu-linktree-groups"
                                _id={selectedGroup.id}
                                path={`group_logo_path/${+selectedGroup?.id}`}
                            />
                        }
                        {
                            selectedGroup?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Logo'
                                path={`group_logo_path/${selectedGroup.id}/`}
                                name='logo_path'
                                source='logo_path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("logo_path", url, file, selectedGroup.id)
                                }
                            />
                        }
                        {
                            selectedGroup?.id && selectedGroup?.background_path &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedGroup({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedGroup}
                                defaultImage={selectedGroup?.background_path}
                                source="background_path"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="menu-linktree-groups"
                                _id={selectedGroup.id}
                                path={`group_background_path/${+selectedGroup?.id}`}
                            />
                        }
                        {
                            selectedGroup?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Fondo'
                                path={`group_background_path/${selectedGroup.id}/`}
                                name='background_path'
                                source='background_path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("background_path", url, file, selectedGroup.id)
                                }
                            />
                        }
                        {
                            selectedGroup?.id && selectedGroup?.cover_path &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedGroup({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedGroup}
                                defaultImage={selectedGroup?.cover_path}
                                source="cover_path"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="menu-linktree-groups"
                                _id={selectedGroup.id}
                                path={`group_cover_path/${+selectedGroup?.id}`}
                            />
                        }
                        {
                            selectedGroup?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Portada'
                                path={`group_cover_path/${selectedGroup.id}/`}
                                name='cover_path'
                                source='cover_path'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("cover_path", url, file, selectedGroup.id)
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
                        <Input.TextArea
                            flex={1}
                            name='description'
                            label='Descripción'
                            autoSize
                            validations={[
                                {
                                    required: true,
                                    message: `Descripción es requerido`
                                }
                            ]}
                        />
                        <Input
                            flex={1}
                            name='sn_facebook'
                            label='FaceBook'
                            size="large"
                        />
                        <Input
                            flex={1}
                            name='sn_instagram'
                            label='Instagram'
                            size="large"
                        />
                        <Input
                            flex={1}
                            name='sn_tiktok'
                            label='Tik Tok'
                            size="large"
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
        </>
    );
}

export default GroupProfile;