import React from 'react';
import { InputNumber, Layout } from 'antd';
import { Grid } from '../../components/com';
import _moment from 'moment-timezone';

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        sorter: true,
        width: 100
    },
    {
        title: "Usuario",
        dataIndex: "user",
        fullWidth: true,
        render: (value, record) => (`${value?.first_name || ""} ${record.user?.last_name || ""}`),
        width: 200
    },
    {
        title: "Correo Electrónico",
        dataIndex: 'email',
        sorter: true,
        width: 300
    },
    {
        title: "Asunto",
        dataIndex: 'subject',
        sorter: true,
        width: 200
    },
    {
        title: "Contenido",
        dataIndex: 'body',
        sorter: true,
    },
    {
        title: "Fecha Creación",
        dataIndex: 'createdAt',
        render: (value, record) => _moment(value).tz("America/Bogota").format("YYYY-MM-DD"),
        sorter: true,
        width: 120
    },

];

const Tickets = () => {

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Grid
                source={"support-tickets"}
                columns={columns}
                searchField="q"
                searchText="Usuario..."
                search={true}
                searchById={true}
                actions={{}}
                filterDefaultValues={{
                    $sort: {
                        id: -1
                    }
                }}
                filters={
                    <>
                        <InputNumber
                            alwaysOn
                            source="user_id"
                            name="user_id"
                            label="Id Usuario"
                            placeholder="Id Usuario"
                            allowEmpty
                            style={{ width: '200px' }}
                        />
                    </>
                }
            />
        </Layout.Content>
    )
}

export default Tickets;