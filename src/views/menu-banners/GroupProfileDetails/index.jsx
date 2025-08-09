import { useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Collapse, Divider, Drawer, Form, Image, Input, InputNumber, Layout, message, Select, Space, Tag } from "antd";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../../components/asyncButton";
import { Grid } from "../../../components/com";
import { FileUploader } from "../../../components/com/form/";
import { SimpleForm } from "../../../components/com/form/";
import GalleryUploader from "../../../components/com/gallery/GalleryUploader";
import { RoundedButton } from "../../../components/com/grid/Styles";
import { getService } from "../../../services";
import _ from "lodash";
import { useEstablishment, useEstablishmentBranches, useCategories, useMenuItems } from "./hooks";
import { useEffect } from "react";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from "../../../constants";

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

const LINK_TYPE = [
    {
        id: 'menu',
        address: 'Ir a menu'
    },
    {
        id: 'index',
        address: 'Ir a index'
    },
];

const LINK_GENERATOR = {
    menu: ({ slug, establishment_branch_id, category, menu_item_id }) => {
        if (menu_item_id)
            return `/${slug}/${establishment_branch_id}/menu/?pId=${menu_item_id}`
        else if (category)
            return `/${slug}/${establishment_branch_id}/menu/?scrollTop=${_.replace(
                _.trim(_.toLower(category)),
                / /g,
                '-'
            )
                }`
        else if (establishment_branch_id)
            return `/${slug}/${establishment_branch_id}/menu/`
        else
            return `/${slug}/`

    },
    index: ({ slug, establishment_branch_id }) => `/${slug}/${establishment_branch_id ? establishment_branch_id + '/' : ''}`,
};

