import React, { useState, useEffect } from 'react';
import { Table, Row, Divider, message, Menu, Col, Dropdown, Button, Modal, Form } from 'antd';
import moment from 'moment';
import { getService } from '../../../services';
import { DinamicForm } from '../../../components/com/form/DinamicForm';
import { useDeals } from '../hooks/useDeals';
import AsyncButton from '../../../components/asyncButton';
import locale from "antd/es/date-picker/locale/es_ES";

import EditTabale from '../../../components/com/EditTabale';

import { AiOutlineCalendar } from 'react-icons/ai';

import { FileUploader } from '../../../components/com/form/';
import { useThirdPartyCodes } from '../hooks/useThirdPartyCodes';
import { MINUTES_STEPS_FOR_DISCOUNTS } from '../../../constants';
import _ from 'lodash';

const { confirm } = Modal;

const format = "h:mm a";

const days = [
    {
        name: "Lunes",
        id: "monday",
        key: 1,
    },
    {
        name: "Martes",
        id: "tuesday",
        key: 2,

    },
    {
        name: "Miércoles",
        id: "wednesday",
        key: 3,
    },
    {
        name: "Jueves",
        id: "thursday",
        key: 4,
    },
    {
        name: "Viernes",
        id: "friday",
        key: 5,
    },
    {
        name: "Sábado",
        id: "saturday",
        key: 6,
    },
    {
        name: "Domingo",
        id: "sunday",
        key: 7,
    },
];

const PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE = [
    {
        id: 'fixed_amount',
        name: 'Monto fijo',
        // field: 'fixed_amount_subsidized',
        field: 'only_read_fixed_amount_subsidized',
        formatValue: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
        id: 'percentage',
        name: 'Porcentaje',
        // field: 'percentage_subsidized',
        field: 'only_read_percentage_subsidized',
        formatValue: (value) => `${value}%`
    },
];

