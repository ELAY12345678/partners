import { Button, Collapse, Drawer, Form, Image, Input, InputNumber, Select, Space, message } from 'antd';
import _ from 'lodash';
import debounce from "lodash/debounce";
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../../components/asyncButton';
import { Grid } from '../../../components/com';
import { FileUploader, SimpleForm } from '../../../components/com/form/';
import GalleryUploader from '../../../components/com/gallery/GalleryUploader';
import { RoundedButton } from '../../../components/com/grid/Styles';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../../constants';

import { getService } from '../../../services';
import { useEstablishmentBranches } from '../hooks';
const { Panel } = Collapse;

const DAYS_OF_WEEK = [
    { day: 'Lunes', id: 0 },
    { day: 'Martes', id: 1 },
    { day: 'Miércoles', id: 2 },
    { day: 'Jueves', id: 3 },
    { day: 'Viernes', id: 4 },
    { day: 'Sábado', id: 5 },
    { day: 'Domingo', id: 6 },
    { day: 'Festivos', id: 7 },
];
const TYPE = [
    {
        id: 'button',
        name: 'Botón'
    },
    {
        id: '',
        name: 'Banner'
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

const columns = ({ onEdit, onRemove, establishmentBranches }) => [
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
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            />
    },
    {
        dataIndex: "name",
        key: "name",
        title: "Nombre",
        sorter: true,
    },
    {
        title: "Sucursal",
        dataIndex: "establishment_branch_id",
        key: "establishment_branch_id",
        render: (value) => _.find(establishmentBranches, ({ id }) => id === value)?.address || value
    },
    {
        dataIndex: "priority",
        key: "priority",
        title: "Prioridad",
        sorter: true,
    },
    {
        dataIndex: "link",
        key: "link",
        title: "Link",
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
        else
            return `/${slug}/${establishment_branch_id}/menu/`
    },
    index: ({ slug, establishment_branch_id }) => `/${slug}/${establishment_branch_id}/`,
};

const Places = ({ establishment_id, slug }) => {
    const [form] = Form.useForm();
    const idValue = Form.useWatch('id', form);
    const priorityValue = Form.useWatch('priority', form);
    const typeLink = Form.useWatch('type', form);

    const [linkConditions, setLinkConditions] = useState({});
    const [linkConditionsHasData, setLinkConditionsHasData] = useState(false);

    const handleChangeLinkConditions = (field) => {
        setLinkConditions({ ...linkConditions, ...field });
    }

    const [categoryOptions, setCategoryOptions] = useState([]);

    const establishmentsServices = getService('establishments-menu-items-categories');
    const handleChangeDayStatus = ({ valueChecked }) => {
        const newSchedule = _.map(availabilityScheduleByDay, (day) =>
          day.value === valueChecked
            ? {
                ...day,
                checked:
                //   day?.value === initialValues?.day_of_week ? true :
                   !day.checked,
              }
            : day,
        );
        setavailabilityScheduleByDay(newSchedule);
        const scheduleChecked = newSchedule.filter((item) => item.checked === true);
        form.setFieldsValue({
          day_of_week: scheduleChecked.length ? scheduleChecked : null,
        });
      };
    const getCategoriesDatas = (value) => {
        if (
            // value === '' && 
            !_.isEmpty(categoryOptions)
        ) {
            // setCategoryOptions([])
            return;
        }
        establishmentsServices.find({
            query: {
                // q: value,
                establishment_id,
                status: 'active',
                $limit: 10000,
                $select: ['id', 'name', 'status']
            }
        })
            .then(({ data }) => setCategoryOptions(data))
            .catch((err) => message.error(err));
    };
    const debounceGetCateriesDatas = debounce(getCategoriesDatas, 500, { maxWait: 800 });

    const [menuItemsOptions, setMenuItemsOptions] = useState([]);

    const menuItemsServices = getService('establishment-menu-items');

    const getmenuItemsDatas = (value) => {
        if (
            // value === '' && 
            !_.isEmpty(menuItemsOptions)
        ) {
            // setCategoryOptions([])
            return;
        }
        menuItemsServices.find({
            query: {
                // q: value,
                establishment_id,
                apparta_menu_status: 'active',
                $limit: 10000,
                // $select: ['id', 'name']
            }
        })
            .then(({ data }) => setMenuItemsOptions(data))
            .catch((err) => message.error(err));
    };
    const debounceGetMenuItemsDatas = debounce(getmenuItemsDatas, 500, { maxWait: 800 });

    const placesService = getService('menu-linktree-establishments-branchs');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState();
    const [updateSource, setUpdateSource] = useState(false);
    const [establishment_branch_id, setEstablishmentBranchId] = useState();

    const [establishmentBranches, loadingEstablishmentBranches] = useEstablishmentBranches({ establishment_id });

    const DAYSOFWEEK = _.map(DAYS_OF_WEEK, ({ day, id }) => ({
        value: Number(id || 0) + 1,
        label: day,
        checked: false,
    }));

    const [availabilityScheduleByDay, setavailabilityScheduleByDay] =
    useState(DAYSOFWEEK);
    
    const onEdit = (record) => {
        setSelectedPlace({
            ..._.mapValues(record, (value) => { if (value !== null) { return value; } })
        });
        setDrawerVisible(true);
    };

    useEffect(() => {
      if(selectedPlace){
        console.log('selectedPlace',selectedPlace)
        if (selectedPlace?.day_of_week) {
            const daysOfWeek = DAYSOFWEEK.map((dia: any) => ({
              ...dia,
              checked: !!JSON.parse(selectedPlace?.day_of_week).includes(
                dia?.value,
              ),
            }));
            setavailabilityScheduleByDay(daysOfWeek);
            form.setFieldsValue({
              days_of_week: daysOfWeek.length
                ? daysOfWeek.filter((item) => item.checked === true)
                : null,
            });
          }
      }
    }, [selectedPlace])
    

    const onRemove = async ({ id }) => {
        await placesService.remove(id)
            .then(() => {
                message.success("Link eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar el Link! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        delete data.link_generator;
        const { id,day_of_week, ...rest } = data;

        if (idValue) {
            await placesService.patch(idValue, { ...rest,day_of_week: day_of_week ? JSON.stringify(day_of_week.map((day) => day.value))  : null})
                .then(() => {
                    message.success("Link actualizado!");
                    setSelectedPlace();
                    setLinkConditions({});
                    form.resetFields();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await placesService.create({ ...rest })
                .then(() => {
                    message.success("Link creado correctamente!");
                    setSelectedPlace();
                    setLinkConditions({});
                    form.resetFields();
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

    useEffect(() => {
        if (_.some(linkConditions) && linkConditions?.link_type && linkConditions?.establishment_branch_id) {
            const link = LINK_GENERATOR[linkConditions.link_type]({ ...linkConditions, slug });
            form.setFieldsValue({
                link,
            });
            if (link === `/${slug}/${linkConditions?.establishment_branch_id}/menu/`) {
                form.setFieldsValue({
                    priority: -1,
                });
            }
            else {
                form.setFieldsValue({
                    priority: undefined,
                });
            }
            setLinkConditionsHasData(true);
        }
        else {
            form.setFieldsValue({
                link: undefined,
                priority: undefined,
            });
            setLinkConditionsHasData(false);
        }
    }, [linkConditions, slug, form]);



    useEffect(() => {
        getCategoriesDatas();
        getmenuItemsDatas();
    }, []);

    return (
        <>
            <Grid
                source='menu-linktree-establishments-branchs'
                filterDefaultValues={{
                    establishment_id,
                    establishment_branch_id,
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove, establishmentBranches })}
                actions={{}}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                setSelectedPlace();
                                form.resetFields();
                            }}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                title={
                    <SelectField
                        placeholder='Sucursal...'
                        loading={loadingEstablishmentBranches}
                        style={{
                            width: '20rem'
                        }}
                        allowClear
                        onSelect={(value) => setEstablishmentBranchId(value)}
                        onClear={(value) => setEstablishmentBranchId()}
                        choices={establishmentBranches}
                    />
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    width={520}
                    title={`${selectedPlace ? 'Editar' : 'Crear'} Link`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setSelectedPlace();
                        setLinkConditions({});
                        form.resetFields();
                        setDrawerVisible(false);
                        setavailabilityScheduleByDay(DAYSOFWEEK)
                    }}
                >
                    {
                        selectedPlace?.id && selectedPlace?.path_image &&
                        <GalleryUploader
                            refresh={(e, response) => {
                                setSelectedPlace({ ...response });
                                setUpdateSource(!updateSource);
                            }}
                            size="large"
                            record={selectedPlace}
                            defaultImage={selectedPlace.path_image}
                            source="path_image"
                            withCropper={true}
                            setterVisibleCropper={() => { }}
                            reference="places"
                            _id={selectedPlace.id}
                            path={`menu_link_tree_path_image/${+selectedPlace.id}/`}
                        />
                    }
                    {
                        selectedPlace?.id &&
                        <FileUploader
                            flex={1}
                            preview={false}
                            path={`menu_link_tree_path_image/${selectedPlace.id}/`}
                            name='path_image'
                            source='path_image'
                            style={{ borderRadius: '0.5rem' }}
                            onFinish={(url, file) =>
                                handleUploadFinish("path_image", url, file, selectedPlace.id)
                            }
                        />
                    }
                    <SimpleForm
                        form={form}
                        textAcceptButton={`${selectedPlace ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedPlace}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            type='hidden'
                            name='id'
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
                        <SelectField
                            flex={1}
                            name='type'
                            label="Tipo"
                            size='large'
                            choices={TYPE}
                        />
                        {
                            typeLink === 'button' && (
                                <Input
                                    flex={1}
                                    size='large'
                                    name='button_text'
                                    label='Texto del botón'
                                    validations={[
                                        {
                                            required: true,
                                            message: `Texto del botón es requerido`
                                        }
                                    ]}
                                />
                            )
                        }

                        {
                            !idValue &&
                            < Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishment_id}
                            />
                        }
                        <SelectField
                            flex={1}
                            name='establishment_branch_id'
                            label="Sucursal"
                            size='large'
                            initial={establishment_branch_id}
                            choices={establishmentBranches}
                        />
                        <InputNumber
                            flex={1}
                            name='priority'
                            label='Prioridad'
                            size='large'
                            disabled={priorityValue === -1}
                            validations={[{ required: true, message: 'Prioridad es requerida' }]}
                        />
                       
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

                        {
                            establishment_id && (
                                <FileUploader
                                    flex={1}
                                    preview={false}
                                    title='Subir archivo'
                                    path={`menu_link_tree_path_file/${establishment_id}/`}
                                    name='link'
                                    source='Link'
                                    style={{ borderRadius: '0.5rem' }}
                                    allowTypes={['image/jpg','image/gif','image/jpeg','image/png','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                                    onFinish={(url, file) => {
                                        form.setFieldsValue({
                                            link: `https://appartaapp.s3.amazonaws.com/${url}`,
                                        });
                                        // handleUploadFinish("link", url, file, selectedPlace.id)
                                    }
                                        
                                    }
                                />
                            )
                        }
                        
                        <div style={{ }}>
                        <Form.Item
                            name="day_of_week"
                            rules={[
                            {
                                required: false,
                            },
                            ]}
                            label="Días de la semana"
                            labelCol={{ style: {} }}
                        >
                            <div
                            style={{
                                display: 'flex',
                                gap: '5px',
                                marginTop: '2px',
                                flexWrap: 'wrap',
                            }}
                            >
                            {_.map(
                                availabilityScheduleByDay,
                                ({ value, label, checked }) => (
                                <Button
                                    type= {checked ?  'primary' : 'ghost' }
                                    style={{
                                    minWidth: '100px',
                                    color: checked ? 'white' : 'black',
                                    }}
                                    onClick={async () => {
                                        await handleChangeDayStatus({ valueChecked: value });
                                    }}
                                >
                                    {label}
                                </Button>
                                ),
                            )}
                            </div>
                        </Form.Item>
                        </div>
                        
                        <div flex={1} name='link_generator'>
                            <Collapse ghost  >
                                <Panel header="Generar link" key="1" >
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
                                            placeholder='Sucursal'
                                            name='establishment_branch_id'
                                            label="Sucursal"
                                            size='large'
                                            allowClear
                                            choices={establishmentBranches}
                                            onChange={(value) => handleChangeLinkConditions({ establishment_branch_id: value })}
                                        />
                                        {
                                            linkConditions?.link_type === LINK_TYPE[0].id && (
                                                <>
                                                    <SelectField
                                                        placeholder='Menu Categoria'
                                                        name='category'
                                                        label="Sucursal"
                                                        size='large'
                                                        allowClear
                                                        choices={categoryOptions}
                                                        // onSearch={debounceGetCateriesDatas}
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
                                                        choices={menuItemsOptions}
                                                        // onSearch={debounceGetMenuItemsDatas}
                                                        value={linkConditions?.menu_item_id}
                                                        onChange={(value) => handleChangeLinkConditions({ menu_item_id: value, category: undefined })}
                                                    />
                                                </>
                                            )
                                        }
                                    </Space>
                                </Panel>
                            </Collapse>
                        </div>
                    </SimpleForm>
                </Drawer>
            }
        </ >
    );
}

export default Places;