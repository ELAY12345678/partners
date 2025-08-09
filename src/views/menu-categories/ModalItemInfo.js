import React, { useEffect, useState } from "react";
import {
  Modal,
  InputNumber,
  Divider,
  Row,
  Icon,
  Col,
  Table,
  Button,
  Tooltip,
  Switch,
} from "antd";
import qs from "qs";
import numeral from "numeral";

import {
  getRestaurants,
  statusFormatter,
  updateOverwriteValue,
  ModalCreateOverwrite,
  getDataOnlyItem,
} from "./index";
import { Headline, Labels } from "./style";

const MenuItemInfo = ({ isVisible, setterIsVisible, item, onSubmit }) => {
  let location = window.location.search;
  const [isLoading, setIsLoading] = useState(false);
  const [dataSourceRestaurants, setDataSourceRestaurants] = useState([]);
  const [
    dataSourceOverwriteForRestaurants,
    setDataSourceOverwriteForRestaurants,
  ] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [query, setQuery] = useState(
    qs.parse(window.location.search.replace(/\?/, ""))
  );
  const [isOpenEdit, setIsOpenEedit] = useState(false);
  const [configField, setConfigField] = useState({
    field: "",
    type: "",
    name: "",
    record: {},
  });
  useEffect(() => {
    setQuery(qs.parse(window.location.search.replace(/\?/, "")));
  }, [location]);
  function handleClickNewOverwrite(type, field, name, record) {
    setIsOpenEedit(true);
    setConfigField({ type: type, field: field, name: name, record: record });
  }
  const [newItem, setNewItem] = useState({});
  const [payloadPriceGlobal, setPayloadPriceGlobal] = useState({});

  useEffect(() => {
    if (item?.id !== null && item?.id !== undefined) {
      getDataOnlyItem(item?.id, setNewItem).then();
    }
  }, [item?.id]);

  useEffect(() => {
    getRestaurants(
      setDataSourceRestaurants,
      setIsLoading,
      query?.brand_id
    ).then();
  }, [query]);

  useEffect(() => {
    let hasOverwrite;
    if (Object.keys(newItem).length > 0) {
      hasOverwrite = !!newItem?.menu_items_restaurant_overwrite.length;
    }
    if (hasOverwrite) {
      setDataSourceOverwriteForRestaurants(
        newItem?.menu_items_restaurant_overwrite
      );
    }
  }, [newItem]);

  useEffect(() => {
    let indicators = dataSourceOverwriteForRestaurants
      .filter(
        (it, index) => it.restaurant_id === dataSourceRestaurants[index]?.id
      )
      .map((it) => ({
        ...it,
        overwrite: true,
        name: dataSourceRestaurants.filter(
          (it2) => it2?.id === it.restaurant_id
        )[0]?.name,
      }));
    let indicatosRestaurants = dataSourceRestaurants
      .filter((it, index) => it?.id !== indicators[index]?.restaurant_id)
      .map((it) => ({
        name: it?.name,
        id: it?.id,
        menu_item_id: newItem?.id,
        status: newItem?.status,
        price_tax_incl: newItem?.price_tax_incl,
        delivery: newItem?.delivery,
        pickup: newItem?.pickup,
        instore: newItem?.instore,
        strikethrough_price: newItem?.strikethrough_price,
        overwrite: false,
      }));
    setFinalData([...indicators, ...indicatosRestaurants]);
  }, [dataSourceOverwriteForRestaurants, newItem, dataSourceRestaurants]);

  const columns = [
    {
      title: "Restaurante",
      dataIndex: "name",
      align: "center",
      width: 150,
    },
    {
      title: "Precio con tasa incluida",
      dataIndex: "price_tax_incl",
      render: (record, object) => {
        let fieldValue;
        return (
          <>
            {object.overwrite && record !== null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <InputNumber
                  size="small"
                  value={record}
                  style={{ width: "70%" }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) => (fieldValue = value)}
                />
                <Button
                  type="primary"
                  icon="save"
                  size="small"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={async () => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        price_tax_incl: fieldValue,
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />

                <Button
                  type="primary"
                  icon="delete"
                  size="small"
                  style={{
                    backgroundColor: "red",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        price_tax_incl: null,
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />
              </div>
            )}
            {object.overwrite && record === null && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p>Tomando el valor general</p>
                  <Tooltip title="Definir un precio especifico" placement="top">
                    <Button
                      type="link"
                      icon="edit"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "price",
                          "tax",
                          "price_tax_incl",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}
            {!object.overwrite && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>
                  {`$ ${numeral(
                    record !== null ? record : item?.price_tax_incl
                  ).format("0,0")}`}
                </p>
                <Button
                  type="link"
                  icon="edit"
                  style={{ marginBottom: 12 }}
                  onClick={() =>
                    handleClickNewOverwrite(
                      "price",
                      "tax",
                      "price_tax_incl",
                      object
                    )
                  }
                />
              </div>
            )}
          </>
        );
      },
      align: "center",
      width: 200,
    },
    {
      title: "Precio tachado",
      dataIndex: "strikethrough_price",
      render: (record, object) => {
        let fieldValue;
        return (
          <>
            {object.overwrite && record !== null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <InputNumber
                  size="small"
                  value={record}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={(value) => (fieldValue = value)}
                />
                <Button
                  type="primary"
                  icon="save"
                  size="small"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={async () => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        strikethrough_price: fieldValue,
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />

                <Button
                  type="primary"
                  icon="delete"
                  size="small"
                  style={{
                    backgroundColor: "red",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        strikethrough_price: null,
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />
              </div>
            )}

            {object.overwrite && record === null && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p>Tomando el valor general</p>
                  <Tooltip title="Definir un precio tachado especifico">
                    <Button
                      type="link"
                      icon="edit"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "price",
                          "tax",
                          "strikethrough_price",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}

            {!object.overwrite && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>Tomando el valor general</p>
                <Button
                  type="link"
                  icon="edit"
                  style={{ marginBottom: 12 }}
                  onClick={() =>
                    handleClickNewOverwrite(
                      "price",
                      "strikethrough_price",
                      "strikethrough_price",
                      object
                    )
                  }
                />
              </div>
            )}
          </>
        );
      },
      width: 250,
    },
    {
      title: "Estado",
      dataIndex: "status",
      render: (record, object) => {
        return (
          <>
            {object.overwrite && record !== null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Switch
                  style={{
                    width: "7%",
                  }}
                  checked={object?.status === "active"}
                  onChange={async (event) => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        status: event === true ? "active" : "inactive",
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />
                <Button
                  type="primary"
                  icon="delete"
                  size="small"
                  style={{
                    backgroundColor: "red",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    await updateOverwriteValue(
                      "menu-items-restaurant-overwrite",
                      {
                        ...object,
                        status: null,
                      },
                      onSubmit,
                      getDataOnlyItem,
                      item?.id,
                      setNewItem
                    );
                  }}
                />
              </div>
            )}
            {object.overwrite && record === null && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p>Tomando el valor general</p>
                  <Tooltip title="Definir un estado especifico" placement="top">
                    <Button
                      type="link"
                      icon="edit"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "status",
                          "status",
                          "status",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}
            {!object.overwrite && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p style={{ marginBottom: 12 }}>{`${statusFormatter[record] ||
                  "sin valor"}`}</p>
                <Button
                  type="link"
                  icon="edit"
                  style={{ marginBottom: 12 }}
                  onClick={() => {
                    handleClickNewOverwrite(
                      "status",
                      "status",
                      "status",
                      object
                    );
                  }}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Disponible en",
      dataIndex: "status",
      render: (record, object) => {
        return (
          <>
            {object.overwrite && object.delivery !== null && (
              <>
                <Headline>Delivery</Headline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: -8,
                    gap: 4,
                  }}
                >
                  <Switch
                    style={{
                      width: "7%",
                    }}
                    checked={object?.delivery === "true"}
                    onChange={async (event) => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          delivery: event + "",
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                  <Button
                    type="primary"
                    icon="delete"
                    size="small"
                    style={{
                      backgroundColor: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={async () => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          delivery: null,
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                </div>
              </>
            )}
            {(!object.overwrite || object.delivery === null) && (
              <>
                <Headline>Delivery</Headline>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p style={{ marginBottom: 12, color: "black" }}>
                    Tomando el valor general
                  </p>
                  <Tooltip
                    title="Definir un tipo de envio especifico"
                    placement="top"
                  >
                    <Button
                      type="link"
                      icon="edit"
                      size="small"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "send",
                          "send",
                          "delivery",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}
            {object.overwrite && object.pickup !== null && (
              <>
                <Headline>Pickup</Headline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: -8,
                    gap: 4,
                  }}
                >
                  <Switch
                    style={{
                      width: "7%",
                    }}
                    checked={object?.pickup === "true"}
                    onChange={async (event) => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          pickup: event + "",
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                  <Button
                    type="primary"
                    icon="delete"
                    size="small"
                    style={{
                      backgroundColor: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={async () => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          pickup: null,
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                </div>
              </>
            )}
            {(!object.overwrite || object.pickup === null) && (
              <>
                <Headline>Pickup</Headline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: -8,
                    gap: 4,
                  }}
                >
                  <p style={{ marginBottom: 12, color: "black" }}>
                    Tomando el valor general
                  </p>
                  <Tooltip
                    title="Definir un tipo de envio especifico"
                    placement="top"
                  >
                    <Button
                      type="link"
                      icon="edit"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "send",
                          "send",
                          "pickup",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}
            {object.overwrite && object.instore !== null && (
              <>
                <Headline>Instore</Headline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: -8,
                    gap: 4,
                  }}
                >
                  <Switch
                    style={{
                      width: "7%",
                    }}
                    checked={object?.instore === "true"}
                    onChange={async (event) => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          instore: event + "",
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                  <Button
                    type="primary"
                    icon="delete"
                    size="small"
                    style={{
                      backgroundColor: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={async () => {
                      await updateOverwriteValue(
                        "menu-items-restaurant-overwrite",
                        {
                          ...object,
                          instore: null,
                        },
                        onSubmit,
                        getDataOnlyItem,
                        item?.id,
                        setNewItem
                      );
                    }}
                  />
                </div>
              </>
            )}
            {(!object.overwrite || object.instore === null) && (
              <>
                <Headline>Instore</Headline>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: -8,
                    gap: 4,
                  }}
                >
                  <p style={{ marginBottom: 12, color: "black" }}>
                    Tomando el valor general
                  </p>
                  <Tooltip
                    title="Definir un tipo de envio especifico"
                    placement="top"
                  >
                    <Button
                      type="link"
                      icon="edit"
                      style={{ marginBottom: 12 }}
                      onClick={() =>
                        handleClickNewOverwrite(
                          "send",
                          "send",
                          "instore",
                          object
                        )
                      }
                    />
                  </Tooltip>
                </div>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title={newItem?.name?.toString()?.toUpperCase()}
        width="95%"
        destroyOnClose={true}
        confirmLoading={isLoading}
        visible={isVisible}
        onCancel={() => {
          setterIsVisible(false);
        }}
      >
        <Divider orientation="left">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Labels>Valores generales</Labels>
            <Tooltip
              title="Estos valores afectan a todos los restaurantes pertenecientes a tu marca"
              placement="top"
            >
              <Icon
                type="question-circle"
                theme="filled"
                style={{
                  color: "#672bbf",
                  fontSize: "1.3rem",
                  marginTop: "0.5rem",
                }}
              />
            </Tooltip>
          </div>
        </Divider>
        <Row
          gutter={24}
          style={{
            marginBottom: 30,
          }}
        >
          <Col span={2} align="center">
            <Headline
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Estado
            </Headline>
            <Switch
              style={{
                width: "30%",
              }}
              checked={newItem?.status === "active"}
              onChange={async (event) => {
                await updateOverwriteValue(
                  "menu-items",
                  {
                    id: newItem?.id,
                    status: event,
                  },
                  onSubmit,
                  getDataOnlyItem,
                  item?.id,
                  setNewItem
                );
              }}
            />
          </Col>
          <Col span={6}>
            <Headline>Precio</Headline>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <InputNumber
                size="large"
                min={1000}
                value={newItem?.price_tax_incl}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(e) =>
                  setPayloadPriceGlobal({
                    ...payloadPriceGlobal,
                    price_tax_incl: e,
                  })
                }
              />
              <Button
                type="primary"
                icon="save"
                onClick={async () => {
                  await updateOverwriteValue(
                    "menu-items",
                    {
                      id: newItem?.id,
                      price_tax_incl: payloadPriceGlobal.price_tax_incl,
                    },
                    onSubmit,
                    getDataOnlyItem,
                    item?.id,
                    setNewItem
                  );
                  setPayloadPriceGlobal({});
                }}
              />
            </div>
          </Col>
          <Col span={6}>
            <Headline>Precio tachado</Headline>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <InputNumber
                size="large"
                min={1000}
                value={newItem?.strikethrough_price}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(e) =>
                  setPayloadPriceGlobal({
                    ...payloadPriceGlobal,
                    strikethrough_price: e,
                  })
                }
              />
              <Button
                type="primary"
                icon="save"
                onClick={async () => {
                  await updateOverwriteValue(
                    "menu-items",
                    {
                      id: newItem?.id,
                      strikethrough_price:
                        payloadPriceGlobal.strikethrough_price,
                    },
                    onSubmit,
                    getDataOnlyItem,
                    item?.id,
                    setNewItem
                  );
                  setPayloadPriceGlobal({});
                }}
              />
            </div>
          </Col>
          <Col span={6}>
            <Col span={4}>
              <Headline>Delivery</Headline>
              <Switch
                style={{
                  width: "20%",
                }}
                checked={newItem?.delivery === "true"}
                onChange={async (event) => {
                  await updateOverwriteValue(
                    "menu-items",
                    {
                      id: newItem?.id,
                      delivery: event,
                    },
                    onSubmit,
                    getDataOnlyItem,
                    item?.id,
                    setNewItem
                  );
                }}
              />
            </Col>
            <Col span={4}>
              <Headline>Pickup</Headline>
              <Switch
                style={{
                  width: "20%",
                }}
                checked={newItem?.pickup === "true"}
                onChange={async (event) => {
                  await updateOverwriteValue(
                    "menu-items",
                    {
                      id: newItem?.id,
                      pickup: event,
                    },
                    onSubmit,
                    getDataOnlyItem,
                    item?.id,
                    setNewItem
                  );
                }}
              />
            </Col>
            <Col span={4}>
              <Headline>Instore</Headline>
              <Switch
                style={{
                  width: "20%",
                }}
                checked={newItem?.instore === "true"}
                onChange={async (event) => {
                  await updateOverwriteValue(
                    "menu-items",
                    {
                      id: newItem?.id,
                      instore: event,
                    },
                    onSubmit,
                    getDataOnlyItem,
                    item?.id,
                    setNewItem
                  );
                }}
              />
            </Col>
          </Col>
        </Row>
        <Divider orientation="left">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Labels>Valores especificos por restaurante</Labels>
            <Tooltip
              title="Los cambios aqui realizados solo afectaran a aquellos restaurantes donde se realicen"
              placement="top"
            >
              <Icon
                type="question-circle"
                theme="filled"
                style={{
                  color: "#672bbf",
                  fontSize: "1.3rem",
                  marginTop: "0.5rem",
                }}
              />
            </Tooltip>
          </div>
        </Divider>

        <Table size="large" dataSource={finalData} columns={columns} />
      </Modal>
      <ModalCreateOverwrite
        isOpen={isOpenEdit}
        setterIsOpen={setIsOpenEedit}
        item={item}
        type={configField.type}
        field={configField.field}
        name={configField.name}
        record={configField.record}
        onSubmit={onSubmit}
        setNewItem={setNewItem}
      />
    </>
  );
};

export default MenuItemInfo;
