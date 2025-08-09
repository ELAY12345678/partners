import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { WrapperField } from "./Styles";
const RadioField = ({ input = false, optionText = "name", optionValue = "id", source, render, record, name, children, ...props }) => {
    const [choices, setChoices] = useState([]);
    const [initialvalue, setInitialValue] = useState();
    const handleOnChange = e => {
        let { value } = e.target;
        if (source) {
            if (props.onChange) props.onChange(value, source);
        }
    }
    const renderItems = item => {
        return <Radio value={item[optionValue]}>{item[optionText]}</Radio>
    }
    useEffect(() => {
        if (props.choices) {
            setChoices(props.choices);
        }
    }, [props.choices]);
    useEffect(() => {
        if (record && record[source]) {
            setInitialValue(record[source]);
        }
    }, [record]);
    return (<WrapperField flex={props.flex || 1} className="custom-field">
        <Radio.Group
            defaultValue={initialvalue}
            onChange={handleOnChange} /* value={value} */>
            {
                choices.map(item => renderItems(item))
            }
        </Radio.Group>
    </WrapperField>);
}
export default RadioField;