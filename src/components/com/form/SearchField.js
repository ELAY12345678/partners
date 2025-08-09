import React, { useState, useEffect, useRef } from "react";
import { Input, AutoComplete, message } from "antd";
import styled from "styled-components";
import { getService } from "../../../services/";
import debounce from "lodash/debounce";
const Wrapper = styled(AutoComplete)`
  & .ant-input {
    border-radius: 20px !important;
    box-shadow: 3px 3px 3px rgba(224, 224, 224, 0.4) !important;
    border: 1px solid rgba(224, 224, 224, 0.8) !important;
  }
`;
const SearchField = ({
  placeholder,
  choices,
  record,
  initial,
  defaultValue,
  defaultFilterValues = {},
  form,
  optionText = "name",
  optionValue = "_id",
  searchKey = "search",
  name,
  source,
  onData,
  onReset,
  ...props
}) => {
  const [data, setData] = useState([]);
  const service = getService(source || "");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();
  const [initialized, setInitialized] = useState(false);
  /* const handleSearch = value => {
    search(value);
  }; */
  const getInitialValue = _id => {
    if (choices) {
      setLoading(false);
      return setData(choices || []);
    }
    if (source) {
      setLoading(true);
      if (!initial && !_id) {
        return setLoading(false);
      }
      service
        .get(initial || _id)
        .then(response => {
          setLoading(false);
          setData([response]);
        })
        .catch(error => {
          setLoading(false);
          message.error(error.message);
        });
    }
  };

  const search = value => {
    if (!value && onReset) return onReset();
    if (value && source) {
      setLoading(true);
      service
        .find({
          query: {
            [searchKey]: value,
            ...defaultFilterValues
          }
        })
        .then(({ data }) => {
          setLoading(false);
          if (onData) onData(data);
          if (typeof data === "object" && Array.isArray(data)) {
            setData(data);
          }
        })
        .catch(error => {
          setLoading(false);
          message.error(error.message);
        });
    }
  };
  const handleSearch = debounce(search, 100, { maxWait: 800 });
  let myRef = useRef();
  const { Option } = AutoComplete;
  useEffect(() => {
    if (!initialized) {
      let value = props["data-__meta"]
        ? props["data-__meta"].initialValue
        : null;
      if (typeof value != "undefined") {
        getInitialValue(value);
        setInitialized(true);
      }
    }
  }, [props["data-__meta"]]);
  return (
    <>
      <Wrapper
        xtype="search"
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={500}
        style={{ width: 250, ...props.style }}
        onSearch={handleSearch}
        onBlur={() => {
          if (form) {
            form.setFieldsValue({
              [name]: value
            });
          }
        }}
        onSelect={value => {
          setValue(value);
          if (props.onSelectItem) {
            let record = data.find(item => item.id == value);
            props.onSelectItem(name, value, record, form);
          }
        }}
        ref={myRef}
        dataSource={data.map(
          it =>
            props.renderItem || (
              <Option key={it[optionValue]}>
                {typeof optionText == "function"
                  ? optionText(it[name || optionValue], it)
                  : it[optionText]}
              </Option>
            )
        )}
        {...props}
      >
        <Input.Search
          loading={loading}
          size="large"
          placeholder={placeholder || "Search"}
        />
      </Wrapper>
    </>
  );
};
export default SearchField;
