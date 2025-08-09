import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemSection from "../../components/list/ItemSection";
import ListGroup from "../../components/list/ListGroup";
import { PanelLayout } from "../../layouts/";
import * as actionTypes from "../../constants/actionTypes";
import {
  Layout,
  Col,
  Row,
  Typography,
  Divider,
  message,
  Radio,
  Button,
  Select,
  Input,
  InputNumber,
} from "antd";
import DepartamentsList from "./DepartmentsList";
import ModalAppartaMenu from "./ModalAppartaMenu";

import { Box, WrapperWarning } from "./style";

import qs from "qs";

import { IoRestaurantOutline, IoGridOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsBrush } from "react-icons/bs";
import { MyModal } from "../../components/com";
import { ColorField } from "../../components/com/fields";
import {
  SimpleForm,
  FileUploader,
  SelectField,
} from "../../components/com/form/";
import { getService } from "../../services";
import _ from "lodash";
import GalleryUploader from "../../components/com/gallery/GalleryUploader";

const USERS_ROLES = {
  admin: "admin",
  user: "user",
};

export const APPARTA_CATEGORIES = [
  {
    name: "Entradas",
    id: "entradas",
  },
  {
    name: "Desayunos",
    id: "desayunos",
  },
  {
    name: "Sopas",
    id: "sopas",
  },
  {
    name: "Ensaladas",
    id: "ensaladas",
  },
  {
    name: "Platos fuertes",
    id: "platos fuertes",
  },
  {
    name: "Acompañamientos",
    id: "acompañamientos",
  },
  {
    name: "Bebidas",
    id: "bebidas",
  },
  {
    name: "Postres",
    id: "postres",
  },
  {
    name: "Licores",
    id: "licores",
  },
  {
    name: "Otros",
    id: "otros",
  },
];

