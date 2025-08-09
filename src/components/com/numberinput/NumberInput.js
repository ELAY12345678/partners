import React, { useState, useEffect } from "react";
import {
  Input,
  Icon,
  Button,
  Row,
  Col,
  Steps,
  InputNumber,
  Tooltip
} from "antd";
import { Wrapper } from "./Styles";
const NumberInput = ({ steps = 4, maxLength = 13, ...props }) => {
  const [edit, setEdit] = useState(false);
  const [items, setItems] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [value, setValue] = useState();
  const [clipboard, setClipBoard] = useState(null);
  const [form, setForm] = useState(null);
  const handleOnChange = () => {};
  const onChange = e => {
    const { value } = e.target;
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;

    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      console.log(`---> ${value}`);
      /* if (value.length > maxLength) {
        value = value.slice(0, maxLength);
      } */
      setValue(value);
      if (props.onChange) props.onChange(value);
    }
  };
  // '.' at the end or only '-' in the input box.
  const onBlur = () => {
    const { onBlur, onChange } = props;
    let valueTemp = value;
    /* if ((value && value.charAt(value.length - 1) === ".") || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    */
    setValue(valueTemp);
    /* if (valueTemp) onChange(valueTemp.replace(/(\d+)/, "$1")); */
    if (valueTemp) onChange(valueTemp);
    if (onBlur) {
      onBlur();
    }
  };
  useEffect(() => {
    if (props.value && !initialized) {
      if (props.name && props.record) {
        console.log(`>>OnChanged: `, props, props.value);
        setValue(props.record[props.name]);
        setInitialized(true);
      }
    }
    return () => {};
  }, [props.record]);
  const clipboardData = async () => {
    try {
      const text = await window.navigator.clipboard.readText();
      if (text) setClipBoard(text);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };
  const formatter = value => {
    var cleaned = ("" + value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{2})(\d{4})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + "-" + match[2] + "-" + match[3] + "-" + match[4];
    }
    return null;
  };
  useEffect(() => {
    clipboardData();
  }, []);
  return (
    <Wrapper>
      {
        <Row type="flex" justify="start" gutter={4}>
          <Col span={20}>
            {edit && (
              <Input
                onChange={onChange}
                onBlur={onBlur}
                placeholder={props.placeholder}
                maxLength={13}
                defaultValue={value}
                type="number"
                /* value={value} */
                /* addonAfter={} */
                onPaste={e => {
                  let value = e.clipboardData.getData("Text");
                  let match = formatter(value);
                  value = value.replace(/\-/g, "");
                  setEdit(false);
                  setValue(value);
                  setPasting(true);
                  let timePaste = setTimeout(() => {
                    setPasting(false);
                    setEdit(!match);
                    clearTimeout(timePaste);
                  }, 800);
                }}
              />
            )}
            {!edit && (
              <InputNumber
                disabled
                /* value={value} */
                defaultValue={value}
                /* onChange={onChange} */
                style={{
                  width: "100%"
                }}
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                formatter={formatter}
                name="ParcelNumber"
                initial={undefined}
                placeholder={props.placeholder}
              />
            )}
          </Col>
          <Col>
            {
              <Button
                onClick={() => {
                  if (edit && props.onChange) props.onChange(value);
                  setEdit(edit => !edit);
                }}
                loading={pasting}
                size="large"
                icon={!edit ? "edit" : "check"}
                type="dashed"
              />
            }
          </Col>
          {!pasting && (
            <Col>
              <Button
                onClick={async () => {
                  let value = await window.navigator.clipboard.readText();
                  let match = formatter(value);
                  value = value.replace(/\-/g, "");
                  setEdit(false);
                  setValue(value);
                  setPasting(true);
                  let timePaste = setTimeout(() => {
                    setPasting(false);
                    setEdit(!match);
                    if (props.onChange) props.onChange(value);
                    clearTimeout(timePaste);
                  }, 100);
                  setValue(value);
                }}
                loading={pasting}
                size="large"
                icon="copy"
                type="dashed"
              />
            </Col>
          )}
        </Row>
      }
    </Wrapper>
  );
};
export default NumberInput;
