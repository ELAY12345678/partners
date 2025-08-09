import React from 'react';
import { SimpleForm } from '../../components/com/form/SimpleForm';
import { useNavigate } from "react-router-dom";
import { Input, Layout, Row } from 'antd';

const ConfigurationsForm = (props) => {
    const navigate = useNavigate();
    const { source, id } = props;

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row style={{ padding: '2rem', background: 'white', borderRadius: '0.5rem' }}>
                <SimpleForm
                    id={id}
                    source={source || "configurations"}
                    onSubmit={() => {
                        navigate(`/dashboard/management/configurations`);
                    }}
                    textAcceptButton={id ? "ACTUALIZAR" : "CREAR"}
                >
                    <Input
                        size="large"
                        flex={0.5}
                        placeholder="Id"
                        label="Id"
                        name="id"
                    />
                    <Input
                        size="large"
                        flex={0.5}
                        placeholder="Nombre"
                        label="Nombre"
                        name="name"
                    />
                    <Input
                        size="large"
                        flex={0.5}
                        placeholder="Clave"
                        label="Clave"
                        name="key"
                    />
                    <Input
                        size="large"
                        flex={0.5}
                        placeholder="Valor"
                        label="Valor"
                        name="value"
                    />
                </SimpleForm>
            </Row>
        </Layout.Content>
    )
}

export default ConfigurationsForm;