import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { WrapperField } from "./Styles";
const MoneyField = ({ input = false, render, record, name, source, children, ...props }) => {
    const [value, setValue] = useState();
    /*  useEffect(() => {
         if (record && record[source || name]) {
             setDefaultValue(Number(record[source || name]))
         }
     }, [record]) */
    const handleChange = value => {
        if (props.onChange) props.onChange(value);
    }
    useEffect(() => {
        if (props.initial || props.defaultValue || record) {
            let value = Number(props.initial || props.defaultValue || record[source || name]);
            if (!isNaN(value)) {
                setValue(value);
                handleChange(value);
            }
        }
    }, [props.initial, props.defaultValue, record]);
    return (<WrapperField flex={props.flex || 1} className="custom-field">
        <InputNumber
            {...props}
            size="large"
            xtype="number"
            /*  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
             parser={value => value.replace(/\$\s?|(,*)/g, '')} */
            onChange={handleChange}
            value={value}
            min={props.min || 0}
            name={source || name} />
    </WrapperField>);
}
export default MoneyField;