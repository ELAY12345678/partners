import React from "react";
import { Switch } from "antd";
const ToggleField = (props) => {
  function onChange(checked) {
    props.onChange(String(checked));
  }
  return (
    <Switch
      size={"default"}
      defaultChecked={
        props.initialValue === "true" || props.initialValue === "active"
      }
      onChange={onChange}
    />
  );
};
export default ToggleField;
