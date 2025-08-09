import React, { useState, useEffect, useRef } from "react";
import DinamicForm from "./DinamicForm";
import { SimpleForm } from "./SimpleForm";
import { Steps, Button, message, Card, Row, Col } from "antd";
import styled from "styled-components";
/* import { useHistory } from "react-router-dom"; */
import propTypes from "prop-types";
const Wrapper = styled.div`
  background: #fff !important;
  padding: 40px 35px !important;
  border-radius: 30px !important;
  & .steps-content {
    margin-top: 0px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
  }
  /* [data-theme="compact"] .site-navigation-steps,
  .site-navigation-steps {
    margin-bottom: 60px;
    box-shadow: 0px -1px 0 0 #e8e8e8 inset;
  } */
  & .footer-container {
    text-align: center;
  }
  & .steps-action {
    margin-top: 0px;
    height: 60px;
    width: 100%;
    text-align: center;
    margin: 0px auto;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  & .footer-advanced-form .ant-row-flex {
    margin-top: 0px !important;
    align-items: baseline !important;
  }
  & .title-steps {
    /* min-height: 100px; */
    margin: 10px;
  }
  & .ant-steps-item-process .ant-steps-item-icon {
    background: #13c4a3 !important;
  }
  &
    .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background-color: #36c3ff !important;
  }
`;
const Form = styled(SimpleForm)`
  padding: 0 50px 40px !important;
  border-radius: 0px !important;
  position: relative !important;
  transition: all 0.25s ease !important;
  box-shadow: none !important;
  border: 0px !important;
  &.ant-form {
    padding: 0px 20px !important;
    width: 400px !important;
  }
  & .item-form {
    padding: 0px 4px !important;
  }
  & .footer-advanced-form .ant-btn {
    /* padding: 15px 20px; */
    /* margin-top: 20px; */
    height: 50px !important;
    margin-bottom: -20px;
    border-radius: 15px;
    font-size: 0.95rem;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const HeadTitle = styled.div`
  h2 {
    font-size: 1.2rem !important;
    margin-bottom: 10px !important;
    font-style: italic;
    text-align: center;
    color: #ccc;
  }
`;
const CardWrapper = styled(Card)`
  max-width: 400px;
  border-radius: 8px !important;
  & .ant-card-meta-detail {
    text-align: center !important;
  }
  & p {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 28px;
    color: #454245;
  }
  & h2 {
    font-size: 40px;
    line-height: 46px;
    margin-bottom: 4px;
  }
`;
const HeadLine = styled.div`
  color: #fff;
  text-align: center;
  & h1 {
    font-size: 1.5em;
    font-weight: bold;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    margin: 0px 0px 10px 0px;
    color: #546067;
  }
  & p {
    font-size: 18px;
    padding: 0px 10px;
  }
  & img {
    min-width: 180px;
    object-fit: contain;
    margin-bottom: 10px;
    padding: 0px;
  }
`;
const { Step } = Steps;
const SteperForm = props => {
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState([]);
  const [payloads, setPayloads] = useState({});
  const [submiting, setSubmiting] = useState(false);
  const [errors, setErrors] = useState();
  const [action, setAction] = useState();

  const myRef = useRef(null);

  const next = () => {
    setAction("next");
    /*  setCurrent(current => current + 1); */
  };
  const prev = () => {
    setAction("prev");
    /*  setCurrent(current => current - 1); */
  };
  const handleSubmit = async (err, data, form) => {
    switch (action) {
      case "next":
        if (err) {
          return message.error("Some fields are required!");
        }
        setPayloads({
          ...payloads,
          ...data
        });
        setCurrent(current => current + 1);
        break;
      case "prev":
        setCurrent(current => current - 1);
        if (props.onChange) {
          /* form.resetFields(); */
          const record = form.getFieldsValue();
          setPayloads({
            ...payloads,
            ...record
          });
          console.log("PAYLOADS:: ", form.getFieldsValue(), payloads);
          props.onChange(record);
        }
        break;
      default:
        /* Submit the form */
        if (err) {
          return message.error("Some fields are required!");
        }
        setSubmiting(true);
        if (props.onDone) await props.onDone(payloads);
        setSubmiting(false);
        break;
    }
    setErrors(null);
    console.log(err, data);
  };
  const handleChange = (field, value) => {
    if (props.onChange)
      props.onChange({
        ...payloads,
        [field]: value
      });
    setPayloads({
      ...payloads,
      [field]: value
    });
  };

  useEffect(() => {
    if (props.steps) setSteps(props.steps);
    if (props.current) setCurrent(props.current);
    if (props.done) {
      setAction("done");
    }
    return () => {};
  }, [props.steps, props.current, props.done]);
  return (
    <Wrapper>
      {action !== "done" && props.title && <HeadLine>{props.title}</HeadLine>}
      {action !== "done" && (
        <div className="title-steps">
          <Steps
            /* className="site-navigation-steps" */
            flex={1}
            /* progressDot={customDot} */
            current={current}
            size="small"
          >
            {steps.map((item, index) => (
              <Step key={index} /* description={item.description}  */ />
            ))}
          </Steps>
        </div>
      )}
      {action !== "done" && (
        <Form
          submiting={submiting}
          autoSubmit={false}
          onChange={handleChange}
          onSubmit={handleSubmit}
          footer={
            <>
              <div className="steps-action">
                {current < steps.length - 1 && (
                  <Button
                    block={current == 0}
                    htmlType="submit"
                    size="large"
                    type="primary"
                    onClick={e => {
                      next();
                      /* e.preventDefault(); */
                    }}
                  >
                    {`${current == 0 ? "LET'S GO FOR IT!" : "NEXT"}`}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    loading={submiting}
                    block={submiting}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      setAction("submit");
                    }}
                  >
                    {submiting ? "SENDING..." : props.textDone || "DONE"}
                  </Button>
                )}
                {current > 0 && !submiting && (
                  <Button
                    size="large"
                    htmlType="submit"
                    style={{ marginLeft: 8 }}
                    onClick={() => prev()}
                  >
                    PREVIOUS
                  </Button>
                )}
              </div>
              <div className="footer-container">
                {" "}
                {props.footer && props.footer}
              </div>
            </>
          }
          title={
            steps[current] && <HeadTitle>{steps[current].title}</HeadTitle>
          }
        >
          {steps[current] && steps[current].content}
        </Form>
      )}
      {action == "done" && (
        <CardWrapper bordered={false}>
          {props.doneView && props.doneView}
          {!props.doneView && (
            <Card.Meta
              title={<h2>Ready we are done!</h2>}
              description={
                <Row type="flex" justify="center" align="middle">
                  <Col span={24}>
                    <p>
                      Please check your email account to verify your user
                      account
                    </p>
                    <Button
                      block
                      size="large"
                      style={{
                        backgroundColor: "rgb(22, 91, 251)",
                        color: "#fff",
                        margin: 10,
                        maxWidth: "50%"
                      }}
                      onClick={() => {
                        window.location.href = "/signin";
                      }}
                    >
                      Go to SignIn
                    </Button>
                  </Col>
                </Row>
              }
            ></Card.Meta>
          )}
        </CardWrapper>
      )}
    </Wrapper>
  );
};
SteperForm.propTypes = {
  steps: propTypes.array,
  current: propTypes.number
};
export default SteperForm;
