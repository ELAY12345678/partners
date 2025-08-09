import React, { useState, useEffect } from 'react';
import { Switch } from "antd";
const SwitchField = ({ source, name, ...props }) => {
    const [value, setValue] = useState();
    const handleChange = checked => {
        setValue(checked)
        if (props.onChange) props.onChange(String(checked));
    }
    useEffect(() => {
        if (props.record) {
            let value = props.record[source || name];
            value = (value == "true");
            setValue(value);
        }
    }, [props.record])
    return (<div>
        {<Switch
            {...props}
            checked={typeof value != "undefined" ? Boolean(value) : false}
            onChange={handleChange}
            name={props.source || props.name}
        >
            <>{props.text && <span>{props.text}</span>}</>
        </Switch>}
    </div >);
}
export default SwitchField;