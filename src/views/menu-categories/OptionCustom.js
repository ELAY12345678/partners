import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import qs from "qs";
import {
  Input,
  Icon,
  Tooltip,
  message,
  Row,
  Col,
  InputNumber,
  Divider,
  Select,
  Checkbox,
  DatePicker
} from "antd";
import GalleryUploader from "../../components/com/gallery/GalleryUploader";
import { getService } from "../../services";
import { WrapperForm, Headline } from "./style";
import AsyncButton from "../../components/asyncButton";
import { FileUploader } from "../../components/com/form/";

import RichTextField from "../../components/richTextField";
import EstablishmentBranchCost from "./EstablishmentBranchCost";
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const FormItems = ({
  item,
  reference,
  establishment_id,
  menuCategoryId,
  itemSelectorAfterCreate,
  categoriesList,
  establishmentCategoriesList,
  categoryField,
  establishmentBranch,
  ...props
}) => {

  const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);


  const [payload, setPayload] = useState();
  const [dataSource, setDataSource] = useState({ ...item });
  const [additionalInformation, setAdditionalInformation] = useState(item?.additional_information);
  const [dataSourceCost, setDataSourceCost] = useState([]);
  const [globalPrice, setGlobalPrice] = useState(0);

  const [htmlEditorVisible, setHtmlEditorVisible] = useState(false);


  const [query, setQuery] = useState(
    qs.parse(window.location.search.replace(/\?/, ""))
  );

  const [isVisibleCropper, setIsVisibleCropper] = useState();
  let location = window.location.search;

  const menuItemsService = getService("establishment-menu-items");
  const menuItemCostService = getService("establishment-menu-items-cost");


  const getDataItemsOverwrite = useCallback(async () => {
    const itemCategory = item && item[categoryField];
    setDataSource({ ...item, [categoryField]: itemCategory ? item[categoryField] : menuCategoryId === -1 ? undefined : menuCategoryId });
    setPayload({ [categoryField]: itemCategory ? item[categoryField] : menuCategoryId === -1 ? undefined : menuCategoryId })
    setGlobalPrice(0);
    setAdditionalInformation(item?.additional_information);
  }, [
    item
  ]);

  const dataFormatter = (value) => {
    let temp = value;
    for (let key in value) {
      if (value[key] === null) {
        delete temp[key];
      }
    }
    return temp;
  }

  const handleSubmit = async () => {
    try {
      if (!!dataSource.id) {
        const finalData = dataFormatter({ ...payload, additional_information: additionalInformation });

        await menuItemsService.patch(
          dataSource.id,
          {
            ...finalData,
          },
          {}
        ).then((response) => {
          props.onSubmit(null, response);
          setDataSource({
            ...response
          });
          setAdditionalInformation(response?.additional_information);
        });
        message.success("Item editado exitosamente");
      } else {

        if (!payload.apparta_booking_status)
          payload.apparta_booking_status = 'inactive'

        if (!payload.apparta_menu_status)
          payload.apparta_menu_status = 'inactive'

        await menuItemsService.create({
          ...payload,
          additional_information: additionalInformation,
          establishment_id: establishment_id
        }).then((response) => {
          props.onSubmit(null, response);
          setDataSource({
            ...response
          });
          setAdditionalInformation(response?.additional_information);
        });
        message.success("Item creado exitosamente");
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    setDataSource({ ...dataSource, [name]: value });
  }

  const handleUploadFinish = (field, url, file, _id) => {
    menuItemsService.patch(_id, {
      [field]: String(url),
    })
      .then((response) => {
        setDataSource({
          ...response
        });
        props.onSubmit(null, response);
      })
      .catch((err) => message.error(err.message));
  };

  const getDataCostItems = useCallback(
    async function (id) {
      try {
        if (item !== null) {
          const response = await menuItemCostService.find({
            query: {
              $limit: 1000,
              establishment_menu_item_id: id,
            },
          });
          setDataSourceCost(response.data);
        }
      } catch (e) {
        message.error(e.message);
      }
    },
    [item, menuItemCostService]
  );

  const handleGlobalPrice = async (
    price,
    dataFormCost,
    branchs,
    establishmentMenuItemId = "",
    establishmentId
  ) => {
    try {
      const newPrice = branchs
        .filter((it, index) => {
          return !_.find(dataFormCost, ({ establishment_branch_id }) => it.id === establishment_branch_id);
        })
        .map((it) => ({
          establishment_branch_id: it?.id,
          establishment_id: it?.establishment_id,
          establishment_menu_item_id: establishmentMenuItemId,
          price: price,
        }));

      let responsePatch = [];
      if (branchs.length > newPrice.length)
        responsePatch = await menuItemCostService.patch(
          null,
          {
            price: price,
          },
          {
            query: {
              establishment_id: establishmentId,
              establishment_menu_item_id: establishmentMenuItemId,
            },
          }
        );
      let responseCreate = [];
      if (newPrice.length > 0)
        responseCreate = await menuItemCostService
          .create(newPrice);
      setDataSourceCost([...responsePatch, ...responseCreate])
      message.success("Los registros se han modificado exitosamente");
    } catch (e) {
      message.error(e.message);
    }
  }



  useEffect(() => {
    getDataCostItems(item?.id).then();
  }, [getDataCostItems, item]);

  useEffect(() => {
    getDataItemsOverwrite().then();
  }, [item, getDataItemsOverwrite]);


  useEffect(() => {
    setQuery(qs.parse(window.location.search.replace(/\?/, "")));
  }, [location]);

  useEffect(() => {
    setHtmlEditorVisible(false);
    setTimeout(() => {
      setHtmlEditorVisible(true);
    }, 1000)
  }, [item]);

  return (
    <WrapperForm>
      <Row gutter={[24, 24]}>
        {
          (dataSource?.id && !isVisibleCropper && dataSource?.path_image_main) &&
          <Row justify="center" style={{ width: "100%" }}>
            <Col>
              <GalleryUploader
                refresh={(e, response) => {
                  setDataSource({ ...response });
                  props.onSubmit(null, response);
                }}
                size="large"
                record={dataSource}
                source="path_image_main"
                withCropper={true}
                setterVisibleCropper={setIsVisibleCropper}
                reference="establishment-menu-items"
                _id={dataSource.id}
                path={`brands/${+query?.brand_id}/menu-items`}
              />
            </Col>
          </Row>
        }
        {
          dataSource?.id &&
          <Col span={24}>
            <FileUploader
              preview={false}
              label="Subir Imagen"
              path={`establishment-menu-items/`}
              name='path_image_main'
              source='path_image_main'
              style={{ borderRadius: '0.5rem' }}
              onFinish={(url, file) =>
                handleUploadFinish("path_image_main", url, file, item.id)
              }
            />
          </Col>
        }
        {!!query?.restaurant_id && !item && (
          <Col span={24} align="center">
            <Headline
              style={{
                width: "100%",
                color: "#ffffff",
                backgroundColor: "#d60915",
                boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.03) !important",
                border: "1px solid #e8e8e85e !important",
                borderRadius: "20px",
                lineHeight: "27px",
                gap: 12,
                alignContent: "center",
                justifyContent: "center",
                fontSize: "0.84rem"
              }}
            >
              <Icon
                type="warning"
                style={{ color: "#FFCC00" }}
                theme="filled"
              />
              El producto se agregara a todos los restaurantes asociados a la
              marca
            </Headline>
          </Col>
        )}
        <Col span={24}>
          <Headline>Nombre *60 caracteres</Headline>
          <Tooltip
            title={
              !!query?.restaurant_id && item
                ? "Este campo solo puede ser editado en el template general"
                : null
            }
          >
            <Input
              style={{ width: "100%" }}
              disabled={!!query?.restaurant_id && item}
              name="name"
              value={dataSource?.name}
              onChange={handleChange}
              showCount
              maxLength={60}
            />
          </Tooltip>
        </Col>
        <Col span={24}>
          <Headline>Categoría Apparta</Headline>
          <Tooltip
            title={
              !!query?.restaurant_id && item
                ? "Este campo solo puede ser editado en el template general"
                : null
            }
          >
            <Select
              name={'category'}
              value={dataSource?.category || 'Sin categoría'}
              style={{ width: "100%" }}
              onChange={(value) => handleChange({ target: { name: 'category', value: value } })}
            >
              {
                _.map(categoriesList, (option, index) =>
                  <Select.Option key={index} value={option.id}>
                    {option.name}
                  </Select.Option>
                )
              }
            </Select>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Headline>Categoría propia</Headline>
          <Tooltip
            title={
              _.isEmpty(establishmentCategoriesList)
                ? "No existen categorías propias"
                : null
            }
          >
            <Select
              name={'establishment_menu_items_category_id'}
              value={dataSource?.establishment_menu_items_category_id && dataSource?.establishment_menu_items_category_id !== -1 ? dataSource?.establishment_menu_items_category_id : 'Sin categoría'}
              style={{ width: "100%" }}
              onChange={(value) => handleChange({ target: { name: 'establishment_menu_items_category_id', value: value } })}
              disabled={_.isEmpty(establishmentCategoriesList)}
            >
              {
                _.map(establishmentCategoriesList, (option, index) =>
                  <Select.Option key={index} value={option.id}>
                    {option.name}
                  </Select.Option>
                )
              }
            </Select>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Headline>Descripción *500 caracteres</Headline>
          <Tooltip
            title={
              !!query?.restaurant_id && item
                ? "Este campo solo puede ser editado en el template general"
                : null
            }
          >
            <TextArea
              disabled={!!query?.restaurant_id && item}
              style={{ width: "100%" }}
              name="description"
              value={dataSource?.description}
              onChange={handleChange}
              showCount
              maxLength={500}
            />
          </Tooltip>
        </Col>
        <Col span={24} style={{ minHeight: "299px" }}>
          <Headline>Información adicional</Headline>
          {
            htmlEditorVisible &&
            <RichTextField
              name='additional_information'
              defaultValue={additionalInformation}
              onChange={(value) => setAdditionalInformation(value)}
            />
          }
          {
            !htmlEditorVisible &&
            <RichTextField
              name='additional_information'
              onChange={(value) => setAdditionalInformation(value)}
            />
          }
        </Col>
        <Col span={24}>
          <Checkbox
            name='apparta_menu_status'
            checked={dataSource?.apparta_menu_status === 'active'}
            onChange={(value) => handleChange({ target: { name: 'apparta_menu_status', value: value.target.checked ? 'active' : 'inactive' } })}
          >
            Estado Apparta Menu
          </Checkbox>
        </Col>
        <Col span={24}>
          <Checkbox
            name='apparta_booking_status'
            checked={dataSource?.apparta_booking_status === 'active'}
            onChange={(value) => handleChange({ target: { name: 'apparta_booking_status', value: value.target.checked ? 'active' : 'inactive' } })}
          >
            Estado Apparta Booking
          </Checkbox>
        </Col>
        {
          userRole === 'admin' && (
            <>
              <Col span={24}>
                <Checkbox
                  name='is_rating_review_campaign'
                  checked={dataSource?.is_rating_review_campaign === 'true'}
                  onChange={(value) => handleChange({ target: { name: 'is_rating_review_campaign', value: value.target.checked ? 'true' : 'false' } })}
                >
                  Estado calificación campaña de producto
                </Checkbox>
              </Col>
              {
                dataSource?.is_rating_review_campaign === 'true' && (
                  <>
                    <Col span={24}>
                      <Headline>Nombre de la campaña *60 caracteres</Headline>
                      <Input
                        style={{ width: "100%" }}
                        disabled={!!query?.restaurant_id && item}
                        name="rating_review_campaign_name"
                        value={dataSource?.rating_review_campaign_name}
                        onChange={handleChange}
                        showCount
                        maxLength={60}
                      />
                    </Col>
                    <Row style={{ width: '100%' }} justify='space-evenly'>
                      <Col span={10}>
                        <Headline>Fecha Inicio</Headline>
                        <DatePicker
                          style={{ width: '100%' }}
                          locale={locale}
                          name='rating_review_campaign_start_date'
                          format='YYYY-MM-DD'
                          value={dataSource?.rating_review_campaign_start_date && moment(dataSource?.rating_review_campaign_start_date)}
                          onChange={(moment, value) => handleChange({ target: { name: 'rating_review_campaign_start_date', value: value } })}
                        />
                      </Col>
                      <Col span={10}>
                        <Headline>Fecha Fin</Headline>
                        <DatePicker
                          style={{ width: '100%' }}
                          locale={locale}
                          name='rating_review_campaign_end_date'
                          format='YYYY-MM-DD'
                          value={dataSource?.rating_review_campaign_end_date && moment(dataSource?.rating_review_campaign_end_date)}
                          onChange={(moment, value) => handleChange({ target: { name: 'rating_review_campaign_end_date', value: value } })}
                        />
                      </Col>
                    </Row>
                  </>
                )
              }
            </>
          )
        }
        <Col span={24} align="center">
          <AsyncButton
            type="primary"
            style={{ borderRadius: '0.5rem' }}
            onClick={handleSubmit}
          >
            {item ? "Guardar cambios" : "Agregar item"}
          </AsyncButton>
        </Col>
        {item && (
          <>
            <Col span={24}>
              <Divider
                orientation="center"
                style={{
                  fontSize: "1.2rem",
                  fontStyle: "italic",
                  color: "var(--purple)",
                }}
              >
                Precios en sucursales
              </Divider>
            </Col>
            <Col span={24}>
              <Row style={{ color: 'red' }}>
                Actualizar todos los precios
              </Row>
              <Row>
                <Col span={12}>
                  <InputNumber
                    min={1}
                    placeholder="Precio..."
                    name="Price"
                    style={{ width: "97%" }}
                    value={globalPrice}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(e) => {
                      setGlobalPrice(e);
                    }}
                  />
                </Col>
                <Col span={12}>
                  <AsyncButton
                    type="primary"
                    style={{ borderRadius: '0.5rem' }}
                    onClick={async () => {
                      await handleGlobalPrice(
                        globalPrice,
                        dataSourceCost,
                        establishmentBranch,
                        item?.id,
                        establishment_id
                      );
                    }}
                    children={<>Actualizar</>}
                  />
                </Col>
              </Row>
            </Col>
          </>
        )}
        {!!item?.id &&
          establishmentBranch &&
          establishmentBranch.map((it, index) => {
            const itemHasCost = dataSourceCost.find((element) => element.establishment_branch_id === it.id);
            const itemCost = dataSourceCost.find(
              (element) =>
                element.establishment_menu_item_id === item?.id &&
                element.establishment_branch_id === it.id
            );
            return (
              <EstablishmentBranchCost
                itemCost={itemCost}
                itemHasCost={itemHasCost}
                item={{ id: item?.id }}
                getDataCostItems={getDataCostItems}
                address={it?.address}
                establishment_id={establishment_id}
                key={index}
                establishment_branch_id={it?.id}
              />
            );
          })
        }
      </Row >
    </WrapperForm >
  );
};

export default FormItems;