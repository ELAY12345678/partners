import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Icon,
  List,
  Menu,
  message,
  Row,
} from "antd";
import { getService } from "../../services";
import ListItems from "./ListItems";
import { WrapperSection, WrapperList, FormWrapper } from "./Styles";
import { DinamicForm, SelectField } from "../com/form/";
import { MyModal } from "../com";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { WrapperWarning } from "../../views/menu-categories/style";

const CustomSection = (props) => {
  const [item_id, setItemId] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const getData = () => {
    const service = getService("personalization-menu-item-sections");
    setLoading(true);
    service
      .find({
        query: {
          menu_item_id: item_id, //5
        },
      })
      .then(({ data }) => {
        setDataSource(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  const handleCheckAll = (e) => {
    let { checked } = e.target;
    setCheckAll(checked);
    if (checked) {
      setSelection(dataSource.map((it) => it.personalization_section.id));
    } else {
      setSelection([]);
    }
  };
  const handleCheck = (e, id) => {
    let { checked } = e.target;
    if (checked) {
      setSelection((selection) => [...selection, id]);
    } else {
      setCheckAll(false);
      setSelection((selection) => selection.filter((it) => it != id));
    }
  };
  const renderItem = (item, index) => {
    return (
      <List.Item>
        <div>
          <Checkbox
            onChange={(e) => handleCheck(e, item.personalization_section.id)}
            checked={selection.includes(item.personalization_section.id)}
          />{" "}
          <span>{item.personalization_section.name}</span>
        </div>
      </List.Item>
    );
  };
  useEffect(() => {
    if (props.item_id) {
      setItemId(props.item_id);
    }
  }, [props.item_id]);
  useEffect(() => {
    if (typeof item_id == "number") {
      getData();
    }
  }, [item_id]);
  useEffect(() => {
    if (props.onChange) props.onChange(selection);
  }, [selection]);
  return (
    <WrapperList>
      {
        <List
          header={
            dataSource.length > 0 && (
              <div className="header-section">
                <Checkbox checked={checkAll} onChange={handleCheckAll} />{" "}
                <h3>Secciones</h3>
              </div>
            )
          }
          loading={loading}
          dataSource={dataSource}
          renderItem={renderItem}
        />
      }
    </WrapperList>
  );
};
const ItemSection = ({
  filterDefaultValues = {},
  reference,
  title,
  ...props
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading_sections, setLoadingSections] = useState(false);
  const [sectionId, setSectionId] = useState();
  const [item, setItem] = useState({});
  const [optionId, setOptionId] = useState();
  const [optionName, setOptionName] = useState();
  const [showOption, setShowOption] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [showImportSection, setShowImportSection] = useState(false);
  const [payloads, setPayloads] = useState({});
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState();
  const [option, setOption] = useState();
  const [new_option_id, setOptionNewId] = useState();
  const [item_id, setItemId] = useState();
  const [option_type, setOptionType] = useState("add-section");
  const [brand_id, setRestaurantId] = useState();
  const [personalizationSectionId, setPersonalizationSectionId] = useState();
  const [
    allPersonalizationOptionsSections,
    setAllPersonalizationOptionsSections,
  ] = useState();
  const [visibleOptionsSections, setVisibleListOptionsSections] = useState(
    false
  );

  async function getAllPersonalizationOptionsSections(id) {
    const service = getService("personalization-menu-item-sections");
    if (id !== undefined) {
      try {
        const response = await service.find({
          query: {
            personalization_section_id: id,
          },
        });
        setAllPersonalizationOptionsSections(response);
      } catch (e) {
        message.error(e.message);
      }
    }
  }

  useEffect(() => {
    if (personalizationSectionId !== undefined) {
      getAllPersonalizationOptionsSections(personalizationSectionId);
    }
  }, [personalizationSectionId]);

  const handleDisable = (value, item) => {
    const service = getService("personalization-opt-sections");
    service
      .patch(item.id, {
        status: value ? "active" : "inactive",
      })
      .then((res) => {
        message.success("Opción actualizada!");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const handleOnEdit = (item) => {
    if (item) {
      setSection(item);
      setSectionId(item.id);
      setShowSection(true);
    }
  };
  const handleOnEditOption = (item) => {
    setOptionId(item.id);
    setOption(item);
    setShowOption(true);
  };
  const handleAddItem = (id) => {
    setSectionId(id);
    setOptionId(null);
    setShowOption(true);
  };
  const handleRemove = (id) => {
    const service = getService("personalization-opt-sections");
    if (id)
      service
        .remove(id)
        .then((res) => {
          message.success("Registro eliminado!");
          getSections();
        })
        .catch((err) => {
          message.error(err.message);
        });
  };
  const getData = (current_item) => {
    current_item = current_item || item;
    if (reference && current_item) {
      const service = getService(reference);
      setLoading(true);
      service
        .find({
          query: {
            menu_item_id: current_item.id ? current_item.id : undefined,
            ...filterDefaultValues,
          },
        })
        .then(({ data }) => {
          setDataSource(data);
          setLoading(false);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  const handleChangeRadio = (field, value) => {
    setOptionType(value);
  };
  const handleChangeProduct = (value) => {
    setItemId(value);
  };
  const handleSubmit = () => {
    let { sections_ids } = payloads;
    /* return getData(); */
    if (sections_ids && item_id) {
      let bulk_payloads = sections_ids.map((it) => ({
        personalization_section_id: it,
        menu_item_id: item.id,
      }));
      const service = getService("personalization-menu-item-sections");
      service
        .create(bulk_payloads)
        .then((res) => {
          getSections();
          message.success("Sección copiada!");
          setShowImportSection(false);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  const handleChangeSection = (field, value) => {
    if (field != "menu_item_id_origin")
      setPayloads({
        ...payloads,
        [field]: value,
      });
  };
  const getSections = (item) => {
    item = item || props.item;
    if (item) {
      const service = getService("personalization-menu-item-sections");
      setLoadingSections(true);
      service
        .find({
          query: {
            menu_item_id: item.id,
            $client: {
              fromAdmin: true,
            },
          },
        })
        .then(({ data }) => {
          setSections(data);
          setLoadingSections(false);
        })
        .catch((err) => {
          message.error(err.message);
          setLoadingSections(false);
        });
    }
  };
  const handleRemoveSection = (id) => {
    const service = getService("personalization-menu-item-sections");
    if (id)
      service
        .remove(id)
        .then((res) => {
          message.success("Registro eliminado!");
          setSectionId(null);
          setShowSection(false);
          getSections(item);
        })
        .catch((err) => {
          message.error(err.message);
        });
  };
  const handleMenuClick = (key, record, item) => {
    switch (key) {
      case "edit":
        handleOnEdit(record);
        break;
      case "delete":
        handleRemoveSection(item.id);
        break;
      default:
        break;
    }
  };
  const MenuItems = (props) => (
    <Menu
      className={props.className || "list-menu"}
      onClick={({ key }) => handleMenuClick(key, props.record, props.item)}
    >
      {
        <Menu.Item key="edit">
          <Icon type="edit" />
          Editar
        </Menu.Item>
      }
      {
        <Menu.Item key="delete">
          <Icon type="delete" />
          Eliminar
        </Menu.Item>
      }
    </Menu>
  );
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const restaurante = urlParams.get("brand_id");
    setRestaurantId(Number(restaurante));
  }, []);
  useEffect(() => {
    if (props.item) {
      // alert('item.id' + props.item.id); //desactivado por daniel mientras se soluciona
      if (item.id != props.item.id) {
        setItem(props.item);
        getSections(props.item);
      }
    }
  }, [props.item]);
  if (loading_sections) return "Cargando...";
  return (
    <WrapperSection>
      {title && <h2>{title}</h2>}
      {sections.map((it) => {
        let { personalization_section } = it;
        if (
          personalization_section &&
          personalization_section.personalization_opt_sections
        ) {
          let description = `Min: ${personalization_section.min_selects} | Max: ${personalization_section.max_selects} | Obligatorio: ${personalization_section.required}`;

          const onRemoveItem = (id) => {
            personalization_section.personalization_opt_sections = personalization_section.personalization_opt_sections.filter(
              (it) => it.id != id
            );
            handleRemove(id);
          };
          return (
            <ListItems
              goTop={false}
              header={
                <div className="item-head-cotainer">
                  <div className="head-title">
                    {personalization_section.name}
                  </div>
                  <div className="head-actions">
                    <Dropdown
                      trigger={["click"]}
                      overlay={() => (
                        <MenuItems item={it} record={personalization_section} />
                      )}
                    >
                      <Button
                        /* onClick={() => handleOnEdit(it.id)} */
                        onClick={(e) => e.preventDefault()}
                        type="link"
                        icon="more"
                      />
                    </Dropdown>
                  </div>
                </div>
              }
              description={description}
              bordered={false}
              loading={loading}
              mode="form"
              onAdd={() => handleAddItem(personalization_section.id)}
              actionCreateText="Agregar Opción"
              /* renderItem={item => (<div>{JSON.stringify(item)}</div>)} */
              fullHeight={false}
              onDisable={handleDisable}
              onRemove={onRemoveItem}
              onEdit={handleOnEditOption}
              dataSource={personalization_section.personalization_opt_sections}
              showAvatar={false}
              actions={{
                edit: true,
                delete: true,
                disable: true,
                create: true,
                /* extra: [
                                <Button onClick={(item) => handleOnEditOption(item)} type="link" icon="edit" />
                            ] */
              }}
            />
          );
        }
      })}
      <Row gutter={0} type="flex" justify="center" align="middle">
        <Col span={12}>
          <Button
            block
            onClick={() => {
              setSectionId(null);
              setSection(null);
              setShowSection(true);
            }}
            icon="plus"
            type="link"
            size="large"
          >
            Crear Sección
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            onClick={() => {
              setSectionId(null);
              setSection(null);
              setShowImportSection(true);
            }}
            icon="download"
            type="link"
            size="large"
          >
            Importar Sección
          </Button>
        </Col>
      </Row>
      {showSection && (
        <MyModal
          title={`${sectionId ? "Editar" : "Crear"}`}
          onCancel={() => {
            setShowSection(false);
          }}
          visible={showSection}
        >
          <DinamicForm
            id={sectionId}
            source={"personalization-section"}
            fields={[
              {
                xtype: "textfield",
                flex: 1,
                source: "name",
                label: "Nombre de la sección",
                placeholder: "Ej. Salsas, Tamaño etc",
              },
              {
                xtype: "radiogroupfield",
                flex: 1,
                source: "required",
                label: "Tipo de Sección",
                options: [
                  {
                    value: "true",
                    label: "Obligatorio: El cliente debe escoger una opción.",
                  },
                  {
                    value: "false",
                    label:
                      "Opcional: El cliente no esta obligado a escoger una opción.",
                  },
                ],
              },
              {
                xtype: "span",
                text: "¿Cuantas opciones puede seleccionar el cliente?",
              },
              {
                xtype: "numberfield",
                source: "min_selects",
                min: 1,
                initial: 0,
                label: "Minimo",
                placeholder: "Minimo de Selecciones",
              },
              {
                xtype: "numberfield",
                min: 1,
                initial: 1,
                source: "max_selects",
                label: "Máximo",
                placeholder: "Máximo de Selecciones",
              },
              !sectionId
                ? {
                    type: "hidden",
                    source: "menu_item_id",
                    initial: item && item.id,
                  }
                : undefined,
              !sectionId
                ? {
                    type: "hidden",
                    source: "brand_id",
                    initial: brand_id,
                  }
                : undefined,
            ]}
            initialValues={section}
            textAcceptButton={sectionId ? "Editar Sección" : "Crear Sección"}
            onSubmit={() => {
              setSectionId(null);
              setShowSection(false);
              getSections(item);
            }}
          />
        </MyModal>
      )}
      {/* modal-impportar-sections */}
      {showImportSection && (
        <MyModal
          title={`Importar Sección`}
          onCancel={() => {
            setShowImportSection(false);
          }}
          visible={showImportSection}
        >
          <DinamicForm
            source={"personalization-section"}
            autoSubmit={false}
            onChange={handleChangeSection}
            footer={
              <div>
                <Button type="primary" block onClick={handleSubmit}>
                  Importar Sección
                </Button>
              </div>
            }
            fields={[
              {
                xtype: "selectfield",
                reference: "menu-items",
                label: "Selecciona el producto",
                flex: 1,
                name: "menu_item_id_origin",
                onSelect: handleChangeProduct,
                placeholder: "Selecciona el producto",
                filterDefaultValues: {
                  brand_id,
                },
              },
              {
                xtype: "customfield",
                name: "sections_ids",
                render: (record) => {
                  return (
                    <CustomSection
                      name="sections_ids"
                      item_id={item_id}
                      onChange={(selection) => {
                        setPayloads({
                          ...payloads,
                          sections_ids: selection,
                        });
                      }}
                    />
                  );
                },
              },
              !sectionId
                ? {
                    type: "hidden",
                    source: "menu_item_id",
                    initial: item && item.id,
                  }
                : undefined,
              !sectionId
                ? {
                    type: "hidden",
                    source: "brand_id",
                    initial: brand_id,
                  }
                : undefined,
            ]}
            initialValues={section}
            textAcceptButton={"Importar Sección"}
            onSubmit={() => {
              setSectionId(null);
              setShowSection(false);
              getData();
            }}
          />
        </MyModal>
      )}
      {
        <MyModal
          title={`${optionId ? "Editar Opción" : "Crear Opción"}`}
          onCancel={() => {
            setShowOption(false);
          }}
          visible={showOption}
        >
          {optionId && (
            <div
              style={{
                boxShadow: " 3px 3px 3px rgba(0, 0, 0, 0.03)",
                border: "1px solid #e8e8e85e",
                borderRadius: " 20px",
                lineHeight: "27px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "#ffffff",
                backgroundColor: "#d60915",
              }}
            >
              <Icon
                type="warning"
                style={{ color: "#FFCC00" }}
                theme="filled"
              />
              ATENCIÓN: Este cambio afectara a
              {allPersonalizationOptionsSections?.total}
              {allPersonalizationOptionsSections?.total > 1 ? "items" : "item"}
            </div>
          )}

          {optionId && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="link"
                icon="eye"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() =>
                  setVisibleListOptionsSections(!visibleOptionsSections)
                }
              >
                Ver items
              </Button>
            </div>
          )}

          {visibleOptionsSections && (
            <ul
              style={{
                listStyle: "none",
                boxShadow: " 3px 3px 3px rgba(0, 0, 0, 0.05)",
                borderRadius: " 20px",
                lineHeight: "27px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {allPersonalizationOptionsSections?.data.map((it) => (
                <li
                  style={{
                    boxShadow: " 3px 3px 3px rgba(0, 0, 0, 0.03)",
                    border: "1px solid #e8e8e85e",
                    borderRadius: " 20px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#6610f2",
                  }}
                >
                  {it?.menu_item_id}
                </li>
              ))}
            </ul>
          )}

          {!optionId && (
            <span
              style={{
                margin: 4,
              }}
            >
              Seleccionar Opción
            </span>
          )}
          {!optionId && (
            <SelectField
              source="name"
              label="Seleccionar Opción"
              onSelect={(value) => {
                setOptionNewId(value);
              }}
              style={{
                width: "100%",
              }}
              actions={{ create: true }}
              addPlaceholder="Agrega Nombre de la Opción"
              reference="personalization-options"
              placeholder="Seleccionar Opción"
              defaultValues={{ brand_id }}
              filterDefaultValues={{
                brand_id,
                $sort: {
                  name: 1,
                },
              }}
            />
          )}
          <FormWrapper>
            <DinamicForm
              id={optionId}
              onLoad={(data) =>
                setPersonalizationSectionId(data?.personalization_section_id)
              }
              source={"personalization-opt-sections"}
              fields={[
                {
                  type: "hidden",
                  flex: 1,
                  source: "personalization_option_id",
                  validations: [
                    { required: true, message: "Debe seleccionar una opción" },
                  ],
                  initial: new_option_id,
                },
                {
                  xtype: "numberfield",
                  source: "price_tax_incl",
                  formatter: (value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  parser: (value) => value.replace(/\$\s?|(,*)/g, ""),
                  min: 0,
                  label: "Precio impuesto incluido",
                  placeholder: "Precio impuesto incluido",
                },
                {
                  xtype: "selectfield",
                  source: "tax_id",
                  validations: [
                    {
                      required: true,
                      message: "Este campo es requerido",
                    },
                  ],
                  reference: "tax",
                  label: "Impuestos incluidos en el precio",
                  placeholder: "Impuestos incluidos en el precio",
                },

                {
                  type: "hidden",
                  source: "personalization_section_id",
                  initial: sectionId,
                },
              ]}
              initialValues={section}
              textAcceptButton={optionId ? "Editar opción" : "Crear opción"}
              onSubmit={(e) => {
                if (e) return;
                setOptionId(null);
                setShowOption(false);
                getSections(item);
              }}
            />
          </FormWrapper>
        </MyModal>
      }
    </WrapperSection>
  );
};
export default ItemSection;
