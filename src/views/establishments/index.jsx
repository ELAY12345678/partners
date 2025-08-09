import React, { useState } from 'react';
import { Avatar, Button, Drawer, Input, Layout, message, Select, Tag } from 'antd';
import { S3_PATH_IMAGE_HANDLER } from '../../constants';
import { Grid } from '../../components/com';
import { useCities } from '../../hooks/useCities';
import SelectField from "../../components/com/form/SelectField";
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { SimpleForm } from '../../components/com/form/';
import _ from 'lodash';
import { RoundedButton } from '../../components/com/grid/Styles';
import { Link } from 'react-router-dom';
import AsyncButton from '../../components/asyncButton';
import { getService } from '../../services';

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

const columns = ({ onRemove }) => [
    {
        title: "Id",
        dataIndex: "id",
        key: "id",
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "logo_path",
        key: "logo_path",
        render: (value) =>
            <Avatar
                size="large"
                alt={'Avatar'}
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 64,
                    height: 64,
                })}`}
            />
    },
    {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
        sorter: true,
    },
    {
        title: "Puntuación",
        dataIndex: "total_rating_score",
        key: "total_rating_score",
        sorter: true,
        render: (value) => parseFloat(value).toFixed(1)
    },
    {
        title: "Rating",
        dataIndex: "total_rating_quantity",
        key: "total_rating_quantity",
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
        dataIndex: "id",
        key: "_id",
        render: (id) => <>
            <Link
                to={`/dashboard/management/establishments/${id}`}
            >
                <Button type='text' shape='circle' icon={<AiOutlineEye />} />
            </Link>
            <AsyncButton
                type="link"
                onClick={() => onRemove({ id })}
                icon={<AiOutlineDelete />}
                confirmText="Desea eliminar?"
            >
            </AsyncButton>
        </>

    },
];

const Establishments = () => {

    const [cities, loadingCities] = useCities();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [updateSource, setUpdateSource] = useState(false);

    const onRemove = async ({ id }) => {
        const establishmentService = getService('establishments');
        await establishmentService.remove(id)
            .then(() => {
                message.success("Restaurante eliminado!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='establishments'
                searchField="q"
                searchText="Restaurante..."
                search={true}
                updateSource={updateSource}
                filterDefaultValues={{
                    $sort: {
                        id: 1,
                    },
                    $select: ['id', 'name', 'logo_path', 'total_rating_score', 'total_rating_quantity', 'status'],
                    $client: {
                        skipJoins: true
                    }
                }}
                columns={columns({ onRemove })}
                permitFetch={true}
                actions={{}}
                filters={
                    <>
                        <SelectField
                            alwaysOn
                            loading={loadingCities}
                            source="q_establishmnet_branch_city_id"
                            name="q_establishmnet_branch_city_id"
                            label="q_establishmnet_branch_city_id"
                            placeholder="Ciudad"
                            allowEmpty
                            choices={cities}
                            size="medium"
                            style={{
                                width: '15em'
                            }}
                        />
                    </>
                }
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
                    title={'Crear Restaurante'}
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                    }}
                >
                    <SimpleForm
                        source='establishments'
                        textAcceptButton='Crear'
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setUpdateSource(!updateSource);
                        }}
                    >
                        <Input
                            flex={1}
                            name='name'
                            label='Nombre'
                            validations={[
                                {
                                    required: true,
                                    message: `Nombre es requerido`
                                }
                            ]}
                        />
                        <Select
                            flex={1}
                            name='status'
                            label="Estado"
                            size='large'
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
                    </SimpleForm>
                </Drawer>
            }
        </Layout.Content>
    );
}

export default Establishments;