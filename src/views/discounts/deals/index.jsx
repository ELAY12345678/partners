import { useState } from "react";
import _ from "lodash";
import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";
import { message, Button, Image, Tag, Drawer, Select, Input, DatePicker, Layout, Row, Col, Typography, Divider } from 'antd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { Grid } from "../../../components/com";
import { RoundedButton } from "../../../components/com/grid/Styles";
import { getService } from "../../../services";
import AsyncButton from "../../../components/asyncButton";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from "../../../constants";
import { FileUploader, SimpleForm } from "../../../components/com/form/";
import GalleryUploader from "../../../components/com/gallery/GalleryUploader";
import { useSelector } from "react-redux";
import { Box } from "../../../components";
import iconDiscount from '../../../sources/icons/discount.svg';

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

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

const columns = ({ onRemove, onEdit, userRole }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "path_cover",
        render: (value) =>
            value && <Image
                width={100}
                height={50}
                alt="Campaign-Image"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 100,
                    height: 50,
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
        key: "name",
        sorter: true,
    },
    {
        title: "Fecha Inicio",
        dataIndex: "start_date_time",
        key: "start_date_time",
        sorter: true,
        render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
        title: "Fecha Fin",
        dataIndex: "end_date_time",
        key: "end_date_time",
        sorter: true,
        render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
        title: "Descripción",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
        title: "Visibilidad",
        dataIndex: "visibility",
        key: "visibility",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    userRole === USERS_ROLES.admin && {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions_id',
        render: (id, record) => {
            return (
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
            );
        },
    }
]

const Deals = () => {

    const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);


    const dealsService = getService('deals');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState();

    const onRemove = async ({ id }) => {
        await dealsService.remove(id)
            .then(() => {
                message.success("Promoción eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la promoción! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedDeal({
            ...record,
            start_date_time: moment(record.start_date_time),
            end_date_time: moment(record.end_date_time),
        })
        setDrawerVisible(true);
    };

    const handleUploadFinish = (field, url, file, _id) => {
        dealsService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedDeal({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        data.start_date_time = data.start_date_time ? moment(data.start_date_time).startOf('day').utc().format() : undefined;
        data.end_date_time = data.end_date_time ? moment(data.end_date_time).endOf('day').utc().format() : undefined;

        delete data.path_cover;

        if (selectedDeal && selectedDeal.id) {
            await dealsService.patch(selectedDeal.id, data)
                .then(() => {
                    message.success("Promoción actualizada!");
                    setDrawerVisible(false);
                    setSelectedDeal();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await dealsService.create(data)
                .then(() => {
                    message.success("Promoción creada!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row>
                <Row
                    align='middle'
                    style={{
                        color: "var(--purple)",
                    }}
                    gutter={[16, 16]}
                >
                    <Col>
                        <img src={iconDiscount} alt='icon' />
                    </Col>
                    <Col>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Ofertas
                        </Typography.Title>
                    </Col>
                </Row>
                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            </Row>
            {
                establishmentFilters.establishment_id ? (
                    <Grid
                        custom={true}
                        source="deals"
                        filterDefaultValues={{
                            establishment_id: establishmentFilters?.establishment_id,
                            $sort: {
                                id: 1
                            }
                        }}
                        searchField="name"
                        searchText="Nombre..."
                        search={true}
                        permitFetch={!!establishmentFilters?.establishment_id}
                        actions={{}}
                        updateSource={updateSource}
                        columns={_.filter(columns({ onRemove, onEdit, userRole }), (record) => typeof record === 'object')}
                        extra={
                            userRole === USERS_ROLES.admin &&
                            <>
                                <RoundedButton
                                    type="primary"
                                    icon={<AiOutlinePlus />}
                                    onClick={() => setDrawerVisible(true)}
                                >
                                    Agregar
                                </RoundedButton>
                            </>
                        }
                    />
                ) : (
                    <Box>
                        *Selecciona una dirección para ver los registros*
                    </Box>
                )
            }
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedDeal ? 'Editar' : 'Crear'} Banner`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedDeal();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedDeal}
                        onSubmit={handleSubmit}
                    >
                        {
                            !selectedDeal?.id &&
                            <Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishmentFilters?.establishment_id}
                            />
                        }
                        {
                            selectedDeal?.id && selectedDeal?.path_cover &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    setSelectedDeal({ ...response });
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                record={selectedDeal}
                                defaultImage={selectedDeal?.path_cover}
                                source="path_cover"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="deals"
                                _id={selectedDeal.id}
                                path={`deals_path_cover/${+selectedDeal?.id}`}
                            />
                        }
                        {
                            selectedDeal?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                path={`deals_path_cover/${selectedDeal.id}/`}
                                name='path_cover'
                                source='path_cover'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path_cover", url, file, selectedDeal.id)
                                }
                            />
                        }
                        <Input
                            flex={1}
                            size="large"
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <DatePicker
                            flex={0.5}
                            name='start_date_time'
                            label="Fecha inicio"
                            size='large'
                            locale={locale}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha es requerido',
                                },
                            ]}
                        />
                        <DatePicker
                            flex={0.5}
                            name='end_date_time'
                            label="Fecha fin"
                            size='large'
                            locale={locale}
                            validations={[
                                {
                                    required: true,
                                    message: 'Fecha es requerido',
                                },
                            ]}
                        />
                        <Select
                            flex={1}
                            name='visibility'
                            label="Visibilidad"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Visibilidad es requerida',
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
                            name='description'
                            label='Descripción'
                            autoSize
                            validations={[
                                {
                                    required: true,
                                    message: 'Descripción es requerida',
                                },
                            ]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Deals;