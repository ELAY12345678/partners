import { useState } from "react";
import { Drawer, message, Upload, Button, InputNumber, Input } from "antd";
import _ from "lodash";
import { AiOutlineDelete, AiOutlinePlus, } from "react-icons/ai";
import AsyncButton from "../../../components/asyncButton";
import { Grid } from "../../../components/com";
import { SimpleForm, FileUploader } from "../../../components/com/form/";
import { RoundedButton } from "../../../components/com/grid/Styles";
import { URL_S3 } from "../../../constants";
import { getService } from "../../../services";

const URL_FILE_FORMAT_BONUS = "payPayments/bonus/formato-bonos.xlsx";


const columns = ({ onRemove }) => [
    {
        key: "user_id",
        dataIndex: "user_id",
        title: "Id usuario",
        sorter: true,
    },
    {
        key: "pay_benefit_id",
        dataIndex: "pay_benefit_id",
        title: "Id beneficio",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) => {
            return (
                <>
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

const PayBenefitUserSegments = ({ pay_benefit_id }) => {

    const payBenefitsUserSegments = getService('pay-benefits-users-segment');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [file_path, setFile_path] = useState();
    const [fileList, setFileList] = useState();

    const onRemove = async ({ id }) => {
        await payBenefitsUserSegments.remove(id)
            .then(() => {
                message.success("Usuario eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        if (data?.pay_benefit_id) {
            await payBenefitsUserSegments
                .create(data)
                .then((response) => {
                    setUpdateSource(!updateSource);
                    setDrawerVisible(false);
                    message.success("Usuario agregado a este beneficio correctamente!");
                })
                .catch((err) => {
                    message.error(err.message);
                });
        }
        else {
            message.info('No se ha selecionado ningún beneficio');
        }
    };

    const handleSubmitImportUsers = async (err, data, form) => {
        if (err) return message.error(err);

        if (file_path && pay_benefit_id)
            await payBenefitsUserSegments.create({
                file_path: `${file_path}`,
                pay_benefit_id,
            }, {
                query: { $client: { importExcel: 'usersFromExcel' } }
            })
                .then(() => {
                    message.success("Usuarios cargados correctamente!");
                    setDrawerVisible(false);
                    setFile_path();
                    setFileList();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        else {
            if (!file_path)
                message.info('No se ha cargado ningún archivo');
            else if (!pay_benefit_id)
                message.info('No se ha selecionado ningún beneficio');
        }
    };

    return (
        <>
            <Grid
                custom={true}
                updateSource={updateSource}
                source="pay-benefits-users-segment"
                filterDefaultValues={{
                    pay_benefit_id: pay_benefit_id,
                    $sort: {
                        id: 1
                    }
                }}
                actions={{}}
                columns={columns({ onRemove })}
                extra={
                    <div>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Importar Usuarios
                        </RoundedButton>
                    </div>
                }
                filters={
                    <>
                        <InputNumber
                            alwaysOn
                            source="user_id"
                            name="user_id"
                            label="Id Usuario"
                            placeholder="Id Usuario"
                            allowEmpty
                            style={{ width: '200px' }}
                        />
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title='Importar usuarios'
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setFile_path();
                        setFileList();
                    }}
                >
                    <SimpleForm
                        textAcceptButton='Importar'
                        scrollToFirstError
                        onSubmit={handleSubmitImportUsers}
                    >
                        {
                            fileList &&
                            <Upload
                                flex={1}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture"
                                defaultFileList={[fileList]}
                                onRemove={() => {
                                    setFileList();
                                    setFile_path();
                                }}
                            ></Upload>
                        }
                        <FileUploader
                            flex={1}
                            preview={false}
                            path={`/appartaPay/benefits/`}
                            style={{ borderRadius: '0.5rem' }}
                            title='Cargar archivo'
                            allowTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                            onFinish={(url, file) => {
                                setFileList(file)
                                setFile_path(url);
                            }}
                        />
                        <Button
                            type='link'
                            onClick={() => window.open(`${URL_S3}${URL_FILE_FORMAT_BONUS}`, '_blank')}
                        >
                            Descargar plantilla
                        </Button>
                    </SimpleForm>
                    <hr />
                    <SimpleForm
                        textAcceptButton='Agregar usuario'
                        scrollToFirstError
                        onSubmit={handleSubmit}
                    >
                        <Input
                            type="hidden"
                            name='pay_benefit_id'
                            initial={pay_benefit_id}
                        />
                        <InputNumber
                            flex={1}
                            label='Id Usuario '
                            name='user_id'
                            size='large'
                            validations={[{ required: true, message: 'Usuario ID es requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default PayBenefitUserSegments;