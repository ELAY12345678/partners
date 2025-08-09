import React from 'react';
import { Form, Input } from "antd";
import Factory from './Factory';
const { Item } = Form;
const Field = ({ form, children, ...props }) => {
    return (
        <Item
            label="E-mail"
            name='email'
            rules={
                [
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]
            }
        >
            <Input form={form} {...props} />
        </Item>
    );
}
export default Field;