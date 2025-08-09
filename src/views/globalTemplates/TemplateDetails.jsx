import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Divider, Layout } from 'antd';
import React from 'react';
import { Box } from '../../components';
import { Grid } from '../../components/com';
import FormTemplate from './FromTemplate';

const columns = [
    {
        dataIndex: "establishment_id",
        key: "establishment_id",
        title: "Establecimiento",
        render: () => 'NOMBRE ESTABLECIMIENTO'
    },
    {
        dataIndex: "address",
        key: "address",
        title: "Sucursal",
        sorter: true,
    },
]


const TemplateDetails = ({ location }) => {
    const { template_id, template_name } = location.state;
    const navigate = useNavigate();
    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => navigate('/dashboard/management/global-templates')} style={{ cursor: 'pointer' }}>
                    Plantillas globales
                </Breadcrumb.Item>
                <Breadcrumb.Item>{template_name}</Breadcrumb.Item>
            </Breadcrumb>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Box>
                <FormTemplate
                    selectedTemplate={template_id}
                />
            </Box>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Grid
                source='establishments-branchs'
                filterDefaultValues={{
                    discount_template_id: template_id,
                    $sort: {
                        id: 1
                    }
                }}
                permitFetch={template_id}
                columns={columns}
                actions={{}}
            />
        </Layout.Content>
    );
}

export default TemplateDetails;