import { Button, Drawer, InputNumber, Select, Tag } from 'antd';
import _ from 'lodash';
import numeral from 'numeral';
import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { Grid } from '../../../components/com';
import { SimpleForm } from '../../../components/com/form/';

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

const columns = ({ onEdit }) => [
    {
        title: "Sucursal",
        dataIndex: "establishment_branch",
        key: "establishment_branch",
        render: (establishment_branch) => establishment_branch?.address
    },
    {
        title: "Porcentaje de comisión",
        dataIndex: "commission_percentage",
        key: "commission_percentage",
        render: (value) => value || 'Porcentaje no definido'
    },
    {
        title: "Comisión fija",
        dataIndex: "commission_fixed",
        key: "commission_fixed",
        render: (value) => `$ ${numeral(value || "").format("0,0")}`
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
            <Button
                type="text"
                onClick={() => onEdit(record)}
                icon={<AiOutlineEdit />}
            />
    },
]

const AppartaPay = ({ establishment_id }) => {

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedAppartaPay, setSelectedAppartaPay] = useState();

    const onEdit = (record) => {
        setSelectedAppartaPay(record);
        setDrawerVisible(true);
    }


    return (
        <>
            <Grid
                source='pay-accounts'
                filterDefaultValues={{
                    establishment_id,
                    $sort: {
                        id: 1,
                    }
                }}
                updateSource={updateSource}
                columns={columns({ onEdit })}
                permitFetch={true}
                actions={{}}
            />
            {
                drawerVisible
                &&
                <Drawer
                    placement="right"
                    title={'Editar'}
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedAppartaPay();
                    }}
                >
                    <SimpleForm
                        source='pay-accounts'
                        textAcceptButton={'Actualizar'}
                        scrollToFirstError
                        initialValues={selectedAppartaPay}
                        id={selectedAppartaPay?.id}
                        onSubmit={() => {
                            setDrawerVisible(false);
                            setUpdateSource(!updateSource);
                            setSelectedAppartaPay();
                        }}
                    >
                        <InputNumber
                            flex={1}
                            size="large"
                            label='Porcentaje de comisión'
                            name='commission_percentage'
                            validations={[{ required: true, message: 'Porcentaje de comisión es requerido' }]}
                        />
                        <InputNumber
                            flex={1}
                            size="large"
                            label='Comisión fija'
                            name='commission_fixed'
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            validations={[{ required: true, message: 'Comisión fija' }]}
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
        </>
    );
}

export default AppartaPay;