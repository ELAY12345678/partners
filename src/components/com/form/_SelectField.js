import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import { getService } from "../../../services";
import _ from "lodash";
const { Option } = Select;
const SelectField = ({
  optionValue,
  resource,
  reference,
  source,
  record,
  form,
  optionText,
  placeholder,
  name,
  onSearch,
  choices,
  ...props
}) => {
  const [initialized, setInitialized] = useState(false);
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const getData = async () => {
    let record = form.getFieldsValue();
    let initialValue;
    if (resource || reference) {
      const service = getService(resource || reference);
      let id = record[source];
      if (!initialized) {
        if (id)
          service
            .get(id)
            .then(response => {
              if (choices) {
                initialValue = response[optionText] || response[name];
                if (
                  typeof initialValue == "string" &&
                  props.mode == "multiple"
                ) {
                  initialValue = initialValue.split(",");
                }
                setDefaultValue(initialValue);
                form.setFieldsValue({
                  [name]: initialValue
                });
              }
              setInitialized(true);
            })
            .catch(err => {
              message.error(err.message);
            });
      }
    } else {
      if (record && record[name] && !initialized) {
        initialValue = record[name];
        if (typeof initialValue == "string" && props.mode == "multiple") {
          initialValue = initialValue.split(",");
        }
        form.setFieldsValue({
          [name]: initialValue
        });
      }
      setInitialized(true);
    }
  };
  useEffect(() => {
    if (form) {
      let record = form.getFieldsValue();
      if (form && record && !initialized) getData();
    }
  }, [form]);
  const search = value => {
    if (onSearch) onSearch(value);
  };
  const handleSearch = _.debounce(search, 1000, { maxWait: 1000 });
  // if (!initialized) return <span>Loading...</span>;
  return (
    <Select
      style={{ minWidth: 150 }}
      initial={defaultValue}
      showSearch
      size={props.size || "large"}
      placeholder={placeholder || "Select a option"}
      optionFilterProp="children"
      /* onChange={onChange} */
      onSearch={handleSearch}
      filterOption={(input, option) =>
        option.props.children &&
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      name={name}
      {...props}
    >
      {choices &&
        choices.map((it, index) => {
          return (
            <Option key={index} value={it[optionValue || "id"]}>
              {typeof optionText == "function"
                ? optionText(it)
                : it[optionText || "name"]}
            </Option>
          );
        })}
    </Select>
  );
};

export default SelectField;
