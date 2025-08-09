import { useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Divider, Drawer, Image, Input, InputNumber, Layout, message } from "antd";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import { FileUploader, SimpleForm } from "../../components/com/form/";
import GalleryUploader from "../../components/com/gallery/GalleryUploader";
import { RoundedButton } from "../../components/com/grid/Styles";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from "../../constants";
import { getService } from "../../services";

const columns = ({ onEdit, onRemove, navigate }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
        width: '100px'
    },
    {
        dataIndex: "path_image",
        key: "path_image",
        title: "Foto",
        width: '100px',
        render: (value) =>
            value && <Image
                width={50}
                height={50}
                alt="path_image"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 64,
                    height: 64,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value}`
                }}
                fallback="data:image/png;base64,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"
            />
    },
    {
        dataIndex: "title",
        key: "title",
        title: "Titulo",
        sorter: true,
    },
    {
        dataIndex: "position",
        key: "position",
        title: "Posición",
        sorter: true,
        width: '100px'
    },
    {
        dataIndex: "description",
        key: "description",
        title: "Descripción",
        sorter: true,
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

const OnBoardingScreens = ({ location }) => {
    const navigate = useNavigate();
    const { onboarding_process_id, onboarding_name } = location.state;

    const onBoardingScreenService = getService('onboarding-processes-screens');

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedOnBoardingScreen, setSelectedOnBoardingScreen] = useState();

    const onEdit = (record) => {
        setSelectedOnBoardingScreen(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await onBoardingScreenService.remove(id)
            .then(() => {
                message.success("On boarding screen eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        delete data.path_image;

        if (selectedOnBoardingScreen && selectedOnBoardingScreen.id) {
            await onBoardingScreenService.patch(selectedOnBoardingScreen.id, data)
                .then(() => {
                    message.success("On boarding screen actualizado!");
                    setSelectedOnBoardingScreen();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await onBoardingScreenService.create(data)
                .then(() => {
                    message.success("On boarding screen correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const handleUploadFinish = async (field, url, file, _id) => {
        onBoardingScreenService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setSelectedOnBoardingScreen({
                    ...response
                });
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Breadcrumb>
                <Breadcrumb.Item
                    onClick={() => navigate('/dashboard/management/on-boarding')}
                    style={{ cursor: 'pointer' }}
                >
                    On Boarding
                </Breadcrumb.Item>
                <Breadcrumb.Item>{onboarding_name || ""}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Grid
                custom={true}
                source="onboarding-processes-screens"
                filterDefaultValues={{
                    onboarding_process_id,
                    $sort: {
                        id: -1
                    }
                }}
                permitFetch={true}
                actions={{}}
                updateSource={updateSource}
                columns={columns({ onRemove, onEdit, navigate })}
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
                    title={`${selectedOnBoardingScreen ? 'Editar' : 'Crear'} On boarding screen`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedOnBoardingScreen();
                    }}
                >
                    {
                        selectedOnBoardingScreen?.id && selectedOnBoardingScreen?.path_image &&
                        <GalleryUploader
                            refresh={(e, response) => {
                                setSelectedOnBoardingScreen({ ...response });
                                setUpdateSource(!updateSource);
                            }}
                            size="large"
                            record={selectedOnBoardingScreen}
                            defaultImage={selectedOnBoardingScreen.path_image}
                            source="path_image"
                            withCropper={true}
                            setterVisibleCropper={() => { }}
                            reference="onboarding-processes-screens"
                            _id={selectedOnBoardingScreen?.id}
                            path={`on_boarding_screen_path_image/${+selectedOnBoardingScreen.id}/`}
                        />
                    }
                    <SimpleForm
                        textAcceptButton={`${selectedOnBoardingScreen ? 'Actualizar' : 'Crear'}`}
                        initialValues={selectedOnBoardingScreen}
                        onSubmit={handleSubmit}
                    >
                        {
                            selectedOnBoardingScreen?.id &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                path={`on_boarding_screen_path_image/${selectedOnBoardingScreen.id}/`}
                                name='path_image'
                                source='path_image'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("path_image", url, file, selectedOnBoardingScreen.id)
                                }
                            />
                        }
                        {
                            !selectedOnBoardingScreen?.id &&
                            <Input
                                name='onboarding_process_id'
                                type='hidden'
                                initial={onboarding_process_id}
                            />
                        }
                        <Input
                            flex={1}
                            size='large'
                            name='title'
                            label='Titulo'
                            validations={[
                                {
                                    required: true,
                                    message: `Titulo es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={1}
                            name='position'
                            label='Posicion'
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: `Posicion es requerida`
                                }
                            ]}
                        />
                        <Input.TextArea
                            flex={1}
                            name='description'
                            label='Desripcion'
                            autoSize
                        />
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default OnBoardingScreens;