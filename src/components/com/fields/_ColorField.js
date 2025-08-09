import React, { useState, useEffect, useRef } from 'react';
import { Popover, Avatar, Button } from 'antd';
import { WrapperField } from "./Styles";
import { SketchPicker, CirclePicker } from 'react-color';
import _ from "lodash"
const MoneyField = ({ input = false, shape = "circle", onChange, render, record, name, source, children, ...props }) => {
    let myRef = useRef();
    const [background, setBackground] = useState();
    const handleChangeComplete = color => {
        setBackground(color.hex);
    }
    const handleChange = color => {
        if (onChange)
            onChange(color);
    }
    const _handleOnChange = _.debounce(handleChange, 1000, { maxWait: 1000 })
    const handleOnChange = color => {
        setBackground(color.hex);
        _handleOnChange(color.hex);
        if (myRef) {
            /* myRef.current.seFocus(); */
            myRef.props.focus()
            console.log("myRef:: ", myRef.current, myRef);
        }
    }

    useEffect(() => {
        if (record && record[source || name])
            setBackground(record[name || source]);
    }, [record])
    return (<WrapperField flex={props.flex || 1} className="custom-field">
        <Popover
            ref={myRef}
            arrowPointAtCenter
            placement="bottom"
            trigger={props.trigger || "click"}
            content={<div>
                {shape == "picker" && <SketchPicker
                    {...props}
                    color={background}
                    onChangeComplete={handleChangeComplete}
                    onChange={handleOnChange}
                    name={source || name} />}
                {shape == "circle" && <CirclePicker
                    {...props}
                    color={background}
                    onChangeComplete={handleChangeComplete}
                    onChange={handleOnChange}
                    name={source || name} />}
            </div>}
        >
            <Button
                shape="square"
                size={props.size || "large"}
                style={{
                    minWidth: 50,
                    minHeight: 50,
                    backgroundColor: background || '#fff'
                }}
            />
        </Popover>
    </WrapperField>);
}
export default MoneyField;