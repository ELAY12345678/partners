import React, { useState, useEffect } from "react";
import { SimpleForm } from "./SimpleForm";
import styled from "styled-components";
import qs from "qs";
import {
  Input,
  Select,
  InputNumber,
  Divider,
  Checkbox,
  DatePicker,
  TimePicker,
  Button,
  Col,
  Row,
  message,
  Icon,
  Radio
} from "antd";
import { SelectField } from "./";
import FileUploader from "./FileUploader";
import GalleryUploader from "../gallery/GalleryUploader";
import {
  CustomField,
  RadioField,
  StatusField,
  MoneyField,
  SwitchField
} from "../fields/";
import { getService } from "../../../services";
import _ from "lodash";

const { TextArea } = Input;

const Form = styled(SimpleForm)`
  &.ant-form {
    width: 100% !important;
    max-width: 100% !important;
  }
  & .ant-form {
    width: 100% !important;
  }
`;
const HeadLine = styled.h2`
  color: rgb(0, 0, 0, 0.8);
  font-size: 24px;
  text-align: center;
  margin-bottom: 0px !important;
`;
const SubHeadLine = styled.h2`
  font-style: italic;
  color: rgb(0, 0, 0, 0.5);
`;
const DividerHeadLine = props => (
  <div {...props} flex={1}>
    <SubHeadLine
      style={{
        marginBottom: 0,
        ...props.style
      }}
    >
      {props.text}
    </SubHeadLine>
  </div>
);
const Combo = ({
  data = [],
  valueField = "value",
  displayField = "text",
  ...props
}) => {
  const { Option } = Select;
  return (
    <Select {...props} size="large" style={{ width: "100%", minWidth: 220 }}>
      {data.map((item, index) => (
        <Option key={item[valueField] || index}>
          {item[displayField] || "--- None ---"}
        </Option>
      ))}
    </Select>
  );
};

