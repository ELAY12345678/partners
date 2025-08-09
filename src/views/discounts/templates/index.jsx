import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Col, Divider, Layout, Row, Typography, Select, message } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import iconDiscount from '../../../sources/icons/discount2.svg';
import { useSelector } from 'react-redux';
import { Grid, MyModal } from '../../../components/com';
import { Box } from '../../../components';
import { getService } from '../../../services';
import { DinamicForm } from '../../../components/com/form/DinamicForm';
import { useTemplates } from './hooks/useTemplates';

import editIcon from '../../../sources/icons/edit.svg';
import deleteIcon from '../../../sources/icons/delete.svg';
import AsyncButton from '../../../components/asyncButton';

import FromTemplate from './fromTemplate';

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const columns = ({ templates, handleChangeTemplate, isAdmin }) => [
    {
        title: "Sucursal",
        dataIndex: "address",
    },
    {
        title: "Plantilla asociada",
        dataIndex: "discount_template_id",
        render: (value, record) =>
            isAdmin ?
                <Select
                    bordered={false}
                    style={{ minWidth: '20rem' }}
                    value={_.find(templates, ({ id }) => id === value)?.name || 'Ninguna'}
                    onChange={(value) => handleChangeTemplate({ id: record.id, discount_template_id: value })}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {
                        _.map(templates, ({ id, name }, index) =>
                            <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        )
                    }
                </Select>
                : _.find(templates, ({ id }) => id === value)?.name || 'Ninguna'
    }
];

const Templates = () => {

    const establishmentBranchService = getService('establishments-branchs');
    const templatesService = getService('discount-templates');

    const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);
    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const permissionsv2 = useSelector(({ appReducer }) => appReducer?.user?.permissionsv2);

    const [templates, getTemplates] = useTemplates({ establishment_id: establishmentFilters.establishment_id });

    const [modalVisible, setModalVisible] = useState();
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [updateSource, setUpdateSource] = useState(false);

    const branchsIdPermissions = (permissionsv2) => {
        const permissionsEstablishments = permissionsv2.filter(
            (it) => it.type === 'establishments',
        );

        const permissionsEstablishmentsBranchs = permissionsEstablishments?.map(
            (permissionEstablishment) => {
                if (permissionEstablishment.establishment_id === Number(establishmentFilters.establishment_id))
                    return (
                        permissionEstablishment?.establishments_branchs?.map(
                            (branch) => branch.id,
                        )
                    )
            }
        );
        return _.flattenDeep(permissionsEstablishmentsBranchs)
    };

    const handleChangeTemplate = ({ id, discount_template_id }) => {
        establishmentBranchService.patch(id, {
            discount_template_id
        })
            .then(() => {
                setUpdateSource(!updateSource);
                message.success('Cambio de platilla exitoso!');
            })
            .catch((err) => message.error('No se cambio la plantilla! ' + err?.message))
    };

    const onRemoveTemplate = async ({ id }) => {
        await templatesService.remove(id)
            .then(() => {
                getTemplates();
                setSelectedTemplate();
                message.success('Plantilla eliminada!');
            })
            .catch((err) => message.error('No se pudo eliminar! ' + err?.message))
    };

    useEffect(() => {
        setSelectedTemplate();
    }, [establishmentFilters])

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
                            Plantillas de descuentos
                        </Typography.Title>
                    </Col>
                </Row>
                <Divider style={{ background: 'transparent', borderTop: 0 }} />
            </Row>
            <Row>
                <Typography.Title level={5} >
                    Sucursales
                </Typography.Title>
            </Row>
            {
                establishmentFilters.establishment_id ? (
                    <Grid
                        filterDefaultValues={{
                            establishment_id: establishmentFilters.establishment_id,
                            id: userRole === USERS_ROLES.admin ? undefined : { $in: branchsIdPermissions(permissionsv2) },
                            $sort: {
                                address: 1
                            }
                        }}
                        columns={columns({ templates, handleChangeTemplate, isAdmin: userRole === USERS_ROLES.admin })}
                        source={"establishments-branchs"}
                        permitFetch={!!(establishmentFilters.establishment_id)}
                        actions={{}}
                        updateSource={updateSource}
                    />
                ) : (
                    <Box>
                        *Selecciona una dirección para ver los registros*
                    </Box>
                )
            }
            <Divider style={{ background: 'transparent', borderTop: 0 }} />
            <Row justify="space-between">
                <Col>
                    <Typography.Title level={5} >
                        Plantilas
                    </Typography.Title>
                </Col>
                {
                    userRole === USERS_ROLES.admin &&
                    <Col>
                        <Button
                            size='large'
                            type='primary'
                            block
                            icon={<AiOutlinePlus />}
                            style={{ borderRadius: '0.5rem' }}
                            disabled={!(establishmentFilters.establishment_id)}
                            onClick={() => setModalVisible(true)}
                        >
                            Crear nueva plantilla
                        </Button>
                    </Col>
                }
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Box>
                <Col span={24}>
                    <Row gutter={16}>
                        <Col>
                            <Select
                                placeholder={`Seleccione plantilla para ${userRole === USERS_ROLES.admin ? 'editar' : 'ver'}`}
                                style={{ minWidth: '18rem' }}
                                onChange={(value) => setSelectedTemplate(value)}
                                value={selectedTemplate}
                                disabled={!(establishmentFilters.establishment_id)}
                            >
                                <Select.Option value={null}>
                                    Ninguna
                                </Select.Option>
                                {
                                    _.map(_.filter(templates, ({ type }) => type === 'establishment'), ({ id, name }, index) =>
                                        <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        </Col>
                        {
                            userRole === USERS_ROLES.admin && (<>
                                <Col>
                                    <Button type='text' icon={<img src={editIcon} alt='Editar' />} disabled={!selectedTemplate} />
                                </Col>
                                <Col>
                                    <AsyncButton
                                        type='text'
                                        confirmText='Esta seguro de eliminar esta plantilla?'
                                        icon={<img src={deleteIcon} alt='Eliminar' />}
                                        disabled={!selectedTemplate}
                                        onClick={() => onRemoveTemplate({ id: selectedTemplate })}
                                    />
                                </Col>
                            </>)
                        }
                    </Row>
                </Col>
                {
                    selectedTemplate &&
                    <Col span={24}>
                        <FromTemplate
                            selectedTemplate={selectedTemplate}
                            establishment_id={establishmentFilters.establishment_id}
                            isAdmin={userRole === USERS_ROLES.admin}
                        />
                    </Col>
                }
            </Box>
            <MyModal
                title='Crear nueva plantilla'
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
            >
                <DinamicForm
                    source="discount-templates"
                    textAcceptButton='Crear'
                    fields={[
                        {
                            name: "establishment_id",
                            xtype: "hidden",
                            initial: establishmentFilters.establishment_id
                        },
                        {
                            name: "type",
                            xtype: "hidden",
                            initial: 'establishment'
                        },
                        {
                            flex: 1,
                            name: "name",
                            xtype: "textfield",
                            label: "Escribe un nombre para tu plantilla",
                            placeholder: "Ej: Master Discount",
                            style: { borderRadius: '0.5rem' },
                            validations: [{
                                required: true,
                                message: `El Nombre es requerido`
                            }],
                        }
                    ]}
                    onSubmit={(err, record) => {
                        getTemplates();
                        setModalVisible(false);
                    }}
                />
            </MyModal>
        </Layout.Content>
    );
}

export default Templates;