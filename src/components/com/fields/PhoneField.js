import React from 'react';
import { InputNumber } from "antd";
const PhoneField = ({ input = false, record, name, ...props }) => {

    const formatter = value => {
        var cleaned = ('' + value).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null;
    }
    if (!input) {
        return <>
            {record && formatter(record[name])}
        </>
    }
    return (<InputNumber
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        formatter={formatter}
        {...props} />)
}
export default PhoneField;