const Builder = ({ xtype = "text", onDisable, ...props }, index) => {
  let { required, conditional } = props;
  if (required) {
    props["validations"] = props["validations"] || [];
    props["validations"].push({
      required: props.required,
      message: props.message || `This field is required`
    });
    delete props.required;
  }
  switch (xtype) {
    case "textfield":
      if (props.multiline)
        return (
          <Input.TextArea
            key={index}
            size="large"
            autoSize={{ minRows: 3, maxRows: 5 }}
            {...props}
            name={props.source || props.name}
          />
        );
      return (
        <Input
          size="large"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "filefield":
      if (props.multiple || props.dragAndDrop)
        return (
          <GalleryUploader
            flex={1}
            size="large"
            key={index}
            {...props}
            reference={props.reference}
            name={props.source || props.name}
          />
        );
      return (
        <FileUploader
          size="large"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "numberfield":
      return (
        <InputNumber
          size="large"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "customfieldprice":
      return (
        <Row gutter={[24, 12]} flex={1} key={index}>
          <Col
            span={conditional ? 12 : 24}
            style={{ width: conditional ? "70%" : "100%" }}
          >
            <InputNumber
              style={{ width: "100%" }}
              size="large"
              disabled={conditional}
              value={props?.toValue}
              key={index}
              {...props}
              name="price_tax_excl"
            />
          </Col>
          {conditional && (
            <Col span={12} align="right" style={{ width: "30%" }}>
              <Button
                type="link"
                icon="edit"
                onClick={() => {
                  props.changebutton(!props?.statusButton);
                }}
              >
                Editar
              </Button>
            </Col>
          )}
          <div key={index}>
            {props.initial > 0 ||
              (props?.statusButton === true && (
                <>
                  <Col
                    span={12}
                    style={{
                      width: "70%"
                    }}
                    key={index}
                  >
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        width: "100%",
                        overflow: "hidden"
                      }}
                      key={index}
                    >
                      <Icon
                        type="warning"
                        theme="filled"
                        style={{ color: "#FFCC00" }}
                        key={index}
                      />
                      Este cambio solo aplica para el restaurante seleccionado
                    </p>
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      key={index}
                      name="price_tax_excl"
                      {...props}
                    />
                  </Col>
                  <Col span={12} align="right" style={{ width: "30%" }}>
                    <Button
                      type="link"
                      icon="delete"
                      style={{ marginTop: "4rem" }}
                      key={index}
                      onClick={async () => {
                        const service = getService(props.reference);
                        try {
                          await service.patch(
                            props?.idEditable,
                            { price_tax_excl: null, price_tax_incl: null },
                            {}
                          );
                          message.success("Overwrite eliminado extiosamente");
                        } catch (e) {
                          message.error(e.message);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </>
              ))}
          </div>
        </Row>
      );
      break;
    case "selectfieldcustom":
      if (conditional === true) {
        return (
          <SelectField
            size="large"
            key={index}
            {...props}
            name={props.source || props.name}
          />
        );
      }
      break;
    case "moneyfield":
      return <MoneyField {...props} name={props.source || props.name} />;
      break;
    case "selectfield":
      return (
        <Select
          size="large"
          key={index}
          name={props.source || props.name}
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          {...props}
        >
          {
            _.map(props.choices, ({ id, name }, index) =>
              <Select.Option
                key={index}
                value={id}
              >
                {name}
              </Select.Option>
            )
          }
        </Select>
      );
      break;
    case "customfield":
      return (
        <CustomField
          key={index}
          {...props}
          name={props.source || props.name}
          flex={props.flex || 1}
        />
      );
      break;
    case "statusfield":
      return (
        <StatusField key={index} {...props} name={props.source || props.name} />
      );
      break;
    case "textarea":
      return (
        <TextArea
          size="large"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "date":
      return (
        <DatePicker key={index} {...props} name={props.source || props.name} />
      );
      break;
    case "checkbox":
      return (
        <Checkbox
          key={index}
          xtype={xtype}
          {...props}
          name={props.source || props.name}
        >
          <>{props.text && <span>{props.text}</span>}</>
        </Checkbox>
      );
      break;
    case "switch":
      return <SwitchField size="large" key={index} {...props} />;

      break;
    case "combo":
      return <Combo key={index} {...props} name={props.source || props.name} />;
      break;
    case "number":
      return (
        <InputNumber
          size="large"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "divider":
      return props.text ? (
        <DividerHeadLine
          {...props}
          name={props.source || props.name}
          flex={1}
        />
      ) : (
        <Divider
          key={index}
          {...props}
          name={props.source || props.name}
          flex={1}
        />
      );
      break;
    case "headline":
      return props.text ? (
        <HeadLine {...props} name={props.source || props.name} flex={1}>
          {props.text}
        </HeadLine>
      ) : (
        <Divider
          key={index}
          {...props}
          name={props.source || props.name}
          flex={1}
        />
      );
      break;
    case "span":
      return props.text ? (
        <span {...props} flex={1}>
          {props.text}
        </span>
      ) : (
        <Divider
          key={index}
          {...props}
          name={props.source || props.name}
          flex={1}
        />
      );
      break;
    case "referenceinput":
      return (
        <Input
          type="hidden"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "hidden":
      return (
        <Input
          type="hidden"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
    case "radiofield":
      return (
        <RadioField
          key={index}
          {...props}
          name={props.source || props.name}
          defaultValue={props.source}
        />
      );
      break;
    case "radiogroupfield":
      return (
        <Radio.Group
          key={index}
          {...props}
          options={props.options}
          name={props.source || props.name}
        />
      );
      break;
    case "timefield":
      return (
        <TimePicker
          size="large"
          key={index}
          {...props}
          options={props.options}
          name={props.source || props.name}
        />
      );
      break;
    default:
      return (
        <Input
          size="medium"
          key={index}
          {...props}
          name={props.source || props.name}
        />
      );
      break;
  }
};

export const DinamicForm = ({ fields, ...props }) => {



  const [record, setRecord] = useState();
  const [items, setItems] = useState([]);

  const getFields = () => {
    if (!fields) return null;

    return fields
      .filter(item => typeof item != "undefined" && typeof item !== "boolean")
      .filter(item => (item.showByEdit ? item.showByEdit && props.id : true))
      .map((item, index) => {
        item["record"] = record || {};
        return Builder(item, index);
      });
  };

  const handleLoad = record => {
    setRecord(record);
  };

  useEffect(() => {
    setItems(getFields());
  }, [record]);

  useEffect(() => {
    if (fields) setItems(getFields());
  }, [fields]);

  return (
    <div>
      <Form onLoad={handleLoad} autoSubmit={true} {...props}>
        {[...items]}
      </Form>
    </div>
  );
};
