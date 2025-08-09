import React, { useState, useEffect } from "react";
import { Button, Icon, Input, message, Select } from "antd";
import { getService } from "../../../services";
import _ from "lodash";
import { WrapperSelect } from "./Styles";

import { AiOutlineCloseCircle } from 'react-icons/ai';

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
  showSearch,
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
  const [filterDefaultValues, setFilterDefaultValue] = useState();
  const [initialValue, setInitialValue] = useState();
  const [onInitialized, setOnInitialized] = useState();
  const [choices, setChoices] = useState(props.choices || []);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [add, setAdd] = useState(false);
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
          return source && record && item[optionValue] === record[source];
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
      setLoading(true);
      if (!loading)
        return service
          .find({
            query: {
              ...filterDefaultValues,
              $limit: 500000,
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
          setAdd(false);
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

  const cancelItem = () => {
    setAdd(false);
  };

  useEffect(() => {
    if (props.onInitialized) setOnInitialized(props.onInitialized);
  }, [props.onInitialized]);

  useEffect(() => {
    if (props.defaultValue) getInitialValue();
  }, [props.defaultValue]);

  useEffect(() => {
    if (filterDefaultValues) getData();
  }, [filterDefaultValues]);

  useEffect(() => {
    if (typeof props.filterDefaultValues == "undefined") {
      setFilterDefaultValue(props.filterDefaultValues || {});
    } else if (!_.isEqual(props.filterDefaultValues, filterDefaultValues)) {
      setFilterDefaultValue(props.filterDefaultValues);
    }
  }, [props.filterDefaultValues]);

  useEffect(() => {
    if (defaultValue) {
      setInitialValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (props.choices) setChoices(props.choices);
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
      let record = choices.find((it) => it[optionValue] == value);
      onSelectItem(source || name, value, record);
    }
  };
  const handleOnSelect = (value) => {
    if (value) setValue(value);
    if (choices) {
      let item = choices.find((item) => item && item[optionValue] == value);
      setOpen(false);
      if (onSelect && item) onSelect(value, item);
    }
  };
  const handleOnClear = () => {
    setInitialValue(null);
    if (props.onClear) props.onClear();
  };
  const handleSelect = _.debounce(handleOnSelect, 800, { maxWait: 800 });
  const handleChange = _.debounce(handleOnChange, 800, { maxWait: 800 });

  if (submitting) return <span>Loading...</span>;
  return (
    <WrapperSelect display={actions.create && !add ? "flex" : "block"}>
      {!add && (
        <Select
          {...props}
          value={choices && value}
          style={{
            minWidth,
            ...props.style,
          }}
          initial={initialValue}
          defaultValue={defaultValue}
          loading={submitting || loading}
          showSearch
          size={props.size || "large"}
          placeholder={placeholder || "Seleccionar"}
          optionFilterProp="children"
          onChange={handleChange}
          onSelect={handleSelect}
          onSearch={onSearch}
          allowClear={props.allowClear || true}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          /* onBlur={() => {
                setOpen(open => !open);
            }}
            onFocus={() => {
                setOpen(open => !open);
            }}
            open={open} */
          clearIcon={
            <Button
              onClick={handleOnClear}
              style={{
                margin: 0,
                padding: 0,
                position: "absolute",
                left: -10,
                top: -4,
              }}
              size="small"
              shape="circle"
              type="default"
              icon={<AiOutlineCloseCircle />}
            />
          }
          name={name || source}
        /* dropdownRender={actions.create ? menu => (
              <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <Input
                          style={{ flex: 'auto' }} value={value}
                          placeholder={props.addPlaceholder}
                          onChange={onNameChange} />
                      <a
                          style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                          onClick={addItem}
                      >
                          <Icon type="plus" /> Agregar
                      </a>
                  </div>
              </div>
          ) : undefined} */
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
      )}
      {actions.create && !add && (
        <Button
          className="container-button-plus"
          onClick={() => setAdd((add) => !add)}
          type="primary"
        >
          {!add ? "Add" : "save"}
        </Button>
      )}
      {actions.create && add && (
        <div className={""}>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 8,
            }}
          >
            <Input
              /* style={{ flex: 'auto' }} */
              value={value}
              placeholder={props.addPlaceholder}
              onChange={onNameChange}
              size="large"
            />
            <Button
              className="container-button-plus"
              disabled={!value}
              /* style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }} */
              type="primary"
              onClick={addItem}
            >
              Save
            </Button>
            <Button
              className="container-button-plus"
              disabled={!value}
              /* style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }} */
              type="danger"
              onClick={cancelItem}
            >
              <AiOutlineCloseCircle />
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </WrapperSelect>
  );
};

export default SelectField;
