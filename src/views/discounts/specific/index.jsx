import React, { useState } from 'react';
import moment from 'moment';
import { Col, Calendar, message, Typography, Row, Divider, Layout, Button, Drawer, Dropdown, Menu, Modal, DatePicker, Form } from 'antd';
import locale from "antd/es/date-picker/locale/es_ES";
import { Grid, MyModal } from '../../../components/com';
import { useSelector } from 'react-redux';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSchedule, AiOutlineCalendar } from 'react-icons/ai';
import iconDiscount from '../../../sources/icons/discount.svg';
import { Box } from '../../../components';
import { DinamicForm, SimpleForm } from '../../../components/com/form/index';
import { useDeals } from '../hooks/useDeals';
import { getService } from '../../../services';
import AsyncButton from '../../../components/asyncButton';
import { useThirdPartyCodes } from '../hooks/useThirdPartyCodes';
import _ from 'lodash';
import { MINUTES_STEPS_FOR_DISCOUNTS } from '../../../constants';

const { confirm } = Modal;

const format = "h:mm a";

const formatValue = 'hh:mm a';


const days = [
    {
        name: "Lunes",
        id: "monday"
    },
    {
        name: "Martes",
        id: "tuesday"
    },
    {
        name: "Miércoles",
        id: "wednesday"
    },
    {
        name: "Jueves",
        id: "thursday"
    },
    {
        name: "Viernes",
        id: "friday"
    },
    {
        name: "Sábado",
        id: "saturday"
    },
    {
        name: "Domingo",
        id: "sunday"
    }
];

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE = [
    {
        id: 'fixed_amount',
        name: 'Monto fijo',
        field: 'only_read_fixed_amount_subsidized',
    },
    {
        id: 'percentage',
        name: 'Porcentaje',
        field: 'only_read_percentage_subsidized',
    },
];

const PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE_NAMES = {
    fixed_amount: 'Monto fijo',
    percentage: 'Porcentaje',
}

const columns = ({ thirdPartyCodeList }) => [
    {
        xtype: "timefield",
        title: "Inicio",
        dataIndex: "start_hour",
        sorter: true,
        editable: true,
        render: (value) => `${moment(value, formatValue).format(format)}`,
        width: "80px",
    },
    {
        xtype: "timefield",
        title: "Fin",
        dataIndex: "end_hour",
        editable: true,
        sorter: true,
        render: (value) => `${moment(value, formatValue).format(format)}`,
        width: "80px",
    },
    {
        xtype: "numberfield",
        dataIndex: "quantity_available",
        editable: true,
        title: "Cantidad",
        sorter: true,
        width: "90px",
    },
    {
        xtype: "numberfield",
        dataIndex: "percentage",
        editable: true,
        title: "%",
        sorter: true,
        width: "50px",
    },
    {
        xtype: "numberfield",
        dataIndex: "min_persons",
        editable: true,
        title: "Min Personas",
        sorter: true,
        width: "90px",
    },
    {
        xtype: "numberfield",
        dataIndex: "max_persons",
        editable: true,
        title: "Max Personas",
        sorter: true,
        width: "90px",
    },
    {
        xtype: "numberfield",
        dataIndex: "max_reservations",
        editable: true,
        title: "Max Reservations",
        sorter: true,
        width: "120px",
    },
    {
        title: "Tipo desc. Subsidiado",
        dataIndex: "percentage_subsidized_calculator_type",
        sorter: true,
        editable: true,
        render: (value) => PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE_NAMES?.[value] || '',
        width: "100px",
    },
    {
        xtype: "numberfield",
        dataIndex: "only_read_percentage_subsidized",
        editable: false,
        title: "% Subsidiado",
        sorter: true,
        width: "100px",
        render: (value, { percentage_subsidized_calculator_type }) => percentage_subsidized_calculator_type === PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[1].id && (value || '')
    },
    {
        xtype: "numberfield",
        dataIndex: "only_read_fixed_amount_subsidized",
        editable: false,
        title: "Monto Subsidiado",
        sorter: true,
        width: "100px",
        render: (value, { percentage_subsidized_calculator_type }) => percentage_subsidized_calculator_type === PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[0].id && (value || '')
    },
    {
        title: "Oferta",
        dataIndex: "deal_name",
        sorter: true,
        editable: true,
        width: "100px",
    },
    {
        title: "Códigos de terceros",
        dataIndex: "third_party_codes_list_id",
        render: (value) => _.find(thirdPartyCodeList, ({ id }) => id === value)?.name || value,
        width: "150px",
    }
];

