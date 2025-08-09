import React from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from 'antd';
import { SimpleForm } from '../../components/com/form/SimpleForm';


const TicketsFrom = (props) => {
    const { source, id, ...rest } = props;
    const navigate = useNavigate();
     
    return (
        <SimpleForm
            id={id}
            source={source || "support-tickets"}
            onSubmit={() => {
                navigate(`/dashboard/support-tickets`);
            }}
            textAcceptButton={id ? "ACTUALIZAR" : "CREAR"}
        >
            <Input
                size="large"
                flex={0.5}
                placeholder="Usuario"
                label="Usuario"
                name="Usuario"
            />
            <Input
                size="large"
                flex={0.5}
                placeholder="Usuario"
                label="Correo"
                name="email"
            />
            <Input
                size="large"
                flex={0.5}
                placeholder="Asunto"
                label="Asunto"
                name="subject"
            />
            <Input
                size="large"
                flex={0.5}
                placeholder="Contenido"
                label="Contenido"
                name="body"
            />
        </SimpleForm>
    )
}

export default TicketsFrom;