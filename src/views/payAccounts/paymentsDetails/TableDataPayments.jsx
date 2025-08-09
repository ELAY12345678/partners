import _ from 'lodash';
import { Drawer, Input, InputNumber, Select, Tag, DatePicker, message, Button } from 'antd';
import moment from "moment";
import numeral from "numeral";
import { useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import { Grid, MyModal } from "../../../components/com";
import { SimpleForm } from '../../../components/com/form/';
import { RoundedButton } from '../../../components/com/grid/Styles';
import locale from "antd/es/date-picker/locale/es_ES";
import { getService } from '../../../services';
import { AiOutlineEye } from 'react-icons/ai';
import './styles.css';
import { useSelector } from 'react-redux';
import AsyncSelect from '../../../components/asyncSelect';


const STATUS = [
    {
        id: 'completed',
        name: 'Completado',
        color: 'success'
    },
    {
        id: 'pending',
        name: 'Pendiente',
        color: 'processing'
    },
    {
        id: 'rejected',
        name: 'Rechazado',
        color: 'error'
    },
    {
        id: 'expired',
        name: 'Expirado',
    },
];

const OUTPUT_TYPE = [
    { id: "bank", name: "Bancario" },
    { id: "administration", name: "Administrativo" },
    { id: "event", name: "Evento" },
    { id: "consumption", name: "Consumo" },
    { id: "reservation_commissions", name: "Comisión de reservas" },
];

const INCOME_TYPE = [
    { id: "event", name: "Evento" },
    { id: "administration", name: "Adminstration" },
    { id: "referrar", name: "Referido" },
    { id: "consumption", name: "Consumo" },
    { id: "bonus", name: "Bono" },
];

const SelectField = ({ choices, ...rest }) => {
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
                _.map(choices, ({ id, name }, index) =>
                    <Select.Option
                        key={index}
                        value={id}
                    >
                        {name}
                    </Select.Option>
                )
            }
        </Select>
    );
};

const JsonFormattedOutput = ({ jsonString }) => {
    // Convierte la cadena JSON en un objeto JavaScript
    const jsonObject = jsonString;

    // Formatea el objeto JavaScript en un string con tabulación y colores
    const formattedJSON = JSON.stringify(jsonObject, null, 2);

    // Reemplaza las comillas dobles para que se vean en azul
    const coloredJSON = formattedJSON.replace(/"([^"]+)":/g, '<span class="key">"$1":</span>');

    // Reemplaza los valores para que se vean en verde
    const finalOutput = coloredJSON.replace(/: ("[^"]+")/g, ': <span class="value">$1</span>');

    // Devuelve el JSON formateado con los estilos aplicados
    return (
        <pre dangerouslySetInnerHTML={{ __html: finalOutput }} />
    );
};

