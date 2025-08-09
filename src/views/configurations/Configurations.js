import React from 'react';
import qs from 'qs';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Button, Layout } from 'antd';
import { Grid } from '../../components/com';
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';

const RoundedButton = styled(Button)`
  border-radius: 20px !important;
`;
const Configurations = (props) => {
    const navigate = useNavigate();
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
        },
        {
            title: "Nombre",
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: "Clave",
            dataIndex: 'key',
            sorter: true,
        },
        {
            title: "Valor",
            dataIndex: 'value',
            sorter: true,
        },
    ];

    const handleAdd = (id) => {
        navigate(`/dashboard/management/configurations/${id ? id : "create"}`);
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                custom={true}
                filterDefaultValues={{
                    $skip: 50
                }}
                permitFetch={true}
                role={"admin"}
                source={"configurations"}
                columns={columns}
                extra={
                    <div>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
                            onClick={() => handleAdd()}
                        >
                            Agregar
                        </RoundedButton>
                    </div>
                }
                actions={{
                    extra: (
                        <div>
                            <Button
                                icon={<AiOutlineEdit />}
                                type={"link"}
                                onClick={(record) => handleAdd(record.id)}
                            />
                        </div>
                    ),
                }}
            />
        </Layout.Content>
    )
}

export default Configurations;