import React from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Button, Image, Layout } from 'antd';
import { Grid } from '../../components/com';
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';

const RoundedButton = styled(Button)`
  border-radius: 20px !important;
`;

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        sorter: true,
    },
    {
        title: "Titulo",
        dataIndex: 'title',
        sorter: true,
    },
    {
        title: "Foto",
        dataIndex: "image",
        render: (value) =>
            value && <Image
                size="large"
                alt="Banner"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                    url: value,
                    width: 90,
                    height: 35,
                })}`
                }
                preview={{
                    src: `${URL_S3}${value}`
                }}
            />
    },
    {
        title: "Estado",
        dataIndex: 'status',
        sorter: true,
    },
];

const Configurations = (props) => {
    const navigate = useNavigate();

    const handleAdd = (id) => {
        navigate(`/dashboard/management/blogs/${id ? id : "create"}`);
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
                source={"blog-posts"}
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