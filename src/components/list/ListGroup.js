import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { getService } from "../../services/services";
import { DEFAULT_IMAGE, URL_PLACEHOLDER, URL_S3 } from "../../constants/";
import { useSelector, useDispatch } from "react-redux";
import { WrapperGroupList } from "./Styles";
import { money } from "../../utils";
import ListItems from "./ListItems";
import { DinamicForm, SimpleForm } from "../com/form/";
import OptionCustom from "../../views/menu-categories/OptionCustom";
import { translate } from "react-polyglot";
import qs from "qs";
import ModalItemInfo from "../../views/menu-categories/ModalItemInfo";
import { set } from "lodash";

const GroupList = ({
  t,
  reference,
  source,
  group_reference,
  group_resource,
  group_refresh,
  group_section_footer,
  onSelectItemGroup,
  onAddItem,
  filterDefaultValues = {},
  refinement,
  filterDefaultGroupValues = {},
  initialValues = {},
  groupInitialValues = {},
  filter,
  filter_group,
  group_cover_field,
  cover_field,
  listTitle,
  group_actions,
  actions,
  groupTitle,
  refinement_group,
  setterIsVisibleModalAdmin,
  setterItem,
  selectedItem,
  departament_id,
  itemSelectorAfterCreate,
  defaultCategory,
  categoryType,
  establishment_id,
  establishmentBranch,
  ...props
}) => {

  const [establishmentCategories, setEstablishmentCategories] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const [showView, setShowView] = useState(false);
  const [refresh_items, setRefreshItems] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState();
  const [itemSelected, setItemSelected] = useState();
  const [defaultKeySelected, setDefaultKeySelected] = useState();
  const [isVisibleModalAdmin, setIsVisibleModalAdmin] = useState(false);
  const [query, setQuery] = useState();

  const handleOnSelect = ({ id, record }) => {
    if (record && selected) {
      if (record.id !== selected.id) {
        setSelected(record);
        setShowView(false);
        setShowGroup(true);
      }
    } else {
      setSelected(record);
      setShowView(false);
      setShowGroup(true);
    }
  };

  const handleOnItemSelect = ({ item, record }) => {
    setItemSelected(item);
    setShowView(true);
    if (onSelectItemGroup) onSelectItemGroup(item);
    /* setShowView(false);
        setItemSelected(null);
        let timeout = setTimeout(() => {
            setItemSelected(item);
            setShowView(true);
            if (onSelectItemGroup) onSelectItemGroup(item)
            clearTimeout(timeout);
        }, 100); */
  };

  const handleOnload = data => {
    if (data.length > 0) {
      /* let selected = data[0];
            if (refinement) selected = refinement(selected);
            if (selected) {
                setDefaultKeySelected(selected.id)
                setSelected(selected)
                setShowGroup(true);
            } */
    }
  };

  const handleOnAddItem = () => {
    if (itemSelected && showView) {
      setShowView(false);
    }
    let timeout = setTimeout(() => {
      setItemSelected(null);
      setShowView(true);
      if (onAddItem) onAddItem();
      clearTimeout(timeout);
    }, 100);
  };

  const handleSubmitItem = (err, data) => {
    setShowView(false);
    if (data) {
      setItemSelected(data);
      setRefreshItems(refresh => !refresh);
      let timeout = setTimeout(() => {
        setShowView(true);
        clearTimeout(timeout);
      }, 100);
    }
  };

  const handleOnDelete = record => {
    setShowView(false);
  };


  useEffect(() => {
    setShowGroup(false);
    setShowView(false);
    setItemSelected();
    setSelected();
  }, [establishment_id]);

  useEffect(() => {
    setRefreshItems(group_refresh);
  }, [group_refresh]);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh, defaultCategory]);

  useEffect(() => {
    setQuery(qs.parse(window.location.search.replace(/\?/, "")));
  }, [props.restaurant_id]);

  useEffect(() => {
    setShowGroup(false);
    setSelected(undefined);
    setItemSelected(undefined);
    setShowView(false);
    setRefresh(!refresh);
  }, [categoryType])



  return (
    <WrapperGroupList>
      <Row gutter={0} type="flex" justify="start" align="top">
        <Col sm={24} md={12} xl={6} >
          {
            categoryType ? (
              <ListItems
                actionCreateText="Agregar Categoría"
                createButtonText="Crear"
                editButtonText="Editar"
                createTitle="Crear Categoría"
                editTitle="Crear Categoría"
                departament_id={departament_id}
                title={listTitle}
                showAvatar={false}
                cover_field="path"
                refresh={refresh}
                refinement={refinement}
                filter={filter}
                cover={false}
                actions={{
                  disable: false,
                  create: false,
                  edit: false,
                  delete: false,
                  ...actions
                }}
                // fields={[
                //   ...props.fields,
                //   ...Object.keys(initialValues).map(key => ({
                //     name: [key],
                //     type: "hidden",
                //     initial: initialValues[key]
                //   }))
                // ]}
                form={props.form}
                source={source}
                reference={reference}
                filterDefaultValues={filterDefaultValues}
                onSelect={handleOnSelect}
                onLoad={handleOnload}
                resource={group_resource}
                defaultCategory={defaultCategory}
              />
            ) : (
              <ListItems
                actionCreateText="Agregar Categoría"
                createButtonText="Crear"
                editButtonText="Editar"
                createTitle="Crear"
                editTitle="Editar Categoría"
                departament_id={departament_id}
                title={listTitle}
                showAvatar={true}
                cover_field="banner_path"
                refresh={refresh}
                refinement={refinement}
                filter={filter}
                cover={false}
                actions={{
                  disable: true,
                  create: true,
                  edit: true,
                  delete: true,
                  ...actions
                }}
                // fields={[
                //   ...props.fields,
                //   ...Object.keys(initialValues).map(key => ({
                //     name: [key],
                //     type: "hidden",
                //     initial: initialValues[key]
                //   }))
                // ]}
                fields={props.fields}
                form={props.form}
                source={source}
                reference={reference}
                filterDefaultValues={filterDefaultValues}
                onSelect={handleOnSelect}
                onLoad={handleOnload}
                resource={group_resource}
                setEstablishmentCategories={setEstablishmentCategories}
                defaultElement={[{
                  "id": -1,
                  "establishment_id": 1,
                  "name": "Sin categoría",
                  "position": -1,
                  "banner_path": null,
                }]}
                establishment_id={establishment_id}
              />
            )
          }
        </Col>
        <Col sm={24} md={12} xl={6}>
          {showGroup && (
            <ListItems
              actionCreateText="Agregar Item"
              createButtonText="Crear Item"
              editButtonText="Editar Item"
              createTitle="Crear Item"
              editTitle="Crear Item"
              type="secundary"
              mode="list"
              onAdd={handleOnAddItem}
              onRemove={handleOnDelete}
              onSelect={({ item }) => {
                handleOnItemSelect({ item })
              }}
              selected={itemSelected}
              title={groupTitle}
              reference={group_reference}
              resource={group_resource}
              cover_field='path_image_main'
              source={source}
              refresh={refresh_items}
              /*  optionValue={source} */
              filter={filter_group}
              fields={[
                ...props.group_fields,
                ...Object.keys(groupInitialValues).map(key => ({
                  name: [key],
                  type: "hidden",
                  initial: groupInitialValues[key]
                })),
                {
                  xtype: "textfield",
                  type: "hidden",
                  name: source,
                  initial: selected.id
                }
              ]}
              refinement={refinement_group}
              actions={{
                disable: false,
                create: true,
                edit: false,
                delete: true,
                admin: true,
                ...group_actions
              }}
              setterIsVisibleModalAdmin={setIsVisibleModalAdmin}
              setterItem={setterItem}
              defaultKeySelected={defaultKeySelected}
              filterDefaultValues={{
                ...filterDefaultGroupValues,
                [source]: selected.id === -1 ? undefined : selected.id,
                'establishment_menu_items_category_id': selected.id === -1 ? 'null' : undefined,
                $sort: {
                  position: 1
                }
              }}
            />
          )}
        </Col>
        {showView && (
          <Col xl={showView ? 12 : 24}>
            <OptionCustom
              item={itemSelected}
              menuCategoryId={selected?.id}
              onSubmit={handleSubmitItem}
              itemSelectorAfterCreate={itemSelectorAfterCreate}
              reference={
                query?.restaurant_id !== ""
                  ? "menu-items-restaurant-overwrite"
                  : group_reference
              }
              categoryField={categoryType ? 'category' : 'establishment_menu_items_category_id'}
              establishment_id={establishment_id}
              categoriesList={defaultCategory}
              establishmentCategoriesList={establishmentCategories}
              establishmentBranch={establishmentBranch}
            />
          </Col>
        )}
      </Row>
      <ModalItemInfo
        isVisible={isVisibleModalAdmin}
        setterIsVisible={setIsVisibleModalAdmin}
        item={selectedItem}
        onSubmit={handleSubmitItem}
      />
    </WrapperGroupList>
  );
};
export default GroupList;
