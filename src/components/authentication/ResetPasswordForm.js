import React, { useState } from "react";
import AdvancedForm from "../com/form/AdvancedForm";
import { Input, Button, Icon, Row, Col, message } from "antd";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";


/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "../../redux/app/actions";

/* Services */

import { getService, recovery_password } from "../../services";

const Form = styled(AdvancedForm)`
  width: 400px;
  background: #fff;
  padding: 40px 35px !important;
  border: 1px solid #ccc;

  box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);
  margin-bottom: 30px;
  transition: box-shadow 0.2s ease-in-out;

  border: 0px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;

  & .item-form {
    padding: 5px 20px !important;
  }
  & .ant-form-item input:focus {
    box-shadow: none !important;
  }
  & .ant-form-item {
    padding-bottom: 5px !important;
    margin-bottom: 5px !important;
  }
  & .ant-form-item input {
    border: 0px;
    border-radius: 0px;
    border-bottom: 1px solid #ccc;

    padding: 0.625rem 1.1875rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
  }
  & .login-form-button {
    text-transform: uppercase;
    font-weight: bold;

    margin-bottom: 1.5rem !important;

    border: 1px solid transparent !important;
    padding: 0.625rem 1.1875rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    border-radius: 2px !important;
  }
`;
const HeadLine = styled.div`
  text-align: center;

  & h2 {
    font-size: 1.5rem;
  }
  & img {
    margin-bottom: 1.5rem !important;
  }
`;
const Footer = styled(Row)`
  & .ant-col {
    margin-bottom: 0.5rem !important;
  }
`;
const ResetPasswordForm = ({ token, ...props }) => {
  const [isVisibleValidateToken, setIsVisibleValidateToken] = useState(false);
  const serviceUsers = getService("recovery-password");
  const [dataUser, setDataUser] = useState({});
  const navigate = useNavigate();
  
  const handleSubmit = (err, data) => {
    if (!isVisibleValidateToken && !Object.keys(dataUser).length > 0) {
      recovery_password(data)
        .then(_ => {
          message.info(
            "Se ha generado un token de autenticación revise su correo por favor",
            10
          );
          setIsVisibleValidateToken(true);
          if (props.onSubmit) props.onSubmit(err, data);
        })
        .catch(err => message.error(err.message));
    }
    if (isVisibleValidateToken && !Object.keys(dataUser).length > 0) {
      serviceUsers
        .find({
          query: { token: data?.token }
        })
        .then(response => {
          if (response) {
            setDataUser(response);
          } else {
            message.error("El token esta equivocado o se encuentra expirado");
          }
        });
    }
    if (isVisibleValidateToken && Object.keys(dataUser).length > 0) {
      if (data?.password === data?.passwordVerified) {
        serviceUsers
          .patch(
            dataUser?.user_id,
            { password: data.password, token: dataUser?.token },
            {}
          )
          .then(_ => {
            message.success("Se ha creado la nueva contraseña exitosamente");
            navigate("/signin").then();
          })
          .catch(e => message.error(e.message));
      } else {
        message.error(
          "Los campos no coinciden, verifique y reintente por favor"
        );
      }
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      layout={"vertical"}
      autoSubmit={false}
      textAcceptButton="Signin"
      footer={
        <Footer type="flex" justify="center" align="middle">
          <Col span={24}>
            <Button
              block
              size="large"
              style={{
                width: "100%",
                height: 40,
                padding: 5,
                margin: "0px auto",
                textAlign: "center"
              }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              ENVIAR
            </Button>
          </Col>
          <Col span={24} align="center">
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{
                margin: 10
              }}
            >
              <Col span={24}>
                <span>¿Ya tienes una cuenta?</span>{" "}
                <Link to="/signin">Ingresar</Link>
              </Col>
              <Col span={24}>
                <span>¿Aún no tienes una cuenta? </span>{" "}
                <Link to="/signup">Registrarme</Link>
              </Col>
            </Row>
          </Col>
        </Footer>
      }
    >
      <>
        <HeadLine
          style={{
            width: "100%"
          }}
        >
          <div>
            <Link to="/">
              <img
                //src={LOGO_COLOR}
                style={{
                  width: 100
                }}
                alt="logo"
              />
            </Link>
          </div>
          <h5
            style={{
              marginBottom: 0
            }}
            className="login-title"
          >
            <span>Recuperar Contraseña </span>
          </h5>
          {!Object.keys(dataUser).length > 0 && (
            <span
              style={{
                fontStyle: "italic"
              }}
            >
              {isVisibleValidateToken
                ? "Ingresa el token generado"
                : "Ingresa tu email"}
            </span>
          )}
        </HeadLine>
        {!isVisibleValidateToken && (
          <Input
            size="large"
            style={{ width: "100%" }}
            placeholder="Email Address"
            name="email"
            validations={[{ required: true, message: "Email es requerido" }]}
            prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        )}
        {isVisibleValidateToken && !dataUser.user_id && (
          <Input
            size="large"
            style={{ width: "100%" }}
            placeholder="Token de autenticación"
            name="token"
            validations={[{ required: true, message: "El token es requerido" }]}
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          />
        )}
        {Object.keys(dataUser).length > 0 && (
          <Input.Password
            size="large"
            style={{ width: "100%" }}
            placeholder="Ingrese nueva contraseña"
            name="password"
            validations={[
              { required: true, message: "La nueva contraseña es requerida" }
            ]}
          />
        )}
        {Object.keys(dataUser).length > 0 && (
          <Input.Password
            size="large"
            style={{ width: "100%" }}
            placeholder="Repita la nueva contraseña"
            name="passwordVerified"
            validations={[
              {
                required: true,
                message: "La confirmacion de la nueva contraseña es requerida"
              }
            ]}
          />
        )}
      </>
    </Form>
  );
};
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAuthentication: user =>
      dispatch({ type: actionTypes.AUTHENTICATION, user })
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm);