const MenuCategories = (props) => {
  const establishment_id = useSelector(
    ({ dashboardReducer }) =>
      dashboardReducer.establishmentFilters.establishment_id
  );
  const permissionsv2 = useSelector(
    ({ appReducer }) => appReducer?.user?.permissionsv2 || []
  );
  const userRole = useSelector(({ appReducer }) => appReducer?.user?.role);

  const branchsIdPermissions = (permissionsv2) => {
    const permissionsEstablishments = permissionsv2.filter(
      (it) => it.type === "establishments"
    );

    const establishmentPermission = _.find(
      permissionsEstablishments,
      (item) => item?.establishment_id === establishment_id
    );

    if (
      establishmentPermission?.role === "superAdmin" ||
      (establishmentPermission?.role === "employee" &&
        establishmentPermission?.permission === "global")
    ) {
      return {};
    }

    const permissionsEstablishmentsBranchs = _.map(
      establishmentPermission?.establishments_branchs,
      (branch) => branch?.id
    );

    return {  
      id: { $in: permissionsEstablishmentsBranchs },
    }
  };

  const establishmentBranchService = getService("establishments-branchs");
  const establishmentService = getService("establishments");

  const [filter, setFilter] = useState();
  const [group_refresh, setGroupRefresh] = useState(false);
  const [itemSelected, setItemSelected] = useState();
  const [restaurant_id, setRestaurantId] = useState();
  const [brand_id, setBrandId] = useState();
  const [item, setItem] = useState(null);
  const [departament_id, setDepartamentId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAppartaMenuVisible, setModalAppartaMenuVisible] = useState(false);
  const [categoryType, setCategoryType] = useState(false);

  const [establishmentBranch, setEstablishmentBranch] = useState();
  const [establishmentData, setEstablishMentData] = useState({});

  const [branchId, setBranchId] = useState();

  const group_fields = [];

  const dispatch = useDispatch();

  const handleChangeCategoryType = (e) => {
    setCategoryType(e.target.value === "apparta" ? true : false);
  };

  const handleItemSelect = (item) => {
    setItemSelected(item);
  };

  const getEstablishment = useCallback(
    async function() {
      try {
        const response = await establishmentService.get(establishment_id);
        setEstablishMentData(response);
      } catch (e) {
        message.error(e.message);
      }
    },
    [establishmentService, establishment_id]
  );

  const getEstablishmenBranch = useCallback(
    async function() {
      try {
        const response = await establishmentBranchService.find({
          query: {
            ...branchsIdPermissions(permissionsv2),
            establishment_id: establishment_id,
            $limit: 1000,
          },
        });
        setEstablishmentBranch(response.data);
      } catch (e) {
        message.error(e.message);
      }
    },
    [establishmentBranchService, establishment_id]
  );

  const onUpdateEstablishColor = (data) => {
    establishmentService
      .patch(establishment_id, { ...data })
      .then((response) => {
        setEstablishMentData(response);
        message.success("Diseño actualizado!");
      })
      .catch((e) => message.error(e.message));
  };

  const handleUploadFinish = (field, url, file, _id) => {
    establishmentService
      .patch(_id, {
        [field]: String(url),
      })
      .then((response) => {
        setEstablishMentData({
          ...response,
        });
      })
      .catch((err) => message.error(err.message));
  };

  useEffect(() => {
    if (establishment_id) {
      getEstablishmenBranch().then();
      getEstablishment().then();
    }
  }, [getEstablishmenBranch, getEstablishment, establishment_id]);

  useEffect(() => {
    if (filter) {
      let { restaurant_id, brand_id } = filter;
      setRestaurantId(restaurant_id ? Number(restaurant_id) : undefined);
      setBrandId(brand_id ? Number(brand_id) : undefined);
    }
  }, [filter]);

  useEffect(() => {
    dispatch({
      type: actionTypes.CHANGE_FILTERS,
      defaultFilters: {
        restaurant_id: true,
        brand_id: true,
      },
    });
  }, []);

  useEffect(() => {
    if (props.location) {
      let query = qs.parse(props.location.search.replace(/\?/, ""));
      if (query) {
        for (let key in query) {
          if (
            typeof query[key] == "undefined" ||
            query[key] === "" ||
            query[key] === null
          ) {
            delete query[key];
          }
        }
        setFilter(query);
      }
    }
  }, [props.location]);

  return (
    <Layout.Content
      style={{ height: "100%", overflow: "auto", padding: "2rem" }}
    >
      <Row
        align="middle"
        style={{
          color: "var(--purple)",
        }}
        gutter={[16, 16]}
        justify="space-between"
      >
        <Col>
          <Row gutter={16}>
            <Col>
              <IoRestaurantOutline size={30} />
            </Col>
            <Col>
              <Typography.Title level={3} style={{ margin: 0 }}>
                Menú/Carta
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={16}>
            <Col>
              <Button
                type="primary"
                icon={
                  <>
                    <BsBrush size={20} />
                  </>
                }
                style={{
                  borderRadius: "0.5rem",
                }}
                disabled={!establishment_id}
                onClick={() => setModalVisible(true)}
              >
                Editar mi diseño
              </Button>
            </Col>
            <Col>
              <Button
                icon={
                  <>
                    <IoGridOutline size={20} />
                  </>
                }
                style={{
                  borderRadius: "0.5rem",
                  border: 0,
                }}
                disabled={!establishment_id}
                onClick={() => setModalAppartaMenuVisible(true)}
              >
                AppartaMenu
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider
        style={{ background: "transparent", borderTop: 0, marginTop: 0 }}
      />
      {!establishment_id && (
        <Box>*Selecciona un restaurante para ver el menú*</Box>
      )}
      {establishment_id && (
        <>
          <Row gutter={16}>
            <Col>
              <Radio.Group
                defaultValue={"mine"}
                onChange={handleChangeCategoryType}
              >
                <Radio value={"mine"}>Categorías propias</Radio>
                <Radio value={"apparta"}>Categorías Apparta</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <ListGroup
            listTitle={
              categoryType ? "Categorías Apparta" : "Categorías propias"
            }
            groupTitle="Items"
            reference="establishments-menu-items-categories"
            group_reference="establishment-menu-items"
            source={
              categoryType
                ? "category[id]"
                : "establishment_menu_items_category_id[id]"
            }
            filteres={filter}
            // group_cover_field="path_main"
            establishment_id={establishment_id}
            departament_id={departament_id}
            restaurant_id={establishment_id}
            group_refresh={group_refresh}
            fields={
              <InputNumber
                type="hidden"
                name="establishment_id"
                initial={establishment_id}
              />
            }
            onSelectItemGroup={handleItemSelect}
            onAddItem={() => {
              setItemSelected(null);
            }}
            group_fields={[
              {
                xtype: "filefield",
                name: "path_main",
                source: "path_main",
                disabled: true,
                path: `restaurants/${establishment_id}/menu-items`,
                multiple: false,
                onUpload: () => {
                  setGroupRefresh((refresh) => !refresh);
                },
                dragAndDrop: true,
                showByEdit: true,
                reference: "menu-items",
                id: "menu-items-path",
              },
              ...group_fields,
            ]}
            group_section_footer={
              <div className={"sectionsContainer"}>
                {itemSelected && (
                  <ItemSection
                    title="Adicionales:"
                    establishment_id={establishment_id}
                    reference="personalization-menu-item-sections"
                    item={itemSelected}
                  />
                )}
              </div>
            }
            setterItem={setItem}
            groupInitialValues={{
              establishment_id,
            }}
            selectedItem={item}
            itemSelectorAfterCreate={setItemSelected}
            filterDefaultGroupValues={{
              $sort: {
                position: 1,
              },
              establishment_id,
              $limit: 5000,
            }}
            filterDefaultValues={{
              $sort: {
                position: 1,
              },
              establishment_id,
              $limit: 5000,
            }}
            defaultCategory={APPARTA_CATEGORIES}
            categoryType={categoryType}
            establishmentBranch={establishmentBranch}
          />
        </>
      )}
      <MyModal
        title={"Editar mi diseño de AppartaMenu"}
        onCancel={() => {
          setModalVisible(false);
          setBranchId();
        }}
        visible={modalVisible}
      >
        <SimpleForm
          {...props}
          textAcceptButton={"Actualizar"}
          forwardedRef={props.forwardedRef}
          autoSubmit={false}
          onSubmit={(err, data) => {
            if (err) return message.error(err);
            console.log(data);
            onUpdateEstablishColor({ ...data });
          }}
        >
          <ColorField
            flex={1}
            shape="picker"
            name="apparta_menu_main_color"
            initial={establishmentData?.apparta_menu_main_color}
            label="Color Principal"
            placeholder="Color Principal"
          />
          <Select
            flex={0.5}
            name="apparta_menu_categories_source"
            label="apparta_menu_categories_source"
            initial={establishmentData?.apparta_menu_categories_source}
          >
            <Select.Option value="appartaCategories">
              appartaCategories
            </Select.Option>
            <Select.Option value="establishmentCategories">
              establishmentCategories
            </Select.Option>
          </Select>
          <Select
            flex={0.5}
            name="apparta_menu_booking_categories_source"
            label="apparta_menu_booking_categories_source"
            initial={establishmentData?.apparta_menu_booking_categories_source}
          >
            <Select.Option value="appartaCategories">
              appartaCategories
            </Select.Option>
            <Select.Option value="establishmentCategories">
              establishmentCategories
            </Select.Option>
          </Select>
          {establishmentData?.id &&
            establishmentData?.apparta_menu_branch_list_background_path && (
              <GalleryUploader
                flex={1}
                refresh={(e, response) => setEstablishMentData(response)}
                size="large"
                record={establishmentData}
                defaultImage={
                  establishmentData.apparta_menu_branch_list_background_path
                }
                source="apparta_menu_branch_list_background_path"
                name="apparta_menu_branch_list_background_path"
                withCropper={true}
                setterVisibleCropper={() => {}}
                reference="establishments"
                _id={establishmentData.id}
                path={`apparta_menu_branch_list_background_path/${establishmentData.name}/`}
              />
            )}
          {establishmentData?.id && (
            <FileUploader
              preview={false}
              path={`apparta_menu_branch_list_background_path/${establishmentData.name}/`}
              name="apparta_menu_branch_list_background_path"
              source="apparta_menu_branch_list_background_path"
              style={{ borderRadius: "0.5rem" }}
              onFinish={(url, file) =>
                handleUploadFinish(
                  "apparta_menu_branch_list_background_path",
                  url,
                  file,
                  establishmentData.id
                )
              }
            />
          )}
        </SimpleForm>
      </MyModal>
      {modalAppartaMenuVisible && (
        <ModalAppartaMenu
          visible={modalAppartaMenuVisible}
          setVisible={setModalAppartaMenuVisible}
          establishmentBranch={establishmentBranch}
          slug={establishmentData.slug}
          getEstablishmenBranch={getEstablishmenBranch}
          isAdmin={userRole === USERS_ROLES.admin}
        />
      )}
    </Layout.Content>
  );
};
export default MenuCategories;