const FormTemplate = ({ selectedTemplate, establishment_id, isAdmin }) => {

    const [form] = Form.useForm();
    const discountTypeValue = Form.useWatch('percentage_subsidized_calculator_type', form);

    const discountService = getService("discounts");
    const [deals] = useDeals({ establishment_id: establishment_id });
    const [thirdPartyCodeList] = useThirdPartyCodes({ establishment_id });
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState();
    const [discounts_template, setDiscountsTemplate] = useState([]);
    const [loading_discount, setLoadingDiscount] = useState(false);

    const getDiscountTemplate = (discount_template_id) => {
        setLoadingDiscount(true);
        discountService.find({
            query: {
                discount_template_id,
                $limit: 100000,
                $sort: {
                    start_hour: 1,
                },
            },
        }).then(({ data }) => {
            setDiscountsTemplate(data);
            setLoadingDiscount(false);
        }).catch(err => {
            setDiscountsTemplate([]);
            message.error(err?.message);
            setLoadingDiscount(false);
        })
    };

    const expanderRow = ({ discount_template_id, updateSource, setSelectedDiscount, isAdmin, ...record }, index) => {

        const handleSubmit = async ({ id, ...rest }) => {

            if (rest.start_hour)
                rest.start_hour = moment(rest.start_hour, format).format("HH:mm:ss");

            if (rest.end_hour)
                rest.end_hour = moment(rest.end_hour, format).format("HH:mm:ss");

            if (rest.inactive_until)
                rest.inactive_until = moment(rest.inactive_until).utc().format('YYYY-MM-DD HH:mm:ss')

            await discountService
                .patch(id, {
                    discount_template_id,
                    ...rest,
                })
                .then(() => {
                    setLoadingDiscount(false);
                    getDiscountTemplate(selectedTemplate);
                    message.success("Descuento Actualizado");
                })
                .catch(err => message.error('No se pudo actualizar el descuento! ' + err?.message));
        };

        const onDelete = async ({ id }) => {
            await discountService
                .remove(id)
                .then(() => {
                    setUpdateSource(!updateSource);
                    getDiscountTemplate(selectedTemplate);
                    message.success("Descuento Eliminado!");
                })
                .catch((err) => message.error('No se pudo eliminar el descuento, ' + err?.message));
        };

        const handleMenuClick = (e) => {
            let payloads = {
                discount_template_id,
                day_week_destination: record.id,
            };
            let value;
            const day = days.find((day) => day.id === e.key);
            if (day) {
                payloads["day_week_origin"] = e.key;
                value = day["name"];
            }

            confirm({
                title: "Desea copiar la programación?",
                content: (
                    <>
                        Se copiaran los descuentos del día <strong>{value} </strong>
                        <br />
                        Este proceso remplazará cualquier descuento que exista para ese día
                        en la plantilla.
                    </>
                ),

                onOk() {
                    copyDayOfWeek(payloads);
                },
            });
        };

        const copyDayOfWeek = (payloads) => {
            const copyService = getService("copy-discounts-from-days-week");
            copyService.create(payloads)
                .then(() => {
                    setUpdateSource(!updateSource);
                    getDiscountTemplate(selectedTemplate);
                    message.success("Día copiado con éxito!");
                })
                .catch((error) => { message.error("No se pudo copiar el día! " + error?.message) });
        };

        const menu = (
            <Menu selectable onClick={handleMenuClick}>
                <Menu.Divider />
                {days.map((day) => (
                    <Menu.Item key={day.id}>
                        <span>
                            <AiOutlineCalendar /> {day.name}
                        </span>
                    </Menu.Item>
                ))}
            </Menu>
        );

        return (
            <Row
                style={{
                    margin: "10px 0px",
                }}
                gutter={[16, 16]}
            >
                {
                    isAdmin &&
                    <Col span={24}>
                        <Row
                            gutter={4}
                            type="flex"
                            justify="end"
                            align="center"
                        >
                            <Col>
                                <Dropdown
                                    overlay={menu}
                                >
                                    <Button >COPIAR DÍA</Button>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                }

                <Col span={24}>
                    <EditTabale
                        isAdmin={isAdmin}
                        pagination={false}
                        onDelete={onDelete}
                        onSubmit={handleSubmit}
                        dataSource={
                            !loading_discount &&
                            discounts_template.filter((it) => it.day === record.id)
                        }
                        loading={loading_discount}
                        columns={[
                            {
                                xtype: "timefield",
                                dataIndex: "start_hour",
                                editable: isAdmin,
                                title: "Inicio",
                                required: true,
                                render: (value) => `${moment(value, 'hh:mm a').format('h:mm a')}`
                            },
                            {
                                xtype: "timefield",
                                dataIndex: "end_hour",
                                editable: isAdmin,
                                title: "Fin",
                                required: true,
                                render: (value) => `${moment(value, 'hh:mm a').format('h:mm a')}`
                            },
                            {
                                xtype: "numberfield",
                                dataIndex: "quantity_available",
                                editable: isAdmin,
                                title: "Cantidad",
                                required: true,
                            },
                            {
                                xtype: "numberfield",
                                dataIndex: "percentage",
                                editable: isAdmin,
                                title: "%",
                                formatter: (value) => `${value}%`,
                                parser: (value) => value.replace('%', ''),
                                required: true,
                            },
                            {
                                xtype: "numberfield",
                                dataIndex: "max_persons",
                                editable: isAdmin,
                                title: "Max Personas",
                                required: true,
                            },
                            {
                                xtype: "numberfield",
                                dataIndex: "max_reservations",
                                editable: isAdmin,
                                title: "Max Reservations",
                            },
                            {
                                xtype: "selectfield",
                                dataIndex: "percentage_subsidized_calculator_type",
                                editable: isAdmin,
                                title: "Tipo desc. Subsidiado",
                                choices: PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE,
                                allowClear: true
                            },
                            {
                                xtype: "numberfield",
                                // dataIndex: "percentage_subsidized",
                                dataIndex: "only_read_percentage_subsidized",
                                editable: isAdmin,
                                required: true,
                                title: "% Subsidiado",
                                formatter: (value) => `${value}%`,
                                parser: (value) => value.replace('%', ''),
                                dependencyCondition: 'percentage',
                                dependencyField: 'percentage_subsidized_calculator_type',
                                render: (value, record) => {
                                    const typeDiscount = PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[1];
                                    if (typeDiscount && record[typeDiscount.field] && record.percentage_subsidized_calculator_type === typeDiscount.id)
                                        return typeDiscount.formatValue(record[typeDiscount.field])
                                    else
                                        return ''
                                }
                            },
                            {
                                xtype: "numberfield",
                                // dataIndex: "fixed_amount_subsidized",
                                dataIndex: "only_read_fixed_amount_subsidized",
                                editable: isAdmin,
                                required: true,
                                title: "Monto Subsidiado",
                                formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => value.replace(/\$\s?|(,*)/g, ''),
                                dependencyCondition: 'fixed_amount',
                                dependencyField: 'percentage_subsidized_calculator_type',
                                render: (value, record) => {
                                    const typeDiscount = PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[0];
                                    if (typeDiscount && record[typeDiscount.field] && record.percentage_subsidized_calculator_type === typeDiscount.id)
                                        return typeDiscount.formatValue(record[typeDiscount.field])
                                    else
                                        return ''
                                }
                            },
                            {
                                xtype: "datefield",
                                dataIndex: "inactive_until",
                                editable: isAdmin,
                                title: "Inactivo hasta",
                                required: false,
                                render: (value) => value ? `${moment(value).format('YYYY-MM-DD HH:mm:ss')}` : '',
                                format: 'YYYY-MM-DD HH:mm:ss',
                                showTime: true,
                                locale: locale
                            },
                            {
                                xtype: "selectfield",
                                dataIndex: "deal_id",
                                choices: _.map(deals,(it) => ({
                                    id: it?.id,
                                    name: it?.name,
                                })),
                                editable: isAdmin,
                                title: "Oferta",
                                allowClear: true
                            },
                            {
                                xtype: "selectfield",
                                dataIndex: "third_party_codes_list_id",
                                choices: _.map(thirdPartyCodeList,(it) => ({
                                    id: it?.id,
                                    name: it?.name,
                                })),
                                editable: isAdmin,
                                title: "Códigos de terceros",
                                allowClear: true
                            }
                        ]}
                    />
                </Col>
            </Row>
        );
    };

    // const handleExpand = async (expanded, record) => {
    //     let { discount_template_id } = record;
    //     getDiscountTemplate(discount_template_id);
    // };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (data.start_hour)
            data.start_hour = moment(moment(data.start_hour, format)).format("HH:mm:ss");
        if (data.end_hour)
            data.end_hour = moment(moment(data.end_hour, format)).format("HH:mm:ss");

        if (!selectedDiscount) {
            await discountService.create({
                ...data,
                discount_template_id: selectedTemplate
            })
                .then(() => {
                    message.success("Descuento Creado!");
                    setUpdateSource(!updateSource);
                    getDiscountTemplate(selectedTemplate);
                })
                .catch(err => message.error('No se pudo crear el descuento! ' + err?.message));
        } else {
            await discountService.patch(selectedDiscount.id, data)
                .then(() => {
                    setUpdateSource(!updateSource);
                    setSelectedDiscount();
                    message.success("Descuento actualizado!");
                })
                .catch(err => message.error('No se pudo actualizar el descuento!' + err?.message));
        }
    };

    const exportDiscountTemplate = async () => {
        await discountService.find({
            query: {
                discount_template_id: selectedTemplate,
                $client: { exportDiscounts: true },
            },
        }).then((response) => {
            return window.open(response.path, '_blank');
        })
            .catch((error) => {
                message.error(error.message);
            });
    }

    const handleUploadFinish = async (url, _id) => {
        await discountService.create(
            { file_path: `/${url}`, discount_template_id: _id },
            { query: { $client: { importDiscounts: true } } }
        )
            .then((response) => {
                message.success(response.message);
                getDiscountTemplate(selectedTemplate);
            })
            .catch((err) => message.error(err.message));
    };

    useEffect(() => {
        getDiscountTemplate(selectedTemplate);
    }, [selectedTemplate]);

    return (
        <Row>
            {
                isAdmin &&
                (
                    <>
                        <Divider style={{ background: 'transparent', borderTop: 0 }} />
                        <Row gutter={16}>
                            <Col>
                                <FileUploader
                                    preview={false}
                                    path={`discount-templates/${establishment_id}/`}
                                    style={{ borderRadius: '0.5rem' }}
                                    title='Importar plantilla'
                                    allowTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                                    onFinish={(url) =>
                                        handleUploadFinish(url, selectedTemplate)
                                    }
                                />
                            </Col>
                            <Col>
                                <AsyncButton
                                    type='primary'
                                    size='middle'
                                    style={{ borderRadius: '0.5rem' }}
                                    onClick={exportDiscountTemplate}
                                >
                                    Exportar plantilla
                                </AsyncButton>
                            </Col>
                        </Row>
                        <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                        <DinamicForm
                            form={form}
                            initialValues={selectedDiscount}
                            textAcceptButton={'+ Agregar descuento'}
                            noAcceptButtonBlock={true}
                            onSubmit={handleSubmit}
                            fields={[
                                {
                                    xtype: "selectfield",
                                    name: "day",
                                    choices: days,
                                    label: "Día",
                                    validations: [{
                                        required: true,
                                        message: `Día es requerido`
                                    }],
                                    style: { width: '120px' }
                                },
                                {
                                    name: "start_hour",
                                    xtype: "timefield",
                                    label: "Hora Inicio",
                                    use12Hours: true,
                                    minuteStep: MINUTES_STEPS_FOR_DISCOUNTS,
                                    format: 'h:mm a',
                                    validations: [{
                                        required: true,
                                        message: `Hora inicio requerida`
                                    }],
                                    size: "large"
                                },
                                {
                                    name: "end_hour",
                                    xtype: "timefield",
                                    label: "Hora Fin",
                                    use12Hours: true,
                                    minuteStep: MINUTES_STEPS_FOR_DISCOUNTS,
                                    format: 'h:mm a',
                                    validations: [{
                                        required: true,
                                        message: `Hora fin requerida`
                                    }],
                                    size: "large"
                                },
                                {
                                    xtype: "numberfield",
                                    name: "quantity_available",
                                    label: "Cantidad",
                                    validations: [{
                                        required: true,
                                        type: "number",
                                        message: `Cantidad debe ser numérico y es requerida`
                                    }],
                                    style: { width: '100px' }
                                },
                                {
                                    xtype: "numberfield",
                                    name: "percentage",
                                    label: "Porcentaje",
                                    addonAfter: <>%</>,
                                    validations: [{
                                        required: true,
                                        type: "number",
                                        message: `Porcentaje debe ser numérico y es requerido`
                                    }],
                                    style: { width: '100px' }
                                },
                                {
                                    xtype: "numberfield",
                                    label: "Min Personas",
                                    name: "min_persons",
                                    validations: [{
                                        required: true,
                                        type: "number",
                                        message: `Min Personas debe ser numérico y es requerido`
                                    }],
                                    style: { width: '150px' }
                                },
                                {
                                    name: "max_persons",
                                    xtype: "numberfield",
                                    label: "Max Personas",
                                    validations: [{
                                        required: true,
                                        type: "number",
                                        message: `Max Personas debe ser numérico y es requerido`
                                    }],
                                    style: { width: '150px' }
                                },
                                {
                                    xtype: "numberfield",
                                    label: "Max Reservaciones",
                                    name: "max_reservations",
                                    style: { width: '170px' }
                                },
                                {
                                    xtype: "selectfield",
                                    label: "Seleccione Oferta",
                                    name: "deal_id",
                                    choices: deals,
                                    style: { width: '200px' }
                                },
                                {
                                    xtype: "selectfield",
                                    label: "Códigos de terceros",
                                    name: "third_party_codes_list_id",
                                    choices: thirdPartyCodeList,
                                    style: { width: '200px' }
                                },
                                {
                                    xtype: "selectfield",
                                    label: "Tipo de descuento Subsidiado",
                                    placeholder: "Tipo de descuento Subsidiado",
                                    name: "percentage_subsidized_calculator_type",
                                    choices: PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE,
                                },
                                discountTypeValue === PERCENTAGE_SUBSIDIZED_CALCULATOR_TYPE[1].id && {
                                    // name: "percentage_subsidized",
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
                                    // name: "fixed_amount_subsidized",
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
                            ]}
                        />
                    </>
                )
            }

            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Table
                style={{ width: '100%' }}
                showHeader={false}
                dataSource={days}
                pagination={false}
                expandedRowRender={(rec) =>
                    expanderRow({
                        ...rec,
                        discount_template_id: selectedTemplate,
                        updateSource,
                        setSelectedDiscount,
                        isAdmin
                    })
                }
                // onExpand={(exp, rec) =>
                //     handleExpand(exp, {
                //         discount_template_id: selectedTemplate,
                //         ...rec,
                //     })
                // }
                columns={[
                    {
                        dataIndex: "name",
                        key: "name"
                    },
                ]}
            />
        </Row>
    );
}

export default FormTemplate;