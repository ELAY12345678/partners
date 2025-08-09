import React, { Component } from "react";
import { Form, Row, Col, Button } from "antd";
import "./form.css";
import moment from "moment";
import { Tools, HeadTitle } from './Styles';

class AdvancedForm extends Component {

  formRef =  React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      formLayout: "vertical"
    };
  }

  handleFormatterPhone = value => {
    var cleaned = ("" + value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  handleSubmit = async (e) => {
    if (typeof this.props.onSubmit !== "undefined") {
      if (e.path_image_main)
        delete e.path_image_main
      if (e.banner_path)
        delete e.banner_path
      if (e.apparta_menu_branch_list_background_path)
        delete e.apparta_menu_branch_list_background_path
      this.props.onSubmit(undefined, e, this.props.form, e);
    }
  };

  getFields() {
    const me = this;
    const { children, initialValues } = this.props;
    let childrens = [];

    let { formLayout } = this.state;
    formLayout = this.props.formLayout || formLayout;

    const formItemLayout =
      formLayout === "vertical"
        ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
        : null;

    if (typeof children !== "undefined") {
      try {
        let { props } = children;
        let childNodes = props.children || [];
        childrens = React.Children.map(childNodes, (child, index) => {
          if (!child) return child;
          let {
            name,
            label,
            labelAlign,
            help,
            required,
            message,
            validations,
            style,
            initial,
            initialValue,
            valuePropName="value",
            onChange,
            type,
            xtype,
            next_reference,
            flex,
            className,
            format,
            mode,
            feedback = false,
            onRender
          } = child.props;

          name = typeof name === "undefined" ? `field_${index}` : name;

          style = style || {};

          /* InitialValue Map */
          let { latName = "lat", lngName = "lng" } = child.props;
          let { form } = me.props;
          if (xtype === "map") {
            // initialValue = Object.values(values);
          }

          if (initialValues) initialValue = initialValues[name];

          if (xtype === "date" && initialValues) {
            if (initialValues[name]) initialValue = moment(initialValues[name]);
          }
          if (xtype === "number" && initialValues) {
            if (initialValues[name]) initialValue = Number(initialValues[name]);
          }
          validations = validations || [
            {
              required: required || this.props.allRequired || false,
              message: message || `${label} es requerido`
            }
          ];

          if (next_reference) {
            if (validations.filter(it => it.validator).length === 0) {
              validations.push({
                validator: (rule, value, callback) => {
                  if (value && value !== form.getFieldValue(next_reference)) {
                    callback("Two passwords that you enter is inconsistent!");
                  } else {
                    callback();
                  }
                }
              });
            }
          }
          if (type === "email") {
            validations.push({
              type: "regexp",
              pattern: new RegExp(
                "^([a-zd.-]+)@([a-zd-]+).([a-z]{2,8})(.[a-z]{2,8})?$"
              ),
              message: "Wrong format!"
            });
          }
          if (xtype === "password") {
            if (validations.filter(it => it.validator).length === 0) {
              validations.push({
                validator: async (rule, value) => {
                  var mediumRegex = new RegExp(
                    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
                  );
                  if (mediumRegex.test(value)) {

                  } else {
                    throw new Error(
                      value
                        ? "Badly formed password!!"
                        : "The password is required"
                    );
                  }
                }
              });
            }
          }
          if (xtype === "phone") {
          }
          delete child.value;
          if (type === "hidden") {
            style = {
              display: "none"
            };
          }
          if (flex <= 1) style["width"] = `${flex * 100}%`;
          if (!child.type || typeof child == "undefined") {
            return null;
          }
          return (
            <Col
              {...formItemLayout}
              key={name || `field-${index}`}
              style={{ padding: 5, display: "inline-block", ...style }}
              className={`${typeof className !== "undefined"
                ? "item-form " + className
                : "item-form"
                } ${type === "hidden" ? "item-hidden" : ""} ${xtype === "fieldset" ? "field-set" : ""
                }`}
            >
              <Form.Item
                enableReinitialize
                label={label}
                labelAlign={labelAlign || "right"}
                hasFeedback={next_reference != null}
                help={help}
                name={name || `field-${index}`}
                initialValue={initialValue || initial}
                validateTrigger="onChange"
                valuePropName={valuePropName}
                rules={validations}
              >
                {
                  React.cloneElement(child, {
                    style: { width: "100%" },
                    trigger: "focus",
                    onBlur: e => {
                      if (xtype === "capitalize") {
                        let value = e.target.value;
                        form.setFieldsValue({
                          [name]:
                            typeof value == "string"
                              ? value.capitalize()
                              : value
                        });
                      }
                      if (xtype === "phonefield") {
                        let value = e.target.value;
                        form.setFieldsValue({
                          [name]:
                            typeof value == "string"
                              ? this.handleFormatterPhone(value)
                              : value
                        });
                      }
                    },
                    form
                  })
                }
              </Form.Item>
            </Col >
          );
        });
      } catch (err) {
        console.log("ERROR: ", err);
      }
    }

    return childrens;
  }

  componentDidMount() {
    let { formLayout } = this.props;
    if (typeof formLayout !== "undefined")
      this.setState({
        formLayout
      });

    if (this.props.onMount && this.formRef) this.props.onMount(this.formRef.current);

    let { initialValues } = this.props;
    if(this.props.form){
      this.props.form?.setFieldsValue(initialValues)
    }

  }

  componentWillReceiveProps(nexProps) {
    let { initialValues } = nexProps;
    if (!this.props.form && this.formRef && this.formRef.current) {
      this.formRef.current?.setFieldsValue(initialValues);
    }
  }

  render() {
    const { formLayout } = this.state;
    let {
      footer,
      title,
      titleStyle,
      className,
      style,
      autoSubmit = true,
      textAcceptButton = "SAVE",
      initialValues,
      actions,
      form,
      noAcceptButtonBlock = false,
    } = this.props;

    // if (!this.props.form && this.formRef.current){
    //   this.formRef.current?.setFieldsValue(initialValues);
    // }

    if (this.props.form) {
      return (
        <Form
          form={this.props.form}
          scrollToFirstError
          name="search_form"
          className={className}
          layout={formLayout}
          onFinish={this.handleSubmit}
          style={style || { margin: 20 }}
          // initialValues={initialValues}
          onFieldsChange={(field,allFields,)=>{
            if(this.props.onFieldsChange){
              this.props.onFieldsChange(field,allFields);
            }
          }}
        >
          {title && <HeadTitle className="head-title">{title}</HeadTitle>}
          <Row className="form-fields" gutter={24}>
            {this.getFields()}
          </Row>
          <Row justify="center">
            <Button
              type="primary"
              disabled={this.props.disabled}
              loading={this.props.submitting}
              size="large"
              block={noAcceptButtonBlock ? false : true}
              htmlType="submit"
              style={{ borderRadius: "0.5rem", marginBottom: '1rem' }}
            >
              {textAcceptButton}
            </Button>

          </Row>
          {actions && (
            <Tools
              style={{
                margin: "10px 4px"
              }}
            >
              {actions &&
                actions.props &&
                React.Children.map(actions.props.children, (child, index) => {
                  let { onClick } = child.props;
                  return React.cloneElement(child, {
                    onClick: e => {
                      if (onClick) onClick(e, form);
                    }
                  });
                })}
            </Tools>
          )}
        </Form>
      )
    }
    else {
      return (
        <Form
          ref={this.formRef}
          scrollToFirstError
          name="search_form"
          className={className}
          layout={formLayout}
          onFinish={this.handleSubmit}
          style={style || { margin: 20 }}
          // initialValues={initialValues}
        >
          {title && <HeadTitle className="head-title">{title}</HeadTitle>}
          <Row className="form-fields" gutter={24}>
            {this.getFields()}
          </Row>
          <Row justify="center">
            <Button
              type="primary"
              disabled={this.props.disabled}
              loading={this.props.submitting}
              size="large"
              block={noAcceptButtonBlock ? false : true}
              htmlType="submit"
              style={{ borderRadius: "0.5rem", marginBottom: '1rem' }}
            >
              {textAcceptButton}
            </Button>

          </Row>
          {actions && (
            <Tools
              style={{
                margin: "10px 4px"
              }}
            >
              {actions &&
                actions.props &&
                React.Children.map(actions.props.children, (child, index) => {
                  let { onClick } = child.props;
                  return React.cloneElement(child, {
                    onClick: e => {
                      if (onClick) onClick(e, form);
                    }
                  });
                })}
            </Tools>
          )}
        </Form>
      );
    }

  }
}

export default AdvancedForm;