import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button
} from "antd";
import { FormWrapper } from "./Styles";
import Field from "./form/Field";

const EasyForm = ({ fields,
    record,
    bordered = true,
    labelAlign = "top",
    source,
    children,
    form,
    className,
    layout = "horizontal",
    submitButtonText = "Enviar",
    submitButtonSize = "large",
    ...props }) => {

    const [items,
        setItems] = useState();
    const formItemLayout =
        layout === 'horizontal'
            ? {
                labelCol: labelAlign == "left" ? { span: 4 } : labelAlign == "top" ? { span: 24 } : { span: 4 },
                wrapperCol: { span: labelAlign == "left" ? 20 : 24 },
            }
            : layout === 'vertical' ? {
                labelCol: labelAlign == "left" ? { span: 4 } : labelAlign == "top" ? { span: 24 } : { span: 4 },
                wrapperCol: { span: labelAlign == "left" ? 20 : 24 },
            } : null;
    const buttonItemLayout =
        layout === 'horizontal'
            ? {
                wrapperCol: { span: 20, offset: 4 },
            }
            : layout === 'vertical' ? {
                wrapperCol: { span: 24 }
            } : null;
    const getItems = () => {
        let items;
        if (children)
            items = React.Children.map(children, ({ ...child }, index) => {
                let { name, label } = child.props;
                let { flex, fullWidth, rules, validate, ...rest } = child.props;
                console.log('ITEM: ', child.props);
                return <Form.Item
                    label={label} {
                    ...formItemLayout}
                    style={{
                        width: fullWidth ?
                            "100%" :
                            flex ? `${flex * 100}%` : "50%"
                    }}
                    name={name || `field_${index}`}
                    rules={rules || validate}
                >
                    {
                        React.cloneElement(child, {
                            size: "large",
                            trigger: "focus",
                        })
                    }
                </Form.Item>
            });
        setItems(items);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            console.log("ERROR: ", err);
        });
    }
    useEffect(() => {
        getItems();
    }, [])
    return (
        <FormWrapper
            name='easyform'
            className={className || `easy-form ${bordered ? "form-bordered" : ""}`}
            labelAlign={labelAlign === "top" ? "left" : "right"}
            layout={layout} onSubmit={handleSubmit} {...props}>
            {children && React.Children.map(children, ({ ...child }, index) => {
                let { name, label } = child.props;
                let { flex, fullWidth, rules, validate, ...rest } = child.props;
                console.log('ITEM: ', child.props);
                return <Form.Item label={label} {...formItemLayout}
                    style={{
                        width: fullWidth ?
                            "100%" :
                            flex ? `${flex * 100}%` : "50%"
                    }}
                    name={name || `field_${index}`}
                    rules={rules || validate}
                >
                    {
                        React.cloneElement(child, {
                            size: "large",
                            trigger: "focus",
                        })
                    }
                </Form.Item>
            })}
            <Form.Item className="form-group-submit" {...buttonItemLayout}>
                <Button className="btn-submit" size={submitButtonSize || "large"} type="primary" htmlType="submit">
                    {submitButtonText}
                </Button>
            </Form.Item>
        </FormWrapper>)
}
const WrappedForm = EasyForm;
export default WrappedForm;