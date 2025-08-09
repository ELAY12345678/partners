import React, { useEffect } from "react";
// import SignInForm from "../../../components/authentication/SignInForm";
import LayoutCenter from "../../../layouts/layout_center";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import { getService } from "../../../services/services";
import {SignInForm} from "../../../components/authentication";
const SignIn = ({ token, ...props }) => {
  const navigate = useNavigate();
  
  const validateToken = token => {
    let service = getService("user-confirmation");
    service
      .create({
        token
      })
      .then(({ success }) => {
        message.info("Use your user and password to access!");
        navigate("/signin");
      })
      .catch(err => message.error(err.message));
  };
  useEffect(() => {
    if (token) validateToken(token);
    return () => {};
  }, []);
  return (
    <LayoutCenter>
      <SignInForm />
    </LayoutCenter>
  );
};

export default SignIn;