const columns = ({ onRemove, onEdit, onWatch }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        dataIndex: "path_image",
        key: "path_image",
        title: "Foto",
        render: (value) =>
            value && <Image
                size="large"
                alt="Banner"
                height={35}
                width={90}
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 90,
                    height: 35,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value}`
                }}
                fallback="data:image/png;base64,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"
            />
    },
    {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: true,
    },
    {
        title: "Link",
        dataIndex: "link",
        key: "link",
    },
    {
        title: "Prioridad",
        dataIndex: "priority",
        key: "priority",
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
                    {/* <Button
                        type="text"
                        onClick={() => navigate(
                            '/dashboard/management/menu-banners/details',
                            {
                                state: {
                                    menu_link_tree_group_id: id,
                                    menu_link_tree_group_name: record?.name
                                }
                            })}
                        icon={<AiOutlineEye />}
                    /> */}
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

const SelectField = ({ choices, valueField, ...rest }) => {
    return (
        <Select
            {...rest}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                _.map(choices, (record, index) =>
                    <Select.Option
                        key={index}
                        value={valueField ? record[valueField] : record.id}
                    >
                        {record.address || record.name}
                    </Select.Option>
                )
            }
        </Select>
    );
};

const GroupProfileDetails = ({ location }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedId = Form.useWatch('id', form);

    const { menu_link_tree_group_id, menu_link_tree_group_name } = location.state;

    const menuGroupLinksService = getService("menu-linktree-groups-links");

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedLink, setSelectedLink] = useState();

    const [linkConditionsHasData, setLinkConditionsHasData] = useState(false);
    const [linkConditions, setLinkConditions] = useState({});


    const onRemove = async ({ id }) => {
        await menuGroupLinksService.remove(id)
            .then(() => {
                message.success("Link eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Grupo! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedLink({
            ..._.mapValues(record, (value) => { if (value !== null) { return value; } })
        });
        
        setDrawerVisible(true);
    };

    const handleUploadFinish = (field, url, file, _id) => {
        menuGroupLinksService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedLink({
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
        delete data.link_generator;

        const { id, ...rest } = data;

        if (selectedId) {
            await menuGroupLinksService.patch(selectedId, { ...rest })
                .then(() => {
                    message.success("Link actualizada!");
                    setDrawerVisible(false);
                    setSelectedLink();
                    form.resetFields();
                    setLinkConditions({});
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await menuGroupLinksService.create({ ...rest })
                .then(() => {
                    message.success("Link creada!");
                    setDrawerVisible(false);
                    setSelectedLink();
                    form.resetFields();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const handleChangeLinkConditions = (field) => {
        if (field?.establishment_id)
            setLinkConditions({ link_type: linkConditions?.link_type, ...field });
        else
            setLinkConditions({ ...linkConditions, ...field });
    };

    const [establishments, loadingEstablishment, debounceGetEstablishmentsDatas] = useEstablishment();
    const [establishmentBranches, loadingEstablishmentBranches] = useEstablishmentBranches({ establishment_id: linkConditions.establishment_id });
    const [categoryOptions, loadingCategories] = useCategories({ establishment_id: linkConditions.establishment_id });
    const [menuItemsOptions, loadingMenuItems] = useMenuItems({ establishment_id: linkConditions.establishment_id });


    useEffect(() => {
        if (_.some(linkConditions) && linkConditions?.slug && linkConditions?.link_type) {
            const link = LINK_GENERATOR[linkConditions.link_type]({ ...linkConditions, slug: linkConditions.slug });
            form.setFieldsValue({
                link,
            });
            setLinkConditionsHasData(true);
        }
        else {
            form.setFieldsValue({
                link: undefined,
            });
            setLinkConditionsHasData(false);
        }
    }, [linkConditions, form]);

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Breadcrumb>
                <Breadcrumb.Item
                    onClick={() => navigate('/dashboard/management/menu-banners',
                        {
                            state: {
                                defaultSelectedTab: '3'
                            }
                        }
                    )}
                    style={{ cursor: 'pointer' }}
                >
                    Perfil de grupos
                </Breadcrumb.Item>
                <Breadcrumb.Item>{menu_link_tree_group_name || ""}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Grid
                custom={true}
                source="menu-linktree-groups-links"
                filterDefaultValues={{
                    menu_link_tree_group_id,
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
                columns={columns({ onRemove, onEdit })}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedLink(undefined);
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
                    width={520}
                    title={`${selectedLink ? 'Editar' : 'Crear'} Link`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedLink();
                        form.resetFields();
                        setLinkConditions({});
                    }}
                >
                    <SimpleForm
                        form={form}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                        initialValues={selectedLink}
                    >
                        <Input
                            type='hidden'
                            name='id'
                        />
                        {
                            !selectedId &&
                            <Input
                                type="hidden"
                                name='menu_link_tree_group_id'
                                initial={menu_link_tree_group_id}
                            />
                        }
                        {
                            selectedId && selectedLink?.path_image &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedLink({ ...response });
                                    form.setFieldsValue(
                                        {
                                            ..._.mapValues(response, (value) => { if (value !== null) { return value; } })
                                        }
                                    );
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedLink}
                                defaultImage={selectedLink?.path_image}
                                source="path_image"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="menu-linktree-groups-links"
                                _id={selectedId}
                                path={`group_link_path_image/${selectedId}`}
                            />
                        }
                        {
                            selectedId &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                title='Imagen'
                                path={`group_link_path_image/${selectedId}/`}
                                name='path_image'
                                source='path_image'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path_image", url, file, selectedId)
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
                        <InputNumber
                            flex={1}
                            name='priority'
                            label='Prioridad'
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
                        <Input.TextArea
                            flex={1}
                            size='large'
                            name='link'
                            label='Link'
                            autoSize
                            disabled={linkConditionsHasData}
                            validations={[
                                {
                                    required: true,
                                    message: `Link es requerido`
                                }
                            ]}
                        />
                        <div flex={1} name='link_generator'>
                            <Collapse ghost  >
                                <Collapse.Panel header="Generar link" key="1" >
                                    <Space direction='vertical' style={{ width: '100%' }} size='middle' >
                                        <SelectField
                                            placeholder='Tipo de link'
                                            label="Tipo de link"
                                            name='link_type'
                                            size='large'
                                            allowClear
                                            choices={LINK_TYPE}
                                            onChange={(value) => handleChangeLinkConditions({ link_type: value })}
                                        />
                                        <SelectField
                                            placeholder='Establecimiento'
                                            name='establishment_id'
                                            label="Establecimiento"
                                            size='large'
                                            allowClear
                                            onSearch={debounceGetEstablishmentsDatas}
                                            loading={loadingEstablishment}
                                            choices={establishments}
                                            onChange={(value) => {
                                                if (value) {
                                                    const { id, slug } = JSON.parse(value)
                                                    handleChangeLinkConditions({ establishment_id: id, slug });
                                                }
                                                else
                                                    handleChangeLinkConditions({ establishment_id: undefined, slug: undefined });
                                            }}
                                        />
                                        {
                                            linkConditions?.establishment_id &&
                                            <SelectField
                                                placeholder='Sucursal'
                                                name='establishment_branch_id'
                                                label="Sucursal"
                                                size='large'
                                                allowClear
                                                loading={loadingEstablishmentBranches}
                                                choices={establishmentBranches}
                                                onChange={(value) => handleChangeLinkConditions({ establishment_branch_id: value })}
                                            />
                                        }
                                        {
                                            (linkConditions?.link_type === LINK_TYPE[0].id && linkConditions?.establishment_id) && (
                                                <>
                                                    <SelectField
                                                        placeholder='Menu Categoria'
                                                        name='category'
                                                        label="Sucursal"
                                                        size='large'
                                                        allowClear
                                                        choices={categoryOptions}
                                                        loading={loadingCategories}
                                                        value={linkConditions?.category}
                                                        onChange={(value) => handleChangeLinkConditions({ category: value, menu_item_id: undefined })}
                                                        valueField={'name'}
                                                    />
                                                    <SelectField
                                                        placeholder='Menu Item'
                                                        name='menu_item_id'
                                                        label="Sucursal"
                                                        size='large'
                                                        allowClear
                                                        loading={loadingMenuItems}
                                                        choices={menuItemsOptions}
                                                        value={linkConditions?.menu_item_id}
                                                        onChange={(value) => handleChangeLinkConditions({ menu_item_id: value, category: undefined })}
                                                    />
                                                </>
                                            )
                                        }
                                    </Space>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default GroupProfileDetails;