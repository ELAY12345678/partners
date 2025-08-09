import React from "react";
import { Checkbox } from "antd";
import "./checkboxgroup.css";
const CheckBoxGroup = ({
  onChange,
  dataSource = [],
  name,
  displayField = "name",
  valueField = "id",
  initialValue
}) => {
  dataSource = dataSource.map(item => {
    return {
      label: item[displayField],
      value: item[valueField]
    };
  });
  return (
    <Checkbox.Group
     className="checkbox-group"
      name={name}
      style={{ width: "100%" }}
      options={dataSource}
      defaultValue={initialValue}
      onChange={onChange}
    />
  );
};

export default CheckBoxGroup;
