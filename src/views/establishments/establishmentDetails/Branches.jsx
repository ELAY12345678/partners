import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select, Tag, Typography, message } from 'antd';
import locale from "antd/es/date-picker/locale/es_ES";
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../../components/asyncButton';
import { Grid } from '../../../components/com';
import { FileUploader, SimpleForm } from '../../../components/com/form/';
import GalleryUploader from '../../../components/com/gallery/GalleryUploader';
import { RoundedButton } from '../../../components/com/grid/Styles';
import RichTextField from '../../../components/richTextField';
import { useCities } from '../../../hooks/useCities';
import { getService } from '../../../services';
import { usePlaces, useZones } from '../hooks';
import { useRecurrenciOptions } from "../hooks/useRecurrenciOptions";

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

const INVOICE_PAYMENT_METHOD = [
    {
        id: 'credit_card',
        name: 'Tarjeta de credito'
    },
    {
        id: 'bank_transfer',
        name: 'Transferencia bancaria'
    },
    {
        id: 'apparta_pay',
        name: 'AppartaPay'
    },
    {
        id: 'manual_payment_invoice',
        name: 'Factura'
    },
]

const columns = ({ invoiceProfiles, cities, zonesTable, placesTable, onEdit, onRemove, payCommissionsFor }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
        width: 50
    },
    {
        title: "Dirección",
        dataIndex: "address",
        key: "address",
        sorter: true,
    },
    {
        title: "Ciudad",
        dataIndex: "city_id",
        key: "city_id",
        sorter: true,
        render: (value) => _.find(cities, ({ id }) => id === value)?.name || value
    },
    {
        title: "Perfil de Facturación",
        dataIndex: "invoice_profile_id",
        key: "invoice_profile_id",
        sorter: true,
        render: (value) => _.find(invoiceProfiles, ({ id }) => id === value)?.legal_name || value
    },
    {
        title: "Zona",
        dataIndex: "zone_id",
        key: "zone_id",
        sorter: true,
        render: (value) => _.find(zonesTable, ({ id }) => id === value)?.name || ''
    },
    {
        title: "Lugar",
        dataIndex: "place_id",
        key: "place_id",
        sorter: true,
        render: (value) => _.find(placesTable, ({ id }) => id === value)?.name || ''
    },
    {
        title: "Teléfono",
        dataIndex: "phone",
        key: "phone",
        sorter: true,
    },
    payCommissionsFor === 'reservation' ?
        {
            title: "Tarifa x Reserva",
            dataIndex: "commission_per_reservation",
            key: "commission_per_reservation",
            sorter: true,
        } : {
            title: "Tarifa x Comensal",
            dataIndex: "commission_per_person",
            key: "commission_per_person",
            sorter: true,
        },
    {
        title: "Ticket Promedio",
        dataIndex: "average_ticket",
        key: "average_ticket",
        sorter: true,
    },
    {
        title: "% cashback",
        dataIndex: "cashback_percentage",
        key: "cashback_percentage",
        sorter: true,
    },
    {
        title: "Cant min cashback",
        dataIndex: "cashback_min_amount",
        key: "cashback_min_amount",
        sorter: true,
    },
    {
        title: "Cant max cashback",
        dataIndex: "cashback_max_amount",
        key: "cashback_max_amount",
        sorter: true,
    },
    {
        title: "Posición",
        dataIndex: "position",
        key: "position",
        sorter: true,
    },
    {
        title: "Account Manager",
        dataIndex: "account_manager_user_id",
        key: "account_manager_user_id",
        sorter: true,
    },
    {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color={value === 'inactive' ? 'red' : 'orange'}>{value}</Tag>
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


const Branches = ({ establishment_id, invoiceProfiles, payCommissionsFor }) => {

    const establishmentService = getService('establishments-branchs');

    const [form] = Form.useForm();
    const selectedCityId = Form.useWatch('city_id', form);
    const selectedBranchId = Form.useWatch('id', form);
    const recurrenId = Form.useWatch('tmp_number_months_for_recurring_payment', form);
    const selectedBranchAppartaMenuLinktreeBackground = Form.useWatch('apparta_menu_linktree_background', form);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);
    const [selectedEstablishment, setSelectedEstablishment] = useState();

    const [cities, loadingCities] = useCities();
    const [zones, loadingZones] = useZones({ city_id: selectedCityId });
    const [zonesTable] = useZones({ city_id: undefined });
    const [places, loadingPlaces] = usePlaces({ city_id: selectedCityId });
    const [placesTable] = usePlaces({ city_id: undefined });
    const { recurrenciOptions } = useRecurrenciOptions();


    const onEdit = (record) => {
        setSelectedEstablishment(
            {
                ..._.mapValues({
                    ...record,
                    overwrite_first_billing_day: record?.overwrite_first_billing_day ? moment(record?.overwrite_first_billing_day) : null,
                    tmp_next_date_payment: record?.tmp_next_date_payment ? moment(record?.tmp_next_date_payment).utc() : null
                }, (value) => { if (value !== null) { return value; } })
            }
        );
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        const establishmentService = getService('establishments-branchs');
        await establishmentService.remove(id)
            .then(() => {
                message.success("Restaurante eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const handleUploadFinish = async (field, url, file, _id) => {
        establishmentService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                form.setFieldsValue(
                    {
                        ..._.mapValues(response, (value) => { if (value !== null) { return value; } })
                    }
                );
                setUpdateSource(!updateSource);
            })
            .catch((err) => message.error(err.message));
    };


    const formattValues = (values) => ({
        ...values,
        tmp_next_date_payment: values?.tmp_next_date_payment ? values?.tmp_next_date_payment?.format('YYYY-MM-DD') : values?.tmp_next_date_payment
    })

    const handleSubmit = async (err, data) => {
        if (err) return message.error(err);

        const { id, ...rest } = data;

        if (selectedBranchId) {
            await establishmentService.patch(selectedBranchId, formattValues({ ...rest }))
                .then(() => {
                    message.success("Sucursal actualizada!");
                    form.resetFields();
                    setSelectedEstablishment(undefined);
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await establishmentService.create(formattValues({ ...rest }))
                .then(() => {
                    message.success("Sucursal creada correctamente!");
                    form.resetFields();
                    setSelectedEstablishment(undefined);
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };


    return (
        <>
            <Grid
                source='establishments-branchs'
                filterDefaultValues={{
                    establishment_id,
                    $sort: {
                        id: 1,
                    },
                }}
                updateSource={updateSource}
                columns={columns({ invoiceProfiles, cities, zonesTable, placesTable, onEdit, onRemove, payCommissionsFor })}
                permitFetch={true}
                actions={{}}
                extra={
                    <div>
                        <RoundedButton
                            type="primary"
                            icon={<AiOutlinePlus />}
                            onClick={() => {
                                setDrawerVisible(true);
                                form.resetFields();
                                setSelectedEstablishment(undefined);
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
                    size='large'
                    placement="right"
                    title={`${selectedBranchId ? 'Editar' : 'Crear'} Sucursal`}
                    visible={drawerVisible}
                    onClose={() => {
                        form.resetFields();
                        setSelectedEstablishment(undefined);
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        form={form}
                        initialValues={selectedEstablishment}
                        textAcceptButton={`${selectedBranchId ? 'Editar' : 'Crear'}`}
                        noAcceptButtonBlock={true}
                        scrollToFirstError
                        allowNull={true}
                        onSubmit={handleSubmit}
                        onFieldsChange={(fieldsArray) => {
                            if (
                                _.some(
                                    fieldsArray,
                                    ({ name, value, ...rest }) =>
                                        _.includes(
                                            name,
                                            'tmp_number_months_for_recurring_payment',
                                        ) && value && (selectedEstablishment?.tmp_number_months_for_recurring_payment !== value),
                                )
                            ) {
                                form.setFieldValue('tmp_recurrence_payment_amount', null)
                            }
                        }}
                    >
                        <Input
                            type='hidden'
                            name='id'
                        />
                        {
                            !selectedBranchId &&
                            < Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishment_id}
                            />
                        }
                        <InputNumber
                            flex={0.5}
                            label='Account Manager User ID'
                            name='account_manager_user_id'
                        />
                        <Select
                            flex={0.5}
                            name='status'
                            label="Estado"
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
                            flex={0.5}
                            name='apparta_web_status'
                            label="Apparta web status"
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
                            flex={0.5}
                            name='table_management_status'
                            label="TMP status"
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
                            flex={0.5}
                            name='partners'
                            label="Partners"
                        >
                            <Select.Option
                                value={"true"}
                            >
                                True
                            </Select.Option>
                            <Select.Option
                                value={"false"}
                            >
                                False
                            </Select.Option>
                        </Select>
                        <Select
                            flex={0.5}
                            name='apparta_menu_status'
                            label="Menu status"
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
                            flex={0.5}
                            name='apparta_menu_popup'
                            label="Menu Popup"
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
                            flex={0.5}
                            loading={loadingCities}
                            name='city_id'
                            label="Ciudad"
                            validations={[{ required: true, message: 'Ciudad es requerida' }]}
                        >
                            {
                                _.map(cities, ({ id, name }, index) =>
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
                            flex={0.5}
                            loading={loadingZones}
                            name='zone_id'
                            label="Zona"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(zones, ({ id, name }, index) =>
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
                            flex={0.5}
                            loading={loadingPlaces}
                            name='place_id'
                            label="Lugar"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(places, ({ id, name }, index) =>
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
                            flex={0.5}
                            name='invoice_profile_id'
                            label="Perfil de Facturación"
                        >
                            {
                                _.map(invoiceProfiles, ({ id, legal_name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {legal_name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            flex={1}
                            name='invoice_payment_method'
                            label="Método de pago"
                        >
                            {
                                _.map(INVOICE_PAYMENT_METHOD, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Input
                            flex={0.5}
                            name='address'
                            label="Dirección"
                            validations={[{ required: true, message: 'Dirección es requerida' }]}
                        />
                        <Input
                            flex={0.5}
                            name='phone'
                            label="Teléfono"
                        />
                        {
                            payCommissionsFor === 'reservation' ? (
                                <InputNumber
                                    flex={0.5}
                                    name='commission_per_reservation'
                                    label="Tarifa x Reserva"
                                    validations={[{ required: true, message: 'Tarifa es requerida' }]}
                                />
                            ) : (
                                <InputNumber
                                    flex={0.5}
                                    name='commission_per_person'
                                    label="Tarifa x Comensal"
                                    validations={[{ required: true, message: 'Tarifa es requerida' }]}
                                />
                            )
                        }
                        <InputNumber
                            flex={0.5}
                            name='average_ticket'
                            label="Ticket Promedio"
                            validations={[{ required: true, message: 'Ticket es requerido' }]}
                        />
                        <InputNumber
                            flex={0.5}
                            name='position'
                            label="Posición"
                        />
                        <InputNumber
                            flex={0.5}
                            name='rating_score'
                            label="Rating: Del 1 al 5"
                        />
                        <InputNumber
                            flex={0.5}
                            name='rating_quantity'
                            label="Rating: Numero de personas"
                        />
                        <DatePicker
                            flex={0.5}
                            locale={locale}
                            showTime
                            name='overwrite_first_billing_day'
                            label='Fecha inicio facturación'
                            format='YYYY-MM-DD h:mm a'
                        />
                        <Input.TextArea
                            flex={1}
                            autoSize
                            name='description'
                            label="Descripción"
                        />
                        <Input.TextArea
                            flex={1}
                            autoSize
                            name='description_food_types'
                            label="Descripción Tipo Comida"
                        />
                       

                        <RichTextField
                            flex={1}
                            label="Descripción Característica"
                            name='description_features'
                            defaultValue={selectedEstablishment?.description_features}
                        />

                        <RichTextField
                            flex={1}
                            label="Horario"
                            name='description_schedule'
                            defaultValue={selectedEstablishment?.description_schedule}
                        />
                        <Input.TextArea
                            flex={1}
                            autoSize
                            name='terms'
                            label="Términos"
                        />
                        <InputNumber
                            flex={0.5}
                            name='lat'
                            label="Latitud"
                        />
                        <InputNumber
                            flex={0.5}
                            name='lng'
                            label="Longitud"
                        />
                        <InputNumber
                            flex={0.5}
                            label='Menu max price'
                            name="menu_max_price"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        <InputNumber
                            flex={0.5}
                            label='Menu min price'
                            name="menu_min_price"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        <InputNumber
                            flex={0.5}
                            min={0}
                            name='cashback_percentage'
                            label="Porcentaje de cashback"
                        />
                        <InputNumber
                            flex={0.5}
                            min={0}
                            name='cashback_min_amount'
                            label="Cantidad minima de cashback"
                        />
                        <InputNumber
                            flex={0.5}
                            min={0}
                            name='cashback_max_amount'
                            label="Cantidad maxima de cashback"
                        />
                        <InputNumber
                            flex={0.5}
                            min={0}
                            name='fidelizations_multiplier'
                            label="Multiplicador de puntos fidelización"
                        />
                        <Select
                            flex={0.5}
                            name='apparta_menu_linktree_status'
                            label="Estado menu linkTree"
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
                        <Select
                            flex={0.5}
                            name='tmp_number_months_for_recurring_payment'
                            label="Recurrencia"
                        // validations={[
                        //     {
                        //         required: true,
                        //         message: 'Recurrencia es requerido',
                        //     },
                        // ]}
                        >
                            {
                                _.map(recurrenciOptions, ({ recurrence, amount }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={recurrence}
                                    >
                                        {recurrence} meses - ${numeral(amount).format('0,0')}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <DatePicker
                            flex={0.5}
                            locale={locale}
                            name='tmp_next_date_payment'
                            label='Fecha proximo pago'
                            format='YYYY-MM-DD'
                        />
                        <InputNumber
                            flex={0.5}
                            label={`Valor manual ${recurrenId} ${recurrenId === 1 ? 'mes' : 'meses'}`}
                            name="tmp_recurrence_payment_amount"
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                        {/*<InputNumber*/}
                        {/*    flex={0.5}*/}
                        {/*    min={0}*/}
                        {/*    name='tmp_recurrence_payment_amount'*/}
                        {/*    label={`Valor manual ${recurrenId} meses`}*/}
                        {/*/>*/}
                        {/*<DatePicker*/}
                        {/*  record?.tmp_next_date_payment  flex={0.5}*/}
                        {/*    locale={locale}*/}
                        {/*    showTime*/}
                        {/*    name='tmp_next_date_payment'*/}
                        {/*    label='Fecha proximo pago'*/}
                        {/*    format='YYYY-MM-DD'*/}
                        {/*/>*/}
                        <Select
                            flex={0.5}
                            name='google_booking_status'
                            label="Estado google"
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
                            flex={0.5}
                            name='mozrest_integration_status'
                            label="Estado integración mozrest"
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
                            autoSize
                            name='google_booking_link'
                            label="Enlace de reserva de Google externo"
                        />
                        <Input
                            flex={1}
                            name='apparta_menu_linktree_description'
                            label="Descripción LinkTree"
                        />
                        {
                            selectedEstablishment?.mozrest_integration_response ? (
                                <div flex={1}>
                                    <Typography.Title level={5}>
                                        Link integración mozrest
                                    </Typography.Title>
                                    <Typography.Paragraph copyable>
                                        {
                                            JSON.parse(selectedEstablishment?.mozrest_integration_response || {})?.fbInstallLink
                                        }
                                    </Typography.Paragraph>
                                </div>
                            ) : null
                        }

                        {
                            selectedBranchId && selectedBranchAppartaMenuLinktreeBackground &&
                            <GalleryUploader
                                refresh={(e, response) => {
                                    form.setFieldsValue(
                                        {
                                            ..._.mapValues(response, (value) => { if (value !== null) { return value; } })
                                        }
                                    );
                                    setUpdateSource(!updateSource);
                                }}
                                size="large"
                                defaultImage={selectedBranchAppartaMenuLinktreeBackground}
                                source="apparta_menu_linktree_background"
                                withCropper={true}
                                setterVisibleCropper={() => { }}
                                reference="establishments-branchs"
                                _id={selectedBranchId}
                                path={`apparta_menu_linktree_background/${selectedBranchId}/`}
                            />
                        }
                        {
                            selectedBranchId &&
                            <FileUploader
                                flex={1}
                                preview={false}
                                path={`apparta_menu_linktree_background/${selectedBranchId}/`}
                                name='apparta_menu_linktree_background'
                                source='apparta_menu_linktree_background'
                                style={{ borderRadius: '0.5rem' }}
                                onFinish={(url, file) =>
                                    handleUploadFinish("apparta_menu_linktree_background", url, file, selectedBranchId)
                                }
                                title='Fondo LinkTree'
                            />
                        }

                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default Branches;
