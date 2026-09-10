import { Button, Drawer, Input, InputNumber, Layout, message, Select, Tag } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../components/asyncButton';
import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form';
import { RoundedButton } from '../../components/com/grid/Styles';
import { useContries } from '../../hooks/useContries';
import { getService } from '../../services';
import numeral from 'numeral';

const CHANNELS = [
    {
        id: "whatsapp",
        name: "WhatsApp",
    },
    {
        id: "sms",
        name: "SMS",
    },
    {
        id: "email",
        name: "Email",
    },
];

const CURRENCIES = [
    {
        id: "USD",
        name: "USD - Dólar estadounidense",
    },
    {
        id: "COP",
        name: "COP - Peso colombiano",
    },
    {
        id: "ARS",
        name: "ARS - Peso argentino",
    },
    {
        id: "CLP",
        name: "CLP - Peso chileno",
    },
    {
        id: "MXN",
        name: "MXN - Peso mexicano",
    },
    {
        id: "PEN",
        name: "PEN - Sol peruano",
    },
    {
        id: "VEF",
        name: "VEF - Bolívar venezolano",
    },
]

const columns = ({ onEdit, onRemove }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
    },
    {
        dataIndex: "currency",
        key: "currency",
        title: "Moneda",
        sorter: true,
        render: (value) => _.find(CURRENCIES, ({ id }) => value === id)?.name || value || '-'
    },
    {
        dataIndex: "channel",
        key: "channel",
        title: "Canal",
        sorter: true,
    },
    {
        dataIndex: "price",
        key: "price",
        title: "Precio",
        sorter: true,
        render: (value) => value   ? numeral(value).format('0,0') : '-'
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

const TableCampaignMessagingPricing = () => {

    const zonesService = getService('table-campaign-messaging-pricing');
    
    const { countries, loadingCountries } = useContries();

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedZone, setSelectedZone] = useState();
    const [updateSource, setUpdateSource] = useState(false);


    const onEdit = (record) => {
        setSelectedZone(record);
        setDrawerVisible(true);
    };

    const onRemove = async ({ id }) => {
        await zonesService.remove(id)
            .then(() => {
                message.success("Zona eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la zona! ' + error?.message)
            )
    };

    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (selectedZone && selectedZone.id) {
            await zonesService.patch(selectedZone.id, data)
                .then(() => {
                    message.success("Zona actualizada!");
                    setSelectedZone();
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await zonesService.create(data)
                .then(() => {
                    message.success("Zona creada correctamente!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='table-campaign-messaging-pricing'
                filterDefaultValues={{
                    $sort: {
                        id: 1
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit, onRemove })}
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
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={`${selectedZone ? 'Editar' : 'Crear'} Zona`}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedZone();
                    }}
                >
                    <SimpleForm
                        textAcceptButton={'Guardar'}
                        initialValues={selectedZone}
                        onSubmit={handleSubmit}
                    >
                         <Select
                            flex={0.5}
                            name='currency'
                            label="Moneda"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Moneda es requerida',
                                },
                            ]}
                        >
                            {
                                _.map(CURRENCIES, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>

                        <InputNumber
                            flex={0.5}
                            size='large'
                            name='price'
                            label='Precio'
                            min={0}
                            max={1000000}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            validations={[
                                {
                                    required: true,
                                    message: `Precio es requerido`
                                }
                            ]}
                        />
                            <Select
                            flex={0.5}
                            loading={loadingCountries}
                            name='country_code'
                            label="País"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'País es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(countries, ({ iso_code_2, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={iso_code_2}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            flex={0.5}
                            name='channel'
                            label="Canal"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Canal es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(CHANNELS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select> 
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default TableCampaignMessagingPricing;