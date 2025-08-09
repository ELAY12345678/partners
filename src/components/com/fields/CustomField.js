import React from 'react';
import { WrapperField } from "./Styles";
const CustomField = ({ input = false, render, record, name, children, ...props }) => {
    return (<WrapperField flex={props.flex || 1} className="custom-field">
        {render && render(record)}
    </WrapperField>);
}
export default CustomField;