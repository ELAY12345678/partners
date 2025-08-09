import React from 'react';
import { Layout } from 'antd';
import { Grid } from '../../components/com';

const columns = [
    {
        key: 'id',
        dataIndex: "id",
        title: "Id",
        sorter: true,
    },
    {
        key: 'reservation_id',
        dataIndex: "reservation_id",
        title: "Reservación Id",
        sorter: true,
    },
    {
        key: 'user_id',
        dataIndex: "user_id",
        title: "Usuario Id",
        sorter: true,
    },
    {
        key: 'establishment_id',
        dataIndex: "establishment_id",
        title: "Restaurante",
        sorter: true,
    },
    {
        key: 'establishment_branch_id',
        dataIndex: "establishment_branch_id",
        title: "Sucursal",
        sorter: true,
    },
    {
        key: 'score',
        dataIndex: "score",
        title: "Calificación",
        sorter: true,
    },
    {
        key: 'tip',
        dataIndex: "tip",
        title: "Propina",
        sorter: true,
    },
    {
        key: 'comment',
        dataIndex: "comment",
        title: "Comentario",
    },
]

const UsersRatings = () => {
    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source='establishments-users-ratings'
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                columns={columns}
                actions={{}}
            />
        </Layout.Content>
    );
}

export default UsersRatings;