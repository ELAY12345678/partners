import React, { useState, useEffect } from "react";
import { Button, Divider, Icon, Input, message, Select } from "antd";
import { getService } from "../../../services";
import "./ColorPickers.css";
import _ from "lodash";
const { Option } = Select;

const defaultActions = {
  create: false,
};
const SelectField = ({
  optionValue = "id",
  autoSelect = false,
  optionText = "name",
  defaultValue,
  defaultValues = {},
  onBlur,
  actions = defaultActions,
  onSelect,
  minWidth = 150,
  onSelectItem,
  filterDefaultValues,
  resource,
  reference,
  source,
  record,
  form,
  placeholder,
  name,
  onChange,
  onSearch,
  ...props
}) => {
  const [initialized, setInitialized] = useState(false);
  /* const [defaultValue, setDefaultValue] = useState(); */
  const [initialValue, setInitialValue] = useState();
  const [onInitialized, setOnInitialized] = useState();
  const [choices, setChoices] = useState(props.choices || []);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const getInitialValue = (data) => {
    let dataSource = data || choices;
    let item;
    if (dataSource) {
      if (autoSelect && !initialized) {
        item = dataSource.find((item, index) => index === 0);
        /*  if (onChange)
                     onChange(defaultValue || item[optionValue]); */
        setInitialized(true);
      }

      if (record && record[source])
        item = dataSource.find((item, index) => {
          return source && record && item[optionValue] == record[source];
        });
      if (item) {
        setValue(defaultValue || item[optionValue]);
        setInitialValue(defaultValue || item[optionValue]);
        if (onInitialized) onInitialized("EL CITO ES GAY!");
      }
    }
  };
  const getData = async () => {
    if (resource || reference) {
      const service = getService(resource || reference);
      let token = localStorage.getItem("feathers-jwt");
      if (!token) return;
      return service
        .find({
          query: {
            ...filterDefaultValues,
            $limit: 500000,
            $sort: { name: 1 },
          },
        })
        .then((res) => {
          let data = Array.isArray(res) ? res : res.data;
          setChoices(data);
          getInitialValue(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err.message);
        });
    }
  };
  const addItem = () => {
    if ((resource || reference) && value) {
      const service = getService(reference || resource);
      setSubmitting(true);
      service
        .create({
          [source || name]: value,
          ...defaultValues,
        })
        .then(async (res) => {
          message.success("Registro agregado con éxito!");
          if (value) setInitialValue(value);
          setOpen(false);
          setSubmitting(false);
          await getData();
          if (onSelect) {
            onSelect(res[optionValue], res);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  useEffect(() => {
    if (props.onInitialized) setOnInitialized(props.onInitialized);
  }, [props.onInitialized]);
  useEffect(() => {
    if (props.defaultValue) getInitialValue();
  }, [props.defaultValue]);
  useEffect(() => {
    getData();
  }, [filterDefaultValues]);
  useEffect(() => {
    if (defaultValue) {
      setInitialValue(1);
    }
    /* return () => {
            setInitialValue(null);
        } */
  }, [defaultValue]);
  useEffect(() => {
    setChoices(props.choices);
  }, [props.choices]);
  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);
  useEffect(() => {
    if (props.value) setValue(props.value);
  }, [props.value]);
  const onNameChange = (e) => {
    let { value } = e.target;
    setValue(value);
  };
  const handleOnChange = (value) => {
    setValue(value);
    if (onChange) onChange(value);
    if (onSelectItem) {
      onSelectItem(source || name, value, record);
    }
  };
  const handleOnSelect = (value) => {
    console.log("Select: ", value);
  };
  const handleOnClear = () => {
    setInitialValue(null);
    if (props.onClear) props.onClear();
  };
  const handleSelect = _.debounce(handleOnSelect, 100);
  if (submitting) return <span>Loading...</span>;
  return (
    <Select
      {...props}
      value={choices && value}
      style={{ minWidth, ...props.style }}
      initial={initialValue}
      defaultValue={defaultValue}
      autoClearSearchValue={false}
      loading={submitting || loading}
      showSearch
      size={props.size || "large"}
      placeholder={placeholder || "Seleccionar"}
      optionFilterProp="children"
      onChange={handleOnChange}
      onSelect={handleSelect}
      onSearch={onSearch}
      allowClear={props.allowClear || true}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      /* onBlur={() => {
            setOpen(open => !open);
        }}
        onFocus={() => {
            setOpen(open => !open);
        }}
        open={open} */
      clearIcon={
        <span>
          {
            <Button
              onClick={handleOnClear}
              style={{
                margin: 0,
                padding: 0,
                position: "absolute",
                left: -10,
                top: -4,
                backgroubnd: "#154280",
              }}
              size="small"
              shape="circle"
              icon="close"
              type="default"
            />
          }
        </span>
      }
      name={name || source}
      dropdownRender={
        actions.create
          ? (menu) => (
            <div>
              {menu}
              <Divider style={{ margin: "4px 0" }} />
              <div
                style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                className="cambio-color"
              >
                <Input
                  style={{ flex: "auto" }}
                  value={value}
                  placeholder={props.addPlaceholder}
                  onChange={onNameChange}
                />
                <a
                  style={{
                    flex: "none",
                    padding: "8px",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={addItem}
                >
                  <Icon type="plus" /> Agregar
                </a>
              </div>
            </div>
          )
          : undefined
      }
    >
      {choices &&
        choices.map((it, index) => {
          return (
            <Option key={index} value={it && it[optionValue || "id"]}>
              {it && typeof optionText == "function"
                ? optionText(it)
                : it[optionText || "name"]}
            </Option>
          );
        })}
    </Select>
  );
};

export default SelectField;