const EspecificDiscounts = () => {

    const [form] = Form.useForm();
    const selectedDiscountId = Form.useWatch('id', form);
    const discountTypeValue = Form.useWatch('percentage_subsidized_calculator_type', form);

    const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const discountService = getService('estab-branch-espec-disc');

    const [modalVisible, setModalVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedDiscount, setSelectedDiscount] = useState();

    const [thirdPartyCodeList] = useThirdPartyCodes({ establishment_id: establishmentFilters?.establishment_id });
    const [deals] = useDeals({ establishment_id: establishmentFilters.establishment_id });

    const handleChange = (date) => {
        try {
            setSelectedDate(date.format("YYYY-MM-DD"));
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleSubmit = async (err, data, form) => {

        if (err) return message.error(err);
        if (data.start_hour)
            data.start_hour = typeof data.start_hour == "object" ?
                moment(data.start_hour.format("HH:mm:ss"), "HH:mm:ss").format("HH:mm:ss")
                : moment(moment(data.start_hour, format)).format("HH:mm:ss");
        if (data.end_hour)
            data.end_hour = typeof data.end_hour == "object" ?
                moment(data.end_hour.format("HH:mm:ss"), "HH:mm:ss").format("HH:mm:ss")
                : moment(moment(data.end_hour, format)).format("HH:mm:ss");
        if (data.date)
            data.date = moment(selectedDate).format("YYYY-MM-DD");

        const { id, ...rest } = data;

        if (!selectedDiscountId) {
            await discountService.create({ ...rest })
                .then(() => {
                    message.success("Descuento Creado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                    form.resetFields();
                    setSelectedDiscount(undefined);
                })
                .catch(err => message.error(err.message));
        } else {
            await discountService.patch(selectedDiscountId, { ...rest })
                .then(() => {
                    message.success("Descuento actualizado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                    form.resetFields();
                    setSelectedDiscount(undefined);
                })
                .catch(err => message.error(err.message));
        }
    };

    const onEdit = (source) => {
        try {
            setSelectedDiscount({
                ...source,
                start_hour: moment(source.start_hour, formatValue),
                end_hour: moment(moment(source.end_hour, formatValue)),
            })
            setDrawerVisible(true);
        } catch (error) {
            console.log(error);
        }

    };

    const onRemove = async ({ id }) => {
        await discountService.remove(id)
            .then(() => {
                message.success("Descuento Eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const CopyProgramation = (payloads) => {
        const copyProgramationService = getService('register-estab-branch-espec-disc');
        copyProgramationService.create(payloads)
            .then(() => {
                message.success("Se copió la programación con éxito!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    }

    const handleMenuClick = e => {
        let payloads = {
            establishment_branch_id: establishmentFilters.establishment_branch_id,
        }
        let value;
        payloads["date"] = selectedDate;
        if (!e.key || e.key === selectedDate) {
            value = payloads["date"];
        }
        const day = days.find(day => (day.id === e.key));

        let msg = <>Este proceso copiará los descuentos de la plantilla que la sucursal tiene asignada.
            Agregaremos los descuentos a la fecha <strong>{moment(selectedDate).format("DD-MM-YYYY")} </strong>
            correspondientes al día <strong>{moment(selectedDate).format("dddd")}</strong> de la plantilla.
            Este proceso remplazará cualquier descuento que exista para la fecha.
        </>;
        if (day) {
            payloads["day"] = e.key;
            value = day["name"];

            msg = <>Este proceso copiará los descuentos de la plantilla que la sucursal tiene asignada.
                Agregaremos los descuentos a la fecha <strong>{moment(selectedDate).format("DD-MM-YYYY")} </strong>
                correspondientes al día <strong>{payloads["day"]}</strong> de la plantilla.
                Este proceso remplazará cualquier descuento que exista para la fecha.
            </>;
        }
        confirm({
            title: 'Desea copiar la programación?',
            content: msg,
            onOk() {
                CopyProgramation(payloads);
            }
        });
    };

    const menu = (
        <Menu selectable onClick={handleMenuClick}>
            <Menu.Item key={selectedDate}>
                <span>Duplicar Fecha: {selectedDate}</span>
            </Menu.Item>
            <Menu.Divider />
            {
                days.map(day => (<Menu.Item
                    key={day.id}>
                    <span><AiOutlineCalendar />{" "}{day.name}</span>
                </Menu.Item>))
            }

        </Menu >
    );

    const handleSubmitModal = async (err, data, form) => {
        const copySpecificDiscount = getService("estab-branch-espec-disc");
        if (establishmentFilters.establishment_branch_id && data.source && data.target)
            await copySpecificDiscount.create(
                {
                    source: moment(data.source).format('YYYY-MM-DD'),
                    target: moment(data.target).format('YYYY-MM-DD'),
                    establishment_branch_id: establishmentFilters.establishment_branch_id
                },
                { query: { $client: { copyDiscountFromDate: true } } }
            ).then(() => {
                message.success("Fecha copiada exitosamente");
                setModalVisible(false);
                setUpdateSource(!updateSource);
            }).catch((error) => message.error(error.message));
    }

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
                            Descuentos específicos
                        </Typography.Title>
                    </Col>
                </Row>
                <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            </Row>
            <Row style={{ height: '100%', marginBottom: '1rem' }} gutter={16}>
                <Col
                    xs={24} sm={24} md={24} lg={6} xl={6}
                >
                    <Row
                        style={{
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                            borderRadius: '1rem',
                            background: '#fff',
                            overflow: 'hidden',
                            padding: '0.5rem'
                        }}>
                        <Col
                        >
                            <Calendar
                                locale={locale}
                                size={"large"}
                                disabledDate={(currentDate) => {
                                    return !(establishmentFilters.establishment_branch_id) || currentDate < moment().subtract(1, "days")
                                }}
                                onChange={handleChange}
                                fullscreen={false}
                            />
                        </Col>
                    </Row>
                    <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                    <Row>
                        {
                            userRole === USERS_ROLES.admin &&
                            <Button
                                size='large'
                                type='primary'
                                block
                                icon={<AiOutlinePlus />}
                                style={{ borderRadius: '0.5rem' }}
                                disabled={!(establishmentFilters.establishment_branch_id)}
                                onClick={() => {
                                    setSelectedDiscount(undefined);
                                    form.resetFields();
                                    setDrawerVisible(true)
                                }}
                            >
                                Agregar
                            </Button>
                        }
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    {
                        !(establishmentFilters.establishment_branch_id) ? (
                            <Box>
                                *Selecciona una dirección para ver los registros*
                            </Box>
                        ) : (
                            <Grid
                                filterDefaultValues={{
                                    date: selectedDate,
                                    establishment_branch_id: establishmentFilters.establishment_branch_id,
                                    $sort: {
                                        start_hour: 1
                                    }
                                }}
                                columns={
                                    userRole === USERS_ROLES.admin
                                        ? [
                                            ...columns({ thirdPartyCodeList }),
                                            {
                                                title: "Acciones",
                                                dataIndex: 'id',
                                                width: "90px",
                                                fixed: 'right',
                                                render: (id, record) => {
                                                    return (
                                                        <Row>
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
                                        ]
                                        : columns({ thirdPartyCodeList })
                                }
                                source={"estab-branch-espec-disc"}
                                permitFetch={!!(establishmentFilters.establishment_branch_id)}
                                actions={{}}
                                updateSource={updateSource}
                                extra={
                                    userRole === USERS_ROLES.admin &&
                                    <Row gutter={8}>
                                        <Col>
                                            <Dropdown.Button
                                                onClick={handleMenuClick}
                                                overlay={menu}
                                                icon={<AiOutlineSchedule />}
                                            >
                                                DUPLICAR DÍA
                                            </Dropdown.Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type='primary'
                                                style={{ borderRadius: '0.5rem' }}
                                                disabled={!(establishmentFilters.establishment_branch_id)}
                                                onClick={() => {
                                                    setModalVisible(true);
                                                }}
                                            >
                                                Duplicar fecha especifica
                                            </Button>
                                        </Col>
                                    </Row>
                                }
                            />
                        )

                    }
                </Col>
            </Row>
            {drawerVisible &&
                <Drawer
                    title={
                        'Descuentos'
                    }
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        form.resetFields();
                        setSelectedDiscount(undefined);
                    }}
                >
                    <Row justify="center">
                        <Col>
                            <Typography.Title level={4}>
                                {moment(selectedDate).format('LL')}
                            </Typography.Title>
                        </Col>
                    </Row>
                    <DinamicForm
                        form={form}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                        initialValues={selectedDiscount}
                        fields={[
                            {
                                xtype: "hidden",
                                name: "id",
                            },
                            {
                                flex: 0.5,
                                name: "start_hour",
                                xtype: "timefield",
                                label: "Hora de inicio",
                                placeholder: "Hora de inicio",
                                use12Hours: true,
                                minuteStep: MINUTES_STEPS_FOR_DISCOUNTS,
                                format: 'h:mm a',
                                style: { borderRadius: '0.5rem' },
                                validations: [{
                                    required: true,
                                    message: `Hora Inicio es requerida`
                                }],
                            },
                            {
                                flex: 0.5,
                                name: "end_hour",
                                xtype: "timefield",
                                label: "Hora fin",
                                placeholder: "Hora fin",
                                use12Hours: true,
                                minuteStep: MINUTES_STEPS_FOR_DISCOUNTS,
                                format: 'h:mm a',
                                style: { borderRadius: '0.5rem' },
                                validations: [{
                                    required: true,
                                    message: `Hora fin es requerida`
                                }]
                            },
                            {
                                flex: 0.5,
                                name: "quantity_available",
                                xtype: "numberfield",
                                label: "Cantidad",
                                placeholder: "Cantidad",
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `Cantidad debe ser numérico y es requerida`
                                }]
                            },
                            {
                                flex: 0.5,
                                name: "percentage",
                                xtype: "numberfield",
                                label: "Porcentaje",
                                addonAfter: <>%</>,
                                placeholder: "Porcentaje",
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `Porcentaje debe ser numérico y es requerido`
                                }]
                            },
                            {
                                flex: 0.5,
                                xtype: "numberfield",
                                label: "Min Personas",
                                placeholder: "Min Personas",
                                name: "min_persons",
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `Min Personas debe ser numérico y es requerido`
                                }]
                            },
                            {
                                flex: 0.5,
                                name: "max_persons",
                                xtype: "numberfield",
                                label: "Max Personas",
                                placeholder: "Max Personas",
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `Max Personas debe ser numérico y es requerido`
                                }]
                            },
                            {
                                flex: 1,
                                xtype: "numberfield",
                                label: "Max Reservaciones",
                                placeholder: "Max Reservaciones",
                                name: "max_reservations",
                                validations: [{
                                    type: "number",
                                    message: `Max Reservaciones debe ser numérico y es requerido`
                                }]
                            },
                            {
                                flex: 1,
                                xtype: "selectfield",
                                label: "Seleccione Oferta",
                                placeholder: "Seleccione Oferta",
                                name: "deal_id",
                                choices: deals,
                            },
                            {
                                flex: 1,
                                xtype: "selectfield",
                                label: "Códigos de terceros",
                                placeholder: "Seleccione lista de códigos",
                                name: "third_party_codes_list_id",
                                choices: thirdPartyCodeList,
                            },
                            {
                                flex: 1,
                                xtype: "selectfield",
                                label: "Tipo desc. Subsidiado",
                                placeholder: "Seleccione el tipo",
                                name: "percentage_subsidized_calculator_type",
                                choices: PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE,
                            },
                            discountTypeValue === PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[1].id && {
                                flex: 1,
                                name: "only_read_percentage_subsidized",
                                xtype: "numberfield",
                                label: "% Subsidiado",
                                formatter: (value) => `${value}%`,
                                parser: (value) => value.replace('%', ''),
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `% Subsidiado debe ser numérico y es requerido`
                                }]
                            },
                            discountTypeValue === PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[0].id && {
                                flex: 1,
                                name: "only_read_fixed_amount_subsidized",
                                xtype: "numberfield",
                                label: "Monto subsidiado",
                                formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
                                validations: [{
                                    required: true,
                                    type: "number",
                                    message: `Monto subsidiado debe ser numérico y es requerido`
                                }]
                            },
                            {
                                xtype: "hidden",
                                name: "establishment_branch_id",
                                initial: establishmentFilters.establishment_branch_id,
                            },
                            {
                                xtype: "hidden",
                                name: "type",
                                initial: 'especific',
                            },
                            {
                                xtype: "hidden",
                                name: "date",
                                initial: moment(selectedDate).format("YYYY-MM-DD"),
                            },
                        ]}
                    />
                </Drawer>
            }
            {
                modalVisible && <MyModal
                    title={"Duplicar fecha especifica"}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                    visible={modalVisible}
                >
                    <SimpleForm
                        textAcceptButton='Duplicar fechas escogidas'
                        scrollToFirstError
                        onSubmit={handleSubmitModal}
                    >
                        <DatePicker
                            flex={1}
                            name='source'
                            label='Fecha para duplicar'
                            size='large'
                            locale={locale}
                            validations={[{ required: true, message: 'Fecha es requerida' }]}
                        />
                        <DatePicker
                            flex={1}
                            name='target'
                            label='Fecha destino'
                            size='large'
                            locale={locale}
                            validations={[{ required: true, message: 'Fecha es requerida' }]}
                        />
                    </SimpleForm>

                </MyModal>
            }
        </Layout.Content >
    )
}

export default EspecificDiscounts;