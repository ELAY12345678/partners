import React, { useState, useEffect } from "react";
import { Select, Button, Row, Col } from "antd";
import { TagWrapper } from "./Styles";
const { Option } = Select;
const statusDefautls = [
  {
    id: "active",
    name: "Activo"
  },
  {
    id: "inactive",
    name: "Inactivo"
  },
]
const StatusField = ({
  editable = false,
  input = false,
  initial,
  record,
  name,
  source,
  disabled,
  optionValue = "id",
  optionText = "name",
  ...props
}) => {
  const [choices, setChoices] = useState([]);
  const [value, setValue] = useState();
  const [current_value, setCurrentValue] = useState();
  const [edit, setEdit] = useState(false);
  const [item, setItem] = useState({});
  const getInitialValue = () => {
    let initialValue = choices.find(item => {
      return item[optionValue] == initial || item[optionValue] == record[name || source];
    });
    setItem(initialValue);
    initialValue = initialValue ? initialValue[optionText] : "";
    setValue(initialValue);
    setCurrentValue(initialValue);
  };
  const handleEdit = () => {
    setEdit(edit => !edit);
  };
  const handleSelect = value => {
    if (source) {
      setCurrentValue(value);
      let find = choices.find(item => item[optionValue] == value);
      if (find) setValue(find[optionText]);
      setEdit(false);
      if (props.onItemSelect && record)
        props.onItemSelect(source, value, record);
    }
  };
  useEffect(() => {
    if (props.choices) {
      setChoices(props.choices);
    } else {
      setChoices(statusDefautls)
    }
  }, [props.choices]);
  useEffect(() => {
    if (choices.length > 0 && record)
      getInitialValue();
  }, [choices]);
  if (!input) {
    if (!value) return null;
    return (
      <Row type="flex" justify="start" align="middle">
        <Col>
          {!edit ? (
            <TagWrapper
              disabled={disabled}
              className={`status ${record ? record[name || source] : ""}`}
            /*  style={{
               color: item.color || "#87d068"
             }}
             color={item.background || "transparent"} */
            >
              {record[name || source]}
              {value}
            </TagWrapper>
          ) : (
            <Select
              choices={choices}
              defaultValue={current_value}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onSelect={handleSelect}
              style={{
                minWidth: 150
              }}
              {...props}
            >
              {choices &&
                choices.map(item => (
                  <Option key={item[optionValue]} value={item[optionValue]}>
                    {typeof optionText == "function"
                      ? optionText(name, item)
                      : item[optionText]}
                  </Option>
                ))}
            </Select>
          )}
        </Col>
        <Col>
          {editable && (
            <Button
              type="link"
              icon={!edit ? "edit" : "close"}
              onClick={handleEdit}
            />
          )}
        </Col>
      </Row>
    );
  }
  return (
    <Select
      dataSource={choices}
      parser={value => value.replace(/\$\s?|(,*)/g, "")}
      {...props}
    >
      {choices &&
        choices.map(item => (
          <Option key={item[optionValue]} value={item[optionValue]}>
            {typeof optionText == "function"
              ? optionText(name, item)
              : item[optionText]}
          </Option>
        ))}
    </Select>
  );
};
export default StatusField;
