import { useState } from 'react';
import moment from 'moment';
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import locale from "antd/es/date-picker/locale/es_ES";
import { Button, Row, Col, Statistic, Divider, Drawer, DatePicker, InputNumber, Upload, message, Tag } from 'antd';
import { Grid } from "../../components/com";
import { useTotalAmounts } from "./hooks";
import { Box } from "../../components/Styles";
import { FileUploader, SimpleForm } from '../../components/com/form/';
import { URL_S3 } from '../../constants/index';
import { getService } from '../../services';
import _ from 'lodash';

const STATUS = [
    {
        id: 'active',
        name: 'Active',
        color: 'success'
    },
    {
        id: 'inactive',
        name: 'Inactive',
        color: 'error'
    },
    {
        id: 'disabled',
        name: 'Disabled',
        color: 'red'
    },
];

const URL_FILE_FORMAT_BONUS = "payPayments/bonus/formato-bonos.xlsx";

const columns = ({ navigate }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Id Usuario",
        dataIndex: "user_id",
        key: "user_id",
        sorter: true,
    },
    {
        title: "Usuario",
        dataIndex: "user",
        key: "user",
        sorter: true,
        render: (user) => user?.first_name + " " + user?.last_name

    },
    {
        title: "Total ingreso wallet",
        dataIndex: "amount_available",
        key: "amount_available",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`

    },
    {
        title: "Total egreso wallet",
        dataIndex: "amount_withdrawal",
        key: "amount_withdrawal",
        sorter: true,
        render: (value) => `$ ${numeral(value || "").format("0,0")}`

    },
    {
        title: "Balance wallet",
        dataIndex: "id",
        key: "wallet_balance",
        sorter: true,
        render: (id, { amount_available, amount_withdrawal }) => `$ ${numeral(amount_available - amount_withdrawal || "").format("0,0")}`
    },
    {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        sorter: true,
        render: (value) => {
            const status = _.find(STATUS, ({ id }) => id === value) || value
            return <Tag color={status?.color} >
                {status?.name || status}
            </Tag>
        }

    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id, record) =>
            <Button
                type="link "
                onClick={() => navigate(
                    '/dashboard/management/pay-accounts/details',
                    {
                        state: {
                            pay_account_id: id,
                            user_id: record?.user?.id,
                            account_name: `${record?.user?.first_name} ${record?.user?.last_name}`
                        }
                    })}
                icon={<AiOutlineEye />}
            />
    },
];

const UsersAccounts = () => {
    const navigate = useNavigate(); 
    const [establishmentsTotalAmounts, loadingEstablishmentsTotalAmounts] = useTotalAmounts('totalAmountsByUser');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [file_path, setFile_path] = useState();
    const [fileList, setFileList] = useState();

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        const payPayments = getService("pay-payments");

        if (file_path)
            await payPayments.create({
                bonus_expiration_date: moment(data.bonus_expiration_date)
                    .utcOffset(-5)
                    .format("YYYY-MM-DD"),
                file_path: `/${file_path}`,
                amount: data.amount,
            }, {
                query: { $client: { importBonus: true } }
            })
                .then(() => {
                    message.success("Bonos cargados correctamente!");
                    setDrawerVisible(false);
                    setFile_path();
                    setFileList();
                })
                .catch(err => message.error(err.message));
        else
            message.info('No se ha cargado ningún archivo');
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Total ingresado (COP)"
                                value={establishmentsTotalAmounts?.amount_available}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Total retirado (COP)"
                                value={establishmentsTotalAmounts?.amount_withdrawal}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
                <Col span={8}>
                    <Box>
                        <Col span={24}>
                            <Statistic
                                title="Balance (COP)"
                                value={establishmentsTotalAmounts?.amount}
                                precision={2}
                                loading={loadingEstablishmentsTotalAmounts}
                            />
                        </Col>
                    </Box>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Grid
                // custom={true}
                source="pay-accounts"
                filterDefaultValues={{
                    type: 'user',
                    $sort: {
                        id: 1
                    }
                }}
                searchField="q"
                searchText="Buscar..."
                search={true}
                actions={{}}
                columns={columns({ navigate })}
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
                extra={
                    <>
                        <Button
                            type='primary'
                            style={{ borderRadius: '0.5rem' }}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Importar bonos
                        </Button>
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title='Importar Bonos'
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setFile_path();
                        setFileList();
                    }}
                >
                    <SimpleForm
                        textAcceptButton='Cargar Bonos'
                        scrollToFirstError
                        onSubmit={handleSubmit}
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
                            path={`/appartaPay/bonus/`}
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
                        <DatePicker
                            flex={1}
                            name='bonus_expiration_date'
                            label='Fecha de expiración'
                            size='large'
                            locale={locale}
                            validations={[{ required: true, message: 'Fecha es requerida' }]}

                        />
                        <InputNumber
                            flex={1}
                            size='large'
                            label='Valor a cargar en el wallet'
                            name="amount"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: 'Este campo es requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default UsersAccounts;