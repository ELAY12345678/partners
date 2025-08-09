import React, { useState, useEffect } from "react";
import { SelectField, SimpleForm, DateField, FileUploader } from "../com/form/";
import locale from "antd/es/date-picker/locale/es_ES";
import {
  Icon,
  Input,
  Select,
  message,
  DatePicker,
  Layout,
  Row
} from "antd";
import { ImageField } from "../com";
import { useNavigate } from "react-router-dom";
import qs from "qs";

import { getService } from '../../services';

const { Option } = Select;

const roles = [
  {
    id: "user",
    name: "Usuario",
  },
  {
    id: "admin",
    name: "Administrador",
  },
];

const status = [
  {
    id: "active",
    name: "Activo",
  },
  {
    id: "disabled",
    name: "Desactivado",
  },
  {
    id: "pending validation",
    name: "Pendiente de validación",
  },
  {
    id: "pending_information",
    name: "Pendiente por información",
  },
];
const genders = [
  {
    id: "male",
    name: "Masculino",
  },
  {
    id: "female",
    name: "Femenino",
  },
];

export const codepush_environment_options = [
  { id: "production", name: "production" },
  { id: "staging", name: "staging" },
];

export const true_false = [
  { id: "false", name: "False" },
  { id: "true", name: "True" },
];

const exclude_admin_roles = ["admin"];

const UserForm = ({ source, id, ...props }) => {
  const navigate = useNavigate();
  
  const [role, setRole] = useState();

  const handleUploadFinish = (field, url, file, _id) => {
    const service = getService("users");
    const galleryService = getService("gallery");
    let payloads = {
      meta_file_name: file.name,
      meta_size: String(file.size),
      name: file.name,
      meta_media_type: file.type,
      path: url,
      description: "",
    };
    galleryService
      .create(payloads)
      .then(({ id }) => {
        if (_id !== "create")
          service
            .patch(_id, {
              [field]: id,
            })
            .then((response) => { })
            .catch((err) => message.error(err.message));
      })
      .catch((err) => message.error(err.message));
  };

  useEffect(() => {
    if (props.location) {
      let { search } = props.location;
      let query = qs.parse(search.replace(/\?/, ""));
      if (query) {
        let { role } = query;
        setRole(role);
      }
    }
  }, [props.location]);

  return (
    <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
      <Row style={{ padding: '2rem', background: 'white', borderRadius: '0.5rem' }}>
        <SimpleForm
          id={id}
          source={source || "users"}
          onSubmit={() => {
            navigate(`/dashboard/management/users`);
          }}
          textAcceptButton={id ? "ACTUALIZAR" : "CREAR"}
        >
          {id && (
            <FileUploader
              flex={1}
              path={`users/${id}/avatar/`}
              name='avatar_gallery'
              source='avatar_gallery'
              onFinish={(url, file) =>
                handleUploadFinish("avatar_gallery_id", url, file, id)
              }
            />
          )}
          <Input
            size="large"
            flex={0.5}
            placeholder="Nombre"
            label="Nombre"
            name="first_name"
            validations={[{ required: true, message: "El nombre es requerido" }]}
          />
          <Input
            size="large"
            flex={0.5}
            placeholder="Apellido"
            label="Apellido"
            name="last_name"
            validations={[{ required: true, message: "El apellido es requerido" }]}
          />
          <Input
            size="large"
            flex={0.5}
            placeholder="Email"
            label="Correo"
            type="email"
            name="email"
            validations={[{ required: true, message: "El email es requerido" }]}
          // prefix={<Icon size="large" type="mail" />}
          />
          <Input.Password
            size="large"
            flex={0.5}
            type="password"
            // prefix={<Icon size="large" type="lock" />}
            placeholder="●●●●●●●●"
            label="Contraseña"
            name="password"
            validations={[
              !id && { required: true, message: "La contraseña es requerida" },
            ]}
          />
          <Select
            size="large"
            name="gender"
            label="Genero"
            placeholder="Seleccionar"
          >
            {genders
              .map((d) => (
                <Option key={d.id} >{d.name}</Option>
              ))}
          </Select>
          {!id &&
            <DatePicker
              xtype="date"
              size="large"
              label="Fecha de nacimiento"
              name="birthday"
              format="MM/DD/YYYY"
              locale={locale}
            />
          }
          <Input
            xtype="phone"
            input
            size="large"
            flex={0.1}
            placeholder="Ej: 57"
            label="Código del País"
            name="phone_country_code"
            // prefix={<Icon size="large" type="phone" />}
            validations={[
              { required: true, message: "El código del país es requerido" },
            ]}
          />
          <Input
            xtype="phone"
            input
            size="large"
            flex={0.2}
            placeholder="Celular"
            label="Celular"
            type="tel"
            name="phone"
            // prefix={<Icon size="large" type="phone" />}
            validations={[
              { required: true, message: "El teléfono celular es requerido" },
            ]}
          />(
          <Select
            size="large"
            label="Elige un rol para el usuario"
            name="role"
            placeholder="Elige un rol para el usuario"
            validations={[{ required: true, message: "El estado es requerido" }]}
          >
            {
              roles.map((d) => (
                <Option key={d.id}>{d.name}</Option>
              ))
            }
          </Select>
          <Select
            size="large"
            name="status"
            label="Estado"
            placeholder="Seleccionar"
            validations={[{ required: true, message: "El estado es requerido" }]}
          >
            {status
              .map((d) => (
                <Option key={d.id}>{d.name}</Option>
              ))}
          </Select>
          <Select
            size="large"
            name="account_manager"
            label="Account manager"
            placeholder="Seleccionar"
          >
            {true_false
              .map((d) => (
                <Option key={d.id}>{d.name}</Option>
              ))}
          </Select>
          <Select
            size="large"
            name="test_user"
            label="Test User"
            placeholder="Seleccionar"
          >
            {true_false
              .map((d) => (
                <Option key={d.id}>{d.name}</Option>
              ))}
          </Select>
          <Select
            size="large"
            name="codepush_enviorment"
            label="Code Push Environment"
            placeholder="Seleccionar"
          >
            {codepush_environment_options
              .map((d) => (
                <Option key={d.id}>{d.name}</Option>
              ))}
          </Select>
          <Input.TextArea
            flex={1}
            name='disabled_reason'
            label="Disabled Reason"
            size="large"
            autoSize
          />
        </SimpleForm>
      </Row>
    </Layout.Content>
  );
};
export default UserForm;
