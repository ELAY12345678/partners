import { Button, Drawer, Form, Input, message, Select } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../../components/asyncButton';
import { Grid } from '../../../components/com';
import { SimpleForm } from '../../../components/com/form/';
import { RoundedButton } from '../../../components/com/grid/Styles';
import { useCities } from '../../../hooks/useCities';
import { getService } from '../../../services';

const columns = ({ cities, onEdit, onRemove }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Nit",
        dataIndex: "nit",
        key: "nit",
        sorter: true,
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
        title: "Nombre legal",
        dataIndex: "legal_name",
        key: "legal_name",
        sorter: true,
    },
    {
        title: "Teléfono",
        dataIndex: "phone",
        key: "phone",
        sorter: true,
    },
    {
        title: "Correo",
        dataIndex: "email",
        key: "email",
        sorter: true,
    },
    {
        title: "Nombre Contacto",
        dataIndex: "contact_person_first_name",
        key: "contact_person_first_name",
        sorter: true,
    },
    {
        title: "Apellido Contacto",
        dataIndex: "contact_person_last_name",
        key: "contact_person_last_name",
        sorter: true,
    },
    {
        title: "Acciones",
        dataIndex: 'id',
        render: (id,records) =>
            <>
                <Button
                    type="text"
                    onClick={() => onEdit(records)}
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

const InvoiceProfiles = ({ establishment_id, getInvoiceProfiles }) => {
    const [form] = Form.useForm();
    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState();
    const [initialValues, setinitialValues] = useState({})
    const [isNewProfile, setisNewProfile] = useState(false)
    const invoiceProfileService = getService('invoice-profiles');
    const [cities, loadingCities] = useCities();

    const onEdit = (record) => {
        setSelectedProfile(record);
        form.setFieldsValue({
            ...record
        })
        setDrawerVisible(true);
    };

    const getInvoiceProfilesById = async (nit) => {
        await invoiceProfileService.find({
            query: {
                // establishment_id,
                $limit: 1,
                $sort: {
                    createdAt: -1
                },
                nit
            }
        }).then(({ data }) => {
            if((data || []).length){
                console.log('data?.[0]data?.[0]',data?.[0])
                setisNewProfile(true)
                // setSelectedProfile({...data?.[0]})
                form.setFieldsValue({
                    ...data?.[0],
                    establishment_id: establishment_id,
                    id: undefined
                })
            }else{
                form.resetFields();
                form.setFieldsValue({
                    "nit": nit,
                })
                setisNewProfile(false)
            }
        }).catch((err) => {
            setisNewProfile(false)
            message.error(err.message);
        })
    }

    const onRemove = async ({ id }) => {
        const establishmentService = getService('invoice-profiles');
        await establishmentService.remove(id)
            .then(() => {
                message.success("Perfil eliminado!");
                setUpdateSource(!updateSource);
                getInvoiceProfiles();
            })
            .catch(err => message.error(err.message));
    };

    return (
        <>
            <Grid
                source='invoice-profiles'
                filterDefaultValues={{
                    establishment_id,
                    $sort: {
                        id: 1,
                    }
                }}
                withUniq={true}
                updateSource={updateSource}
                columns={columns({ cities, onEdit, onRemove })}
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
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    destroyOnClose
                    title={`${selectedProfile ? 'Editar' : 'Crear'} Perfil`}
                    visible={drawerVisible}
                    onClose={() => {
                        form.resetFields();
                        setTimeout(() => {
                            setDrawerVisible(false);
                            setSelectedProfile();
                            setisNewProfile(false)
                        }, 500);
                    }}
                >
                    <SimpleForm
                        source='invoice-profiles'
                        textAcceptButton={`${selectedProfile ? 'Actualizar' : 'Crear'}`}
                        scrollToFirstError
                        id={selectedProfile?.id}
                        initialValues={selectedProfile}
                        isNew={isNewProfile}
                        form={form}
                        onSubmit={() => {
                            form.resetFields();
                            setTimeout(() => {
                                setDrawerVisible(false);
                                setUpdateSource(!updateSource);
                                getInvoiceProfiles();
                                setSelectedProfile();
                            }, 500)
                        }}
                    >
                        {
                            !selectedProfile &&
                            <Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishment_id}
                            />
                        }
                        <Input
                            flex={0.5}
                            size='large'
                            label='Nit'
                            name='nit'
                            validations={[{ required: true, message: 'Nit es requerido' }]}
                            onBlurCapture={(e) => getInvoiceProfilesById(e.target.value)}
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            label='Dirección'
                            name='address'
                            validations={[{ required: true, message: 'Dirección es requerida' }]}
                        />
                        <Select
                            flex={0.5}
                            size='large'
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
                        <Input
                            flex={0.5}
                            size='large'
                            label='Nombre Legal'
                            name='legal_name'
                            validations={[{ required: true, message: 'Nombre Legal es requerido' }]}
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            label='Teléfono'
                            name='phone'
                            validations={[{ required: true, message: 'Teléfono requerido' }]}
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            label='Correo'
                            name='email'
                            validations={[{ required: true, message: 'Correo requerido' }]}
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            label='Nombre contacto'
                            name='contact_person_first_name'
                            validations={[{ required: true, message: 'Nombre requerido' }]}
                        />
                        <Input
                            flex={0.5}
                            size='large'
                            label='Apellido contacto'
                            name='contact_person_last_name'
                            validations={[{ required: true, message: 'Apellido requerido' }]}
                        />
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default InvoiceProfiles;