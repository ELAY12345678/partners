import React, { useEffect } from "react";
import { Input, Button, Icon, Row, Col, message, Form as FormAnt } from "antd";
import { useNavigate } from "react-router-dom";
import { socket } from "../../api/";

/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "../../redux/app/actions";

/* Services */
import { authenticate } from "../../services/services";

import { Form, HeadLine, Footer } from './Styled';

import LogoApparta from "../../sources/images/Logo_Apparta-01.png";


const SignInForm = props => {
  const navigate = useNavigate();
  const [form] = FormAnt.useForm();

  const connect = ({ strategy = "jwt", accessToken, ...rest }) => {
    return socket.authenticate({
      strategy,
      accessToken,
      ...rest
    });
  };
  useEffect(() => {
    // console.log("Changed!", props);
    return () => { };
  }, [props]);

  const handleSubmit = (err, data) => {
    authenticate(data)
      .then(({ user, accessToken }) => {
        window.localStorage.setItem("feathers-jwt", accessToken);
        window.localStorage.setItem("user", JSON.stringify(user));
        /* Socket Authentication */
        connect({
          accessToken
        });

        props.onAuthentication(user);
        if (user.role === "admin")
          navigate("/dashboard");
        else
          navigate("/dashboard");
        if (props.onSubmit) props.onSubmit(err, data);
      })
      .catch(err => message.error("Email or Password Invalid!"));
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      layout={"vertical"}
      autoSubmit={false}
      textAcceptButton="Ingresar"
      footer={
        <Footer type="flex" justify="center" align="middle" style={{ background: 'red' }}>
          <Col span={24} style={{ background: 'red' }}>
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
              Ingresar
            </Button>
          </Col>
        </Footer>
      }
    >
      <>
        {/* <HeadLine
          style={{
            width: "100%",
            height: "150px"
          }}
        >
          <img
            src={LogoApparta}
            style={{
              height: "145px",
              width: 250,
              objectFit: 'cover'
            }}
            alt='logo apparta'
          />
        </HeadLine> */}
        <Input
          size="small"
          style={{ width: "100%" }}
          placeholder="Email Address"
          name="email"
          validations={[{ required: true, message: "Email is required" }]}
          prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
        />
        <Input.Password
          size="small"
          style={{ width: "100%" }}
          type="password"
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Password"
          name="password"
          validations={[{ required: true, message: "Password is required" }]}
          autoComplete={'off'}
        />
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
export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