const TableDataPayments = ({ source, filterDefaultValues, permitFetch, updateStatistic, pay_account_id, expandable, type }) => {

    const currentUser = useSelector(({ appReducer }) => appReducer?.user);

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);


    const updatePaymentStatus = async ({ newStatus, paymentId }) => {
        const payPayments = getService(source);
        await payPayments.patch(paymentId, { status: newStatus })
            .then((response) => {
                message.success("Estado actualizado correctamente!");
                setUpdateSource(!updateSource);
            }).catch((error) => {
                message.error(error?.message || 'No se pudo actualizar, intenta nuevamente!');
            })
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: true,
        },
        source === "pay-payments"
        && {
            title: "Id usuario",
            dataIndex: "user",
            key: "user_id",
            render: (record) => {
                return record
                    ? `${record?.id}`
                    : "Usuario no asociado";
            },
        },
        source === "pay-payments"
        && {
            title: "Usuario",
            dataIndex: "user",
            key: "user",
            render: (record) => {
                return record
                    ? `${record?.first_name} ${record?.last_name
                    }`
                    : "Usuario no asociado";
            },
        },
        filterDefaultValues?.user_id
        && {
            title: "Establecimiento",
            key: "establishment",
            render: (record) => {
                return record
                    ? `${record?.establishment?.name}-${record?.establishment_branch?.address}`
                    : "Establecimiento no asociado";
            },
        },
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            sorter: true,
            render: (record) => `${record !== null ? record : "Tipo no definido"}`,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Cupón",
            dataIndex: "meta_pay_coupon_name",
            keys: "meta_pay_coupon_name",
            sorter: true,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Fecha de expiración",
            dataIndex: "bonus_expiration_date",
            keys: "bonus_expiration_date",
            sorter: true,
            render: (record) => record && `${moment(record).subtract(1, 'second').format("YYYY/MM/DD")}`,
        },
        !(source === "pay-withdrawal" || filterDefaultValues?.user_id) && {
            title: "Beneficio",
            dataIndex: "meta_pay_benefit_name",
            keys: "meta_pay_benefit_name",
            sorter: false,
        },
        {
            title: "Fecha de la transacción",
            dataIndex: "createdAt",
            keys: "createdAt",
            sorter: true,
            render: (record) => type === 'output' ? `${moment(record).format("YYYY/MM/DD")}` : `${moment(record).format("YYYY/MM/DD - h:mm a")}`,
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
        [1,117166,419654].includes(currentUser?.id) && {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            sorter: false,
            width: 140,
            render: (value,record ) =>
            (
                    <AsyncSelect
                        options={STATUS}
                        value={value}
                        onChange={async (value) => await updatePaymentStatus({ newStatus: value, paymentId: record?.id })}
                        style={{
                            minWidth: '100px !important'
                        }}
                    />
      

            )
        },
        {
            title: "Metodo de Pago",
            dataIndex: "payment_method",
            key: "payment_method",
            sorter: true,
            render: (value) => value ? value : 'AppartaPay'

        },
        {
            title: "Monto",
            key: "amount",
            dataIndex: "amount",
            render: (record) => {
                return (
                    <span style={{ color: source === "pay-withdrawal" || filterDefaultValues?.user_id ? "#ff4d4f" : "#52c41a", fontSize: "1rem" }}>
                        ${" "} {source === "pay-withdrawal" || filterDefaultValues?.user_id ? "-" : "+"}
                        {numeral(record).format("0,0")}
                    </span>
                );
            },
        },
        source === "pay-payments"
        && {
            title: "Monto disponible",
            key: "amount_available",
            dataIndex: "amount_available",
            render: (record) => {
                return <span> $ {numeral(record).format("0,0")}</span>;
            },
            align: "center",
        },
        {
            title: "Acciones",
            dataIndex: 'id',
            render: (id, record) => {
                const { establishment, establishment_branch, ...rest } = record;
                return (
                    <Button
                        type="text"
                        onClick={() => setSelectedPayment({ ...rest })}
                        icon={<AiOutlineEye />}
                    />)
            }
        }
    ];

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);
        const payPayments = getService(source);

        if (data.bonus_expiration_date)
            data.bonus_expiration_date = moment(data.bonus_expiration_date)
                .utcOffset(-5)
                .format("YYYY-MM-DD");
        await payPayments.create(data)
            .then(() => {
                message.success(`Nuevo ${source === "pay-withdrawal" || filterDefaultValues?.user_id ? 'egreso' : 'ingreso'} registrado de manera exitosa`);
                setDrawerVisible(false);
                setUpdateSource(!updateSource);
                updateStatistic();
            })
            .catch(err => message.error(err.message));
    };



    return (
        <>
            <MyModal
                title={`Detalles`}
                onCancel={() => setSelectedPayment(null)}
                visible={!!selectedPayment}
            >
                <JsonFormattedOutput jsonString={selectedPayment} />
            </MyModal>
            <Grid
                expandable={expandable}
                source={source}
                filterDefaultValues={{
                    $sort: {
                        createdAt: -1
                    },
                    ...filterDefaultValues
                }}
                permitFetch={permitFetch}
                actions={{}}
                updateSource={updateSource}
                columns={_.filter(columns, (record) => typeof record === 'object')}
                extra={
                    !filterDefaultValues?.user_id && <>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Nuevo {source === "pay-withdrawal" || filterDefaultValues?.user_id ? 'egreso' : 'ingreso'}
                        </RoundedButton>
                    </>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title={`${'Crear'} ${source === "pay-withdrawal" || filterDefaultValues?.user_id ? 'egreso' : 'ingreso'}`}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        textAcceptButton='Crear'
                        scrollToFirstError
                        onSubmit={handleSubmit}
                    >
                        <Input
                            type='hidden'
                            name='pay_account_id'
                            initial={pay_account_id}
                        />
                        {filterDefaultValues?.user_id &&
                            <Input
                                type='hidden'
                                name='user_id'
                                initial={filterDefaultValues.user_id}
                            />

                        }
                        <InputNumber
                            flex={1}
                            label='Cantidad'
                            name="amount"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: 'Cantidad es requerida' }]}
                        />
                        <Input.TextArea
                            flex={1}
                            label='Motivo'
                            name="description"
                            autoSize
                            validations={[{ required: true, message: 'Motivo es requerido' }]}
                        />
                        {
                            source === "pay-withdrawal" || filterDefaultValues?.user_id ? (
                                <SelectField
                                    flex={1}
                                    label='Tipo de egreso'
                                    name="type"
                                    choices={OUTPUT_TYPE}
                                    validations={[{ required: true, message: 'Tipo de egreso es requerido' }]}
                                />
                            ) : (

                                <SelectField
                                    flex={1}
                                    label='Tipo de ingresos'
                                    name="type"
                                    choices={INCOME_TYPE}
                                    validations={[{ required: true, message: 'Tipo de ingreso es requerido' }]}
                                />

                            )
                        }
                        {
                            !(source === "pay-withdrawal" || filterDefaultValues?.user_id) &&
                            <DatePicker
                                flex={1}
                                name='bonus_expiration_date'
                                label='Fecha de expiración'
                                size='large'
                                locale={locale}
                            />
                        }

                        <SelectField
                            flex={1}
                            label='Estado'
                            name="status"
                            choices={STATUS}
                            validations={[{ required: true, message: 'Estado es requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default TableDataPayments;