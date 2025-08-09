import { Button, Col, Divider, Drawer, Input, InputNumber, message, Row, Typography } from "antd";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import AsyncButton from "../../../components/asyncButton";
import { Grid, MyModal } from "../../../components/com";
import { FileUploader, SimpleForm } from "../../../components/com/form/";
import { RoundedButton } from "../../../components/com/grid/Styles";
import { getService } from "../../../services";

const columns = ({ onRemove, onEdit }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
        width: 100
    },
    {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        width: 200,
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

const columnsCodes = ({ onRemoveCode, onEditCodes }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
        width: 100
    },
    {
        title: "Código",
        dataIndex: "code",
        key: "code",
        sorter: true,
    },
    {
        title: "Cantidad",
        dataIndex: "quantity",
        key: "quantity",
        sorter: true,
    },
    {
        title: "Cantidad de usos",
        dataIndex: "quantity_use",
        key: "quantity_use",
        sorter: true,
    },
    {
        title: "Porcentaje",
        dataIndex: "percentage",
        key: "percentage",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        key: 'actions',
        width: 200,
        render: (id, record) =>
            <>
                <Button
                    type="text"
                    onClick={() => onEditCodes(record)}
                    icon={<AiOutlineEdit />}
                />
                <AsyncButton
                    type="link"
                    onClick={() => onRemoveCode({ id })}
                    icon={<AiOutlineDelete />}
                    confirmText="Desea eliminar?"
                >
                </AsyncButton>
            </>
    }
];

const ThirdPartyCodes = ({ establishment_id }) => {

    const serviceCodeParty = getService("third-party-codes");

    const [updateSource, setUpdateSource] = useState(false);
    const [updateSourceList, setUpdateSourceList] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedThirdPartyCodeList, setSelectedThirdPartyCodeList] = useState();
    const [selectedThirdPartyCode, setSelectedThirdPartyCode] = useState();

    const onRemove = async ({ id }) => {
        const thirdPartyCodeList = getService('third-party-codes-list');
        await thirdPartyCodeList.remove(id)
            .then(() => {
                message.success("Lista eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la Lista! ' + error?.message)
            )
    };

    const onRemoveCode = async ({ id }) => {
        const thirdPartyCodeList = getService('third-party-codes');
        await thirdPartyCodeList.remove(id)
            .then(() => {
                message.success("Lista eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la Lista! ' + error?.message)
            )
    };

    const onEdit = (record) => {
        setSelectedThirdPartyCodeList(record);
    };

    const onEditCodes = (record) => {
        setSelectedThirdPartyCode(record);
        setDrawerVisible(true);
    };

    const exportTemplate = async () => {
        await serviceCodeParty
            .find({
                query: {
                    establishment_id,
                    third_party_codes_list_id: selectedThirdPartyCode?.id,
                    $client: { exportThirdPartyCodes: true },
                },
            })
            .then((response) => {
                return window.open(response.path, '_blank');
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    const handleUploadFinish = async (url, _id) => {
        try {
            await serviceCodeParty.create(
                {
                    file_path: `/${url}`,
                    third_party_codes_list_id: selectedThirdPartyCodeList?.id,
                    establishment_id,
                },
                { query: { $client: { importThirdPartyCodes: true } } }
            ).then((response) => {
                message.success(response.message);
                setUpdateSource(!updateSource);
            });
        } catch (e) {
            message.error(e.message);
        }
    };

    return (
        <>
            <MyModal
                title={"Lista de códigos"}
                onCancel={() => {
                    setModalVisible(false);
                }}
                visible={modalVisible}
            >
                <SimpleForm
                    source='third-party-codes-list'
                    textAcceptButton={'Guardar'}
                    onSubmit={() => {
                        setModalVisible(false);
                        setUpdateSourceList(!updateSourceList);
                    }}
                >
                    <InputNumber
                        name='establishment_id'
                        type='hidden'
                        initial={establishment_id}
                    />
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
                </SimpleForm>
            </MyModal>
            <Grid
                source='third-party-codes-list'
                filterDefaultValues={{
                    establishment_id,
                    $sort: {
                        id: 1,
                    },
                }}
                updateSource={updateSourceList}
                columns={columns({ onRemove, onEdit })}
                permitFetch={true}
                actions={{}}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setModalVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
            />
            <Divider style={{ background: 'transparent', borderTop: 0 }} />
            {
                selectedThirdPartyCodeList &&
                <Grid
                    source='third-party-codes'
                    filterDefaultValues={{
                        third_party_codes_list_id: selectedThirdPartyCodeList?.id,
                        $sort: {
                            id: 1,
                        },
                    }}
                    updateSource={updateSource}
                    columns={columnsCodes({ onRemoveCode, onEditCodes })}
                    permitFetch={true}
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
                    title={
                        <Row gutter={16} align="middle">
                            <Col>
                                <Typography.Title level={4}>
                                    Lista: {selectedThirdPartyCodeList?.name}
                                </Typography.Title>
                            </Col>
                            <Col>
                                <FileUploader
                                    preview={false}
                                    path={`third-party-codes-list/${establishment_id}/`}
                                    style={{ borderRadius: '0.5rem' }}
                                    title='Importar plantilla'
                                    allowTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                                    onFinish={(url) =>
                                        handleUploadFinish(url, selectedThirdPartyCodeList?.id)
                                    }
                                />
                            </Col>
                            <Col>
                                <AsyncButton
                                    type='primary'
                                    size='large'
                                    style={{ borderRadius: '0.5rem' }}
                                    onClick={exportTemplate}
                                >
                                    Exportar plantilla
                                </AsyncButton>
                            </Col>
                        </Row>
                    }
                />
            }
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedThirdPartyCode ? 'Editar' : 'Crear'} Código`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedThirdPartyCode();
                    }}
                >
                    <SimpleForm
                        source='third-party-codes'
                        textAcceptButton={`${selectedThirdPartyCode ? 'Actualizar' : 'Crear'} Código`}
                        onSubmit={() => {
                            setUpdateSource(!updateSource);
                            setDrawerVisible(false);
                            setSelectedThirdPartyCode();
                        }}
                        initialValues={selectedThirdPartyCode}
                        id={selectedThirdPartyCode?.id}
                    >
                        <InputNumber
                            name='third_party_codes_list_id'
                            type='hidden'
                            initial={selectedThirdPartyCodeList?.id}
                        />
                        <InputNumber
                            name='establishment_id'
                            type='hidden'
                            initial={establishment_id}
                        />
                        <Input
                            flex={1}
                            name='code'
                            label='Código'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Código es requerido`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={1}
                            name='quantity'
                            label='Cantidad'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Cantidad es requerida`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={1}
                            name='quantity_use'
                            label='Cantidad de uso'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Cantidad de uso es requerida`
                                }
                            ]}
                        />
                        <InputNumber
                            flex={1}
                            name='percentage'
                            label='Porcentaje'
                            size="large"
                            validations={[
                                {
                                    required: true,
                                    message: `Porcentaje es requerido`
                                }
                            ]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default ThirdPartyCodes;