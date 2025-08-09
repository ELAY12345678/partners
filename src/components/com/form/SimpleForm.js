import React, { useEffect, useState } from "react";
import AdvancedForm from "./AdvancedForm";
import { Row, message } from "antd";
import styled from "styled-components";
import { getService } from "../../../services/services";
import { Spin, Modal } from "antd";
import _ from "lodash";


const { confirm } = Modal;

const antIcon = <Spin />;

const Form = styled(AdvancedForm)`
  min-width: 450px;
  max-width: 500px;
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
  & .item-form.item-hidden{
    padding: 0px !important;
    height: 0px !important;
    margin-bottom:0px!important;
  }
  & .ant-input-prefix i {
    color: rgba(0, 0, 0, 0.25) !important;
    font-size: var(--font-size-tiny) !important;
  }
  & .ant-select-search__field {
    /* border: 0px !important; */
  }
  & .ant-input-number.ant-input-number-lg,
  .ant-select-selection {
    /* border: 0px !important; */
  }
  & .ant-select {
    /* border-bottom: 1px solid #ccc; */
  }
  & .ant-divider-horizontal {
    margin: 10px 0 !important;
    color: #ccc!important;
    font-style: italic!important;
  }
  & .ant-card-bordered {
    /* box-shadow: 3px 3px 3px #ccc !important; */
    border-radius: 10px !important;
  }

  & .ant-form-explain{
    
    position: absolute!important  ;
    bottom: -17px!important ;
    left: 10px!important  ;

    /* background: rgba(255,78,78,.1)!important; */
    color: #ff4e4e!important;
    /* padding: 8px!important;
    border-radius: 0px 8px!important;
    border-radius: 20px!important; */
  }
  & .search .ant-select-arrow{
    height: 100%!important;
    background: #73dcc9!important;
    top: 5px!important;
    width: 35px!important;
    right: 0!important;
    border-radius: 0px 8px 8px 0px!important;
    display: flex!important;
    justify-content: center!important;
    align-items: center!important;
    color: #fff!important;
    font-size: 1.2rem!important;
    padding: 0px 5px!important;
    border: 2px solid #73dcc9!important;
  }
  & .footer-advanced-form .ant-btn {
    /* padding: 15px 20px; */
    /* margin-top: 20px; */
    height: 50px !important;
    min-height: 50px !important;
    margin-bottom: -20px;
    border-radius: 30px!important;
    font-size: 0.95rem;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .ant-btn-default,
  .ant-btn-default:hover
  {
    color: rgba(0, 0, 0, 0.65)!important;
    background-color: var(--color-gray-light)!important;
  }

  & .ant-form-item input,
  textarea {
    /* border: 0px;
    border-radius: 0px;
    border-bottom: 1px solid #ccc; */

    /* padding: 0.625rem 1.1875rem; */
    /* font-size: 0.875rem; */
    font-weight: 400;
    line-height: 1.5;
    /* padding: 10px 4px 8px 30px!important; */
    /* font-size: 1.2em!important; */
  }
  & .login-form-button {
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom:0px!important;
    margin-top:0px!important;
    //border: 1px solid transparent !important;
    padding: 0.625rem 1.1875rem !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
    border-radius: 2px !important;
  }
  & > .ant-form-item label {
    position: relative !important;
    color: var(--color-gray)!important;
  }

  & .ant-row.footer-advanced-form div:last-child {
      margin-top: 0px!important;
  }

  & .ant-form-item input:hover,
  .ant-select-selection:hover,
  textarea.ant-input:hover
  {
    background: #e5ecee!important
  }
  & .ant-form-item input,
  .ant-select-selection,
  textarea.ant-input
  {
    border-radius: 4px!important;
  }
  .ant-input-number-handler-wrap{
    visibility:hidden!important;
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active,
  .ant-input:hover,
  .ant-input:focus,
  .ant-input:active,
  .ant-input-number,
  textarea.ant-input,
  .ant-select-open .ant-select-selection {
    box-shadow: none!important;
  }
  & .ant-col-12.item-form {
    padding: 5px 4px;
  }
& .form-fields{
  margin-left: 8px!important;
  margin-right: 8px!important;
}
& .ant-form{
    box-shadow:none!important;
    min-width:100%!important;
    padding: 0px!important;
}
& .login-form-button{
    width: auto!important;
    padding: 4px 50px!important;
}
& .footer-advanced-form {
    margin: 0px!important;
    padding: 0px!important;
}
& .card-closed .ant-card-body {
    padding: 0px!important;
}
& .ant-card-body {
    padding: 10px 20px!important;
}
& .ant-card-head{
    min-height: auto!important;
    padding: 0 10px!important;
    background-color:var(--gray-dark-1)!important;
    color:#fff!important;
}
& .card-closed .ant-card-head{
    background-color:var(--gray-dark)!important;
}
&  .ant-card-head-title {
    padding: 4px 0!important;
    text-transform: uppercase!important;
}
& .btn-submit{
    min-width: 150px;
    height: 45px!important;
    font-size: 18px;
    font-weight: bold;
}
& .address-container input{
    margin: 10px 0px!important;
}
/* Form */
&.ant-form{
  box-shadow:none!important;
  min-width:100%!important;
  padding: 0px!important;
}
& .login-form-button{
  width: auto!important;
  padding: 4px 50px!important;
}
& .footer-advanced-form {
  margin: 0px!important;
  padding: 0px!important;
}

& .btn-submit{
  min-width: 150px;
  height: 45px!important;
  font-size: 18px;
  font-weight: bold;
}
& .address-container input{
  margin: 10px 0px!important;
}

& .ant-select-lg .ant-select-selection--single, 
.ant-select-auto-complete.ant-select .ant-select-selection--single{
  min-height: 40px!important;
}
& .ant-select-auto-complete.ant-select .ant-form-item input{
  height: 40px!important;
}
& .ant-select-selection--multiple .ant-select-search--inline .ant-select-search__field {
    /* width: 100%; */
    /* min-width: 100%!important; */
    /* padding: 4px 8px!important; */
    margin: 0px 8px!important;
    height: auto!important;
}
& .ant-select-search__field__wrap input{
  background:transparent!important;
}

& .ant-card-head{
  min-height: 30px;
  color: #535353;
  background:#FFF!important;
}
& .head-title{
  background: #f0f6fb!important;
  border-radius: 8px!important;

}
& .ant-card-head{
  border-bottom:0px!important;
}
& .ant-switch {
    width: 50px!important;
}
& .item-form {
  padding: 8px 4px !important;
}
`;

const Loader = styled.div`
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
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

export const SimpleForm = ({
  source = "",
  title,
  header,
  footer,
  children,
  onSubmit,
  style,
  id,
  idKey = "_id",
  layout = "vertical",
  width = "100%",
  textAcceptButton,
  autoSubmit = true,
  owner = false,
  ownerId = "user_id",
  query,
  allowNull,
  ...props
}) => {
  const [service, setService] = useState();
  const [record, setRecord] = useState(props.record || {});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_id, setID] = useState();
  const [initialValues, setInitialValues] = useState(_.mapValues(props.initialValues, (value) => { if (value !== null) { return value; } }));


  const save = async (payloads) => {
    return new Promise((resolve, reject) => {
      setSubmitting(true);
      if (_id) {
        return service
          .patch(_id, payloads)
          .then(({ msg, ...rest }) => {
            message.success(msg || "Actualizado exitosamente");
            resolve(rest);
            setInitialValues();
            setRecord();
            setSubmitting(false);
            if (props.onAfterSubmit) props.onAfterSubmit(rest);
          })
          .catch((err) => {
            reject(err);
            setSubmitting(false);
            message.error(err.message);
          });
      }
      service
        .create(payloads)
        .then((response) => {
          message.success(
            response.message || props.message || "Creado exitosamente"
          );
          resolve(response);
          setInitialValues();
          setRecord();
          setSubmitting(false);
        })
        .catch((err) => {
          reject(err);
          message.error(err.message);
          setSubmitting(false);
        });
    });
  };

  const handleSubmit = async (err, data, form) => {
    if (err) return;
    delete data.avatar_gallery;
    delete data.apparta_menu_linktree_background;

    data = _.mapValues(data, (value, key) => {
      if (initialValues[key] !== value || (source === 'users' && (key === 'email' || key === 'phone'))) {
        if ((allowNull && value === null) || value !== null) {
          return value === undefined ? null : value;
        }
      }
    });

    if (!_.values(data).some(value => value !== undefined)) {
      return;
    }
    if (autoSubmit && source) {
      const response = await save(data);
      if (onSubmit) onSubmit(err, response, form);
    } else {
      setSubmitting(true);
      if (onSubmit)
        await Promise.resolve(
          onSubmit(err, data, form)
        ).then(() => {
          setSubmitting(false);
        }).catch(err => {
          setSubmitting(false);
        })
    }
  };


  const handleDelete = () => {
    if (source && id) {
      confirm({
        title: "¿Estas seguro de eliminar el registro?",
        content: "Oprime OK para eliminar.",
        onOk() {
          service
            .remove(id)
            .then(response => {
              if (onSubmit)
                onSubmit();
              getData();
              message.info("Record deleted");
            })
            .catch(err => message.error(err.message));
        },
        onCancel() { }
      });
    }
  };

  const getData = () => {
    if (source && id && !props.initialValues) {
      const service = getService(source);
      service
        .get(id, { query: query })
        .then((response) => {
          try {
            response = _.mapValues(response, (value) => { if (value !== null) { return value; } });
            setInitialValues(response);
            setRecord(response);
            if (props.onLoad) props.onLoad(response);
          } catch (error) {
            message.error(error);
          }
        })
        .catch((err) => message.error(err));
    }
  };

  useEffect(() => {
    setService(getService(source));
    let { match } = props;
    if (match && !id) {
      let { params } = match;
      if (params) {
        id = params.id;
      }
    }
    setID(id);
    getData();
    return () => { };
  }, [id]);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  if (loading)
    return (
      <Loader>
        <Spin indicator={antIcon} tip="Cargando..." />
      </Loader>
    );

  return (
    <Form
      {...props}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      style={{
        ...style,
      }}
      autoSubmit={autoSubmit}
      layout={layout}
      formLayout={layout}
      initialValues={initialValues}
      submitting={submitting}
      textAcceptButton={
        textAcceptButton ? textAcceptButton : _id ? "Actualizar" : "Crear"
      }
      footer={
        <Footer type="flex" justify="center" align="middle">
          {footer}
        </Footer>
      }
      record={record}
      title={
        title ? (
          <HeadLine
            style={{
              width: "100%",
            }}
          >
            {title}
          </HeadLine>
        ) : (
          header
        )
      }
    >
      <>
        {React.Children.map(children, (child, index) => {
          if (!child) return null;
          return React.cloneElement(child, {
            record,
          });
        })}
      </>
    </Form>
  );
};
