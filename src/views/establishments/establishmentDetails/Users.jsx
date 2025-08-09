import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { Button, Checkbox, Drawer, Form, Input, InputNumber, message, Select } from 'antd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import AsyncButton from '../../../components/asyncButton';
import { Grid } from '../../../components/com';
import { SimpleForm } from '../../../components/com/form/';
import { RoundedButton } from '../../../components/com/grid/Styles';
import { getService } from '../../../services';
import { useEstablishmentBranches } from '../hooks';

const roles = [

    {
        name: "Empleado",
        id: "employee"
    },
    {
        name: "Super Administrador",
        id: "superAdmin"
    },
    {
        name: "Kam",
        id: "kam"
    },

];

const permissions = [

    {
        name: "Global",
        id: "global"
    },
    {
        name: "Especifico",
        id: "specific"
    },

];

const columns = ({ establishmentBranches, onEdit, onRemove }) => [
    {
        title: "Id",
        dataIndex: "user_id",
        key: "user_id",
        sorter: true,
    },
    {
        title: "Usuario",
        dataIndex: "user_id",
        key: "user_id",
        sorter: true,
        render: (value, record) => record?.user?.first_name + ' ' + record?.user?.last_name
    },
    {
        title: "Rol",
        dataIndex: "role",
        key: "role",
        sorter: true,
        render: (value) => _.find(roles, ({ id }) => id === value)?.name || value
    },
    {
        title: "Sucursal",
        dataIndex: "establishment_branch_id",
        key: "establishment_branch_id",
        sorter: true,
        render: (value) => _.find(establishmentBranches, ({ id }) => id === value)?.address || ''
    },
    {
        title: "Permisos",
        dataIndex: "permission",
        key: "permission",
        sorter: true,
        render: (value) => _.find(permissions, ({ id }) => id === value)?.name || value
    },
    {
        title: "Acciones",
        dataIndex: 'id',
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

const Users = ({ establishment_id }) => {

    const [form] = Form.useForm();
    const refererCodeToEstablishment = Form.useWatch('referer_code_to_establishment', form);
    const role = Form.useWatch('role', form);
    const permission = Form.useWatch('permission', form);

    const establishmentUsersService = getService('establishments-users');
    const usersService = getService('users');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    const [establishmentBranches] = useEstablishmentBranches({ establishment_id });

    const onEdit = (record) => {
        const { referer_code_to_establishment, ...rest } = record;
        setSelectedUser({ ...rest, referer_code_to_establishment: referer_code_to_establishment === 'true' ? true : false, });
        setDrawerVisible(true);
    }

    const onRemove = async ({ id }) => {
        await establishmentUsersService.remove(id)
            .then(() => {
                message.success("Usuario eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    const handleSubmit = async (err, data) => {
        const { referral_code, referer_code_to_establishment, ...rest } = data;
        const newData = {
            ...rest,
            referer_code_to_establishment: referer_code_to_establishment === true ? 'true' : referer_code_to_establishment === false ? 'false' :  referer_code_to_establishment,
        };

        if (err) return message.error(err);
        if (selectedUser && selectedUser.id) {

            await establishmentUsersService.patch(selectedUser.id, newData)
                .then(async () => {

                    if (selectedUser?.user?.referral_code !== referral_code && referral_code) {
                        await usersService.patch(selectedUser?.user?.id, { referral_code })
                            .catch(() => {
                                message.error("No se pudo actualizar el código de referido!");
                            })
                    }

                    message.success("Usuario actualizado!");
                    setDrawerVisible(false);
                    setSelectedUser();
                    form.resetFields();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await establishmentUsersService.create(newData)
                .then(() => {
                    message.success("Usuario creado!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                    form.resetFields();
                })
                .catch(err => message.error(err.message));
        }
    }

    return (
        <>
            <Grid
                source='establishments-users'
                filterDefaultValues={{
                    establishment_id,
                    $sort: {
                        id: 1,
                    }
                }}
                updateSource={updateSource}
                columns={columns({ establishmentBranches, onEdit, onRemove })}
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
                    size='middle'
                    placement="right"
                    title={`${selectedUser?.id ? 'Editar' : 'Crear'} Usuario`}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedUser();
                        form.resetFields();
                    }}
                >
                    <SimpleForm
                        form={form}
                        textAcceptButton={`${selectedUser?.id ? 'Actualizar' : 'Crear'}`}
                        scrollToFirstError
                        initialValues={selectedUser?.id ? { ...selectedUser, referral_code: selectedUser?.user?.referral_code } : selectedUser}
                        onSubmit={handleSubmit}
                    >
                        {
                            !selectedUser?.id &&
                            < Input
                                type="hidden"
                                name='establishment_id'
                                initial={establishment_id}
                            />
                        }
                        <InputNumber
                            flex={1}
                            label='Usuario ID'
                            name='user_id'
                            size='large'
                            validations={[{ required: true, message: 'Usuario ID es requerido' }]}

                        />
                        <Select
                            flex={1}
                            name='role'
                            label="Rol"
                            size='large'
                            validations={[{ required: true, message: 'Rol es requerido' }]}
                        >
                            {
                                _.map(roles, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        {
                            role === roles[0].id &&
                            <Select
                                flex={1}
                                name='permission'
                                label="Permisos"
                                size='large'
                                validations={[{ required: true, message: 'Permisos es requerido' }]}>
                                {
                                    _.map(permissions, ({ id, name }, index) =>
                                        <Select.Option
                                            key={index}
                                            value={id}
                                        >
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        }
                        {
                            role !== roles[1].id && permission === permissions[1].id &&
                            <Select
                                flex={1}
                                name='establishment_branch_id'
                                label="Sucursal"
                                size='large'
                                validations={[{ required: true, message: 'Sucursal es requerida' }]}
                            >
                                {
                                    _.map(establishmentBranches, ({ id, address }, index) =>
                                        <Select.Option
                                            key={index}
                                            value={id}
                                        >
                                            {address}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        }

                        {
                            selectedUser?.id ? (
                                <Checkbox
                                    flex={1}
                                    valuePropName="checked"
                                    name="referer_code_to_establishment"
                                >
                                    Referer code to establishment
                                </Checkbox>
                            ) : null
                        }

                        {
                            refererCodeToEstablishment && selectedUser?.id ? (

                                <Input
                                    flex={1}
                                    label='Codigo de referido'
                                    name='referral_code'
                                    size='large'
                                    validations={[{ required: true, message: 'Id del benefio' }]}

                                />

                            ) : null
                        }
                        {
                            refererCodeToEstablishment && selectedUser?.id ? (

                                <InputNumber
                                    flex={1}
                                    label='Id benefio de referido'
                                    name='referer_code_pay_benefit_id'
                                    size='large'
                                    validations={[{ required: true, message: 'Id del benefio' }]}

                                />

                            ) : null
                        }
                    </SimpleForm>
                </Drawer>
            }
        </>
    );
}

export default Users;