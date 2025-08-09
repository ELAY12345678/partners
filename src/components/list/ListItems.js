import React, { useEffect, useState, useRef } from "react";
import {
  List,
  Switch,
  Menu,
  Avatar,
  Icon,
  message,
  Button,
  Dropdown,
  ConfigProvider,
  Tag,
  Typography,
  Input
} from "antd";
import { getService } from "../../services/services";
import qs from "qs";
import {
  DEFAULT_IMAGE,
  S3_PATH_IMAGE_HANDLER,
  URL_PLACEHOLDER,
  URL_S3,
} from "../../constants/";
import { WrapperItem, WrapperItemList } from "./Styles";
import { money } from "../../utils";
import _ from "lodash";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { DinamicForm, FileUploader, SelectField, SimpleForm } from "../com/form/";
import { MyModal } from "../com";

// Icons
import { AiOutlineReload, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSmile, AiOutlineDrag, AiOutlineRight } from 'react-icons/ai';
import { FiMoreVertical } from 'react-icons/fi';
import GalleryUploader from "../com/gallery/GalleryUploader";


const DragHandle = SortableHandle(({ children }) => (
  <span className="drag-handle">{children}</span>
));

const defaultActions = {
  create: true,
  edit: true,
  delete: false,
  disable: false,
};

const APPARTA_CATEGORIES = [
  {
    name: "Entradas",
    id: "entradas",
    path: "https://mejorconsalud.as.com/wp-content/uploads/2016/02/Elegir-aperitivos-bajos-en-calor%C3%ADas.jpg",
  },
  {
    name: "Desayunos",
    id: "desayunos",
    path: "https://www.cocinayvino.com/wp-content/uploads/2016/09/full-english-breakfast.jpg",
  },
  {
    name: "Sopas",
    id: "sopas",
    path: "https://elgourmet.s3.amazonaws.com/recetas/cover/sopa-_k1VoM4cvUxpZ0SWRX2a5trJ86mwhjl.png",
  },
  {
    name: "Ensaladas",
    id: "ensaladas",
    path: "https://static3.depositphotos.com/1003814/174/i/450/depositphotos_1747679-stock-photo-vegetable-salad-with-cheese.jpg",
  },
  {
    name: "Platos fuertes",
    id: "platos fuertes",
    path: "https://i.blogs.es/5c4adf/1366_2000-24/1366_2000.jpg",
  },
  {
    name: "Acompañamientos",
    id: "acompañamientos",
    path: "https://www.rebanando.com/cache/content/232354.jpg/600x397.jpg",
  },
  {
    name: "Bebidas",
    id: "bebidas",
    path: "https://i2.wp.com/www.diegocoquillat.com/wp-content/uploads/2018/06/tapa_bebidas.png?w=700&ssl=1",
  },
  {
    name: "Postres",
    id: "postres",
    path: "https://img.vixdata.io/pd/webp-large/es/sites/default/files/imj/elgranchef/l/los-mejores-postres-sin-chocolate-1.jpg",
  },
  {
    name: "Licores",
    id: "licores",
    path: "https://www.losvinos.com.ar/wp-content/uploads/2019/08/licores-de-dulces-930x620.jpg?ezimgfmt=ng%3Awebp%2Fngcb13%2Frs%3Adevice%2Frscb13-1",
  },
  {
    name: "Otros",
    id: "otros",
    path: "https://www.cocinacaserayfacil.net/wp-content/uploads/2020/03/Recetas-de-comida-para-llevar-al-trabajo.jpg",
  },
];

const layouts = [
  {
    id: "Grid2by2WithImage",
    name: "Producto con imágenes"
  },
  {
    id: "FullWidthNoImage",
    name: "Producto sin imágenes"
  }
];


const ListItems = ({
  title,
  header,
  footer,
  description,
  bordered = true,
  fullHeight = true,
  createTitle,
  editTitle,
  fields,
  source,
  createButtonText,
  editButtonText,
  actionCreateText = "Agregar",
  reference,
  onLoad,
  onAdd,
  onRemove,
  onEdit,
  defaultKeySelected = 0,
  valueField = "position",
  showAvatar = true,
  type = "primary",
  mode = "modal",
  actions = defaultActions,
  icon,
  cover_field = "banner_path",
  filter,
  onSelect,
  refinement,
  refresh,
  filteres,
  onDisable,
  goTop = true,
  initialValues = {},
  setterIsVisibleModalAdmin,
  setterItem,
  departament_id,
  defaultCategory,
  setEstablishmentCategories,
  defaultElement = [],
  establishment_id,
  ...props
}) => {

  const [dragId, setDragId] = useState();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedData, setSelectedData] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [filterDefaultValues, setFilterDefaultValues] = useState({});


  let query = qs.parse(window.location.search.replace(/\?/, ""));
  const myRef = useRef(null);

  const handleClick = (id, record, item) => {
    if (selectedId !== id) {
      setSelectedId(id);
      if (onSelect) onSelect({ id, item, record });
    }
    if (goTop) window.document.body.scrollTo(0, 0);
  };

  const handleOnDisabled = (value, item) => {

    if (onDisable) return onDisable(value, item);

    const service = getService(reference);
    service
      .patch(item.id, {
        status: value === true ? "active" : "inactive",
      })
      .then((res) => { })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const update = (id, params) => {
    if (reference && !defaultCategory && id !== -1) {
      const service = getService(reference);
      return service
        .patch(id, {
          ...params,
        })
        .then((res) => { })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const onStart = ({ node, index, collection, isKeySorting }, e) => {
    setDragId(node.id);
  };

  const onSortEnd = async ({ oldIndex, newIndex, collection }, e) => {
    try {
      if (oldIndex === newIndex) {
        let item = dataSource.find((item, index) => index === newIndex);
        if (item) setSelectedId(item.id);
        return;
      }
      let new_array = arrayMove(dataSource, oldIndex, newIndex);
      setDataSource(new_array);
      let count = 0;
      setSubmitting(true);
      new_array.forEach(async (item, index) => {
        await update(item.id, {
          [valueField]: index,
        });
        count++;
        if (count === new_array.length) {
          setSubmitting(false);
          /* message.success("Updated!"); */
        }
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  const renderItem = (item, index) => {
    let record = item;
    const temp =
      item?.menu_items_restaurant_overwrite?.length > 0
        ? !!item.menu_items_restaurant_overwrite.find(
          (it) => Number(it.restaurant_id) === Number(query.restaurant_id)
        )
        : false;
    const tempItem = temp
      ? item.menu_items_restaurant_overwrite.find(
        (it) => Number(it.restaurant_id) === Number(query.restaurant_id)
      )
      : {};

    if (refinement) record = refinement(record);
    let extra_actions = [];
    actions.extra = actions.extra || [];
    if (actions.extra.length > 0)
      actions.extra = React.Children.map(actions.extra, (child, index) => {
        let { onClick } = child.props;
        return React.cloneElement(child, {
          onClick: (e) => {
            e.preventDefault();
            if (onClick) onClick(item);
          },
          key: index,
        });
      });
    if (actions.admin && +window.localStorage.getItem("branch_length") >= 2) {
      extra_actions.push(
        <Button
          type="link"
          style={{ marginRight: 6 }}
          onClick={() => {
            setterIsVisibleModalAdmin(true);
            setterItem(record);
          }}
        >
          Administrar
        </Button>
      );
    }
    if (actions.disable && item.id !== -1 && +window.localStorage.getItem("branch_length") <= 1) {
      extra_actions.push(
        <Switch
          defaultChecked={
            query?.restaurant_id !== ""
              ? temp
                ? tempItem.status === "active"
                : item.status === "active"
              : item.status === "active"
          }
          onChange={(value) => handleOnDisabled(value, item)}
        />
      );
    }
    extra_actions = [
      ...extra_actions,
      ...actions.extra,
      (actions.edit || actions.delete) && item.id !== -1 && (
        <Dropdown
          trigger={["click"]}
          overlay={() => <MenuItems record={item} />}
        >
          <Button type="link">
            <FiMoreVertical />
          </Button>
        </Dropdown>
      ),
    ];
    return (
      <SortableItem
        key={`item-${record.id}`}
        index={index}
        record={record}
        item={item}
        extra_actions={extra_actions}
      />
    );
  };

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <AiOutlineSmile style={{ fontSize: 20 }} />
      <p>Data Not Found</p>
    </div>
  );

  const getData = () => {
    if (reference && !defaultCategory) {
      const service = getService(reference);
      setLoading(true);
      service
        .find({
          query: {
            $sort: {
              [valueField]: 1,
            },
            ...filterDefaultValues,
          },
        })
        .then(({ data }) => {
          data = data.map((it, index) => ({
            ...it,
          }));
          setDataSource(filter ? [...defaultElement, ...data.filter(filter)] : [...defaultElement, ...data]);
          if (setEstablishmentCategories)
            setEstablishmentCategories(filter ? data.filter(filter) : data);
          if (onLoad) onLoad(data);
          setLoading(false);
        })
        .catch((err) => {
          message.error(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (departament_id !== undefined) {
      // alert('consultar')
      if (reference) {
        const service = getService('categories');
        setLoading(true);
        service
          .find({
            query: {
              $sort: {
                [valueField]: 1,
              },
              ...filterDefaultValues,
              menu_items_department_id:
                departament_id > 0 ? departament_id : undefined,
            },
          })
          .then(({ data }) => {
            data = data.map((it, index) => ({
              ...it,
              [valueField]: index,
            }));
            setDataSource(filter ? data.filter(filter) : data);
            if (onLoad) onLoad(data);
            setLoading(false);
          })
          .catch((err) => {
            message.error(err.message);
            setLoading(false);
          });
      }
    }
  }, [departament_id]);

  const remove = (id) => {
    if (reference) {
      const service = getService(reference);
      service
        .remove(id)
        .then((res) => {
          message.success("Registro eliminado!");
          if (onRemove) onRemove(res);
          getData();
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      if (onRemove) onRemove(id);
    }
  };

  const handleMenuClick = (key, record) => {
    switch (key) {
      case "delete":
        remove(record.id);
        break;
      case "edit":
        if (onEdit) return onEdit(record);
        setSelectedId(record.id);
        setSelectedData(record);
        setVisible(true);
        break;
      default:
        break;
    }
  };

  const handleAdd = () => {
    setSelectedId(null);
    setSelectedData();
    if (mode === "modal") setVisible(true);
    if (onAdd) onAdd(source, reference, mode);
  };

  const MenuItems = (props) => (
    <Menu
      className={props.className || "list-menu"}
      onClick={({ key }) => handleMenuClick(key, props.record)}
      items={[
        actions.edit && { key: "edit", label: 'Editar', icon: <AiOutlineEdit /> },
        actions.delete && { key: "delete", label: 'Eliminar', icon: <AiOutlineDelete /> }
      ]}
    />
  );

  const SortableItem = SortableElement(({ record, item, extra_actions }) => {
    const temp =
      item?.menu_items_restaurant_overwrite?.length > 0
        ? !!item.menu_items_restaurant_overwrite.find(
          (it) => Number(it.restaurant_id) === Number(query.restaurant_id)
        )
        : false;
    const tempItem = temp
      ? item.menu_items_restaurant_overwrite.find(
        (it) => Number(it.restaurant_id) === Number(query.restaurant_id)
      )
      : {};

    let cover;

    let isSelected = selectedId
      ? item.id === selectedId
      : item.id === defaultKeySelected;

    if (cover_field === 'path')
      cover = record[cover_field]
    else if (record[cover_field])
      cover = `${record[cover_field]}`
    else
      cover = DEFAULT_IMAGE

    cover = `${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
      url: cover,
      width: 100,
      height: 100,
    })}`;

    return (
      <WrapperItem
        className={`item item-${type}  ${isSelected ? "item-selected" : ""}`}
        key={item.id}
      >
        <div className="item-container"
        >
          <div
            onClick={() => handleClick(item.id, record, item)}
            className="avatar"
          >
            {type === "primary" && (
              <AiOutlineRight className="icon-right" />
            )}
            <DragHandle className="container-draghandle">
              <AiOutlineDrag className="icon-drag" />
            </DragHandle>
            {showAvatar && record.id !== -1 && <Avatar size="large" shape="square" src={cover} />}
          </div>
          <div className="content">
            <div
              onClick={() => handleClick(item.id, record, item)}
              className="title"
            >
              <h4> {record.name}</h4>
              {(record.instore === "true" ||
                record.delivery === "true" ||
                record.pickup === "true" ||
                tempItem.instore === "true" ||
                tempItem.delivery === "true" ||
                tempItem.pickup === "true") && (
                  <div>
                    {(record.instore === "true" ||
                      tempItem.instore === "true") && (
                        <Tag color="green" className="type">
                          {query?.restaurant_id !== "" &&
                            tempItem?.instore === "true"
                            ? "INSTORE"
                            : null || record.instore === "true"
                              ? "INSTORE"
                              : null}
                        </Tag>
                      )}

                    {(record.delivery === "true" ||
                      (tempItem.delivery === "true" &&
                        query?.restaurant_id !== "")) && (
                        <Tag color="cyan" className="type">
                          {query?.restaurant_id !== "" &&
                            tempItem?.delivery === "true"
                            ? "DELIVERY"
                            : null || record.delivery === "true"
                              ? "DELIVERY"
                              : null}
                        </Tag>
                      )}
                    {(record.pickup === "true" || tempItem.pickup === "true") && (
                      <Tag color="blue" className="type">
                        {query?.restaurant_id !== "" &&
                          tempItem?.pickup === "true"
                          ? "PICKUP"
                          : null || record.pickup === "true"
                            ? "PICKUP"
                            : null}
                      </Tag>
                    )}
                  </div>
                )}
            </div>
            <div className="actions">{extra_actions}</div>
          </div>
        </div>
      </WrapperItem>
    );
  });

  const SortableList = SortableContainer(({ items }) => {
    return (
      <WrapperItemList
        ref={myRef}
        className="list-container"
        fullHeight={fullHeight}
        bordered={bordered}
      >
        <div className="head-list">
          {title && !header && (
            <div className="list-title">
              {title && <Typography.Title level={5}>{title}</Typography.Title>}
              {reference && (
                <Button
                  onClick={() => getData()}
                  type="link"
                  loading={submitting || loading}
                  icon={<AiOutlineReload />}
                />
              )}
            </div>
          )}
          {header && <Typography.Title level={5}>{header}</Typography.Title>}
          {description && (
            <div className="list-description">
              <span>{description}</span>
            </div>
          )}
        </div>
        <div className="list-footer">
          {!loading && (
            <div>
              {actions.create && (
                <div className="add-container">
                  <Button onClick={handleAdd} type="link" icon={<AiOutlinePlus />}>
                    {actionCreateText}
                  </Button>
                </div>
              )}
              {footer}
            </div>
          )}
        </div>
        <div className="lit-items-content">
          {items.map(props.renderItem || renderItem)}
        </div>
        {mode === "modal" && (
          <MyModal
            title={`${selectedId ? editTitle || "Editar" : createTitle || "Crear"
              }`}
            onCancel={() => {
              setVisible(false);
              setSelectedId(null);
              setSelectedData();
            }}
            visible={visible}
          >
            <SimpleForm
              id={selectedId}
              source={reference}
              record={initialValues}
              textAcceptButton={selectedId ? editButtonText : createButtonText}
              onSubmit={(err, record) => {
                getData();
                setSelectedId(null);
                setSelectedData();
                setVisible(false);
                /* if (onSelect && !selectedId) onSelect(record.id, record, record); */
              }}
            >
              {fields}
              <Input
                size="large"
                label="Nombre de Categoría"
                placeholder="Nombre de Categoría"
                flex={1}
                name="name"
              />
              <SelectField
                size="large"
                label="Formato de Visualización"
                placeholder="Formato de Visualización"
                flex={1}
                name="layout"
                choices={layouts}
              />
              {
                selectedId && (selectedData?.banner_path) && (
                  <GalleryUploader
                    flex={1}
                    refresh={(e, response) => setSelectedData(response)}
                    size="large"
                    record={selectedData}
                    // defaultImage={establishmentData.apparta_menu_branch_list_background_path}
                    source="banner_path"
                    name="banner_path"
                    withCropper={true}
                    setterVisibleCropper={() => { }}
                    reference="establishments-menu-items-categories"
                    _id={selectedId}
                    path={`establishments-menu-items-categories/${establishment_id}/`}
                  />
                )
              }
              {
                selectedId &&
                <FileUploader
                  preview={false}
                  source="banner_path"
                  name="banner_path"
                  path={`establishments-menu-items-categories/${establishment_id}/`}
                  multiple={false}
                  onUpload={() => {
                    // setGroupRefresh(refresh => !refresh);
                  }}
                  showByEdit={true}
                  reference={"establishments-menu-items-categories"}
                  id="banner-category-path"
                />
              }
            </SimpleForm>
          </MyModal>
        )}
      </WrapperItemList>
    );
  });

  useEffect(() => {
    if (props.dataSource && props.dataSource.length > 0) {
      setSelectedId(props.dataSource[0].id);
      setDataSource(
        filter ? props.dataSource.filter(filter) : props.dataSource
      );
    }
  }, [props.dataSource]);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  useEffect(() => {
    if (!_.isEmpty(filterDefaultValues)) getData();
  }, [refresh]);

  useEffect(() => {
    if (_.isEmpty(filterDefaultValues)) {
      setFilterDefaultValues(props.filterDefaultValues);
    } else if (!_.isEqual(props.filterDefaultValues, filterDefaultValues)) {
      setFilterDefaultValues(props.filterDefaultValues);
    }
  }, [props.filterDefaultValues]);

  useEffect(() => {
    if (!_.isEmpty(filterDefaultValues)) getData();
  }, [filterDefaultValues]);

  useEffect(() => {
    setSelectedId(defaultKeySelected);
  }, [defaultKeySelected]);

  useEffect(() => {
    if (props.selected) setSelectedId(props.selected.id);
  }, [props.selected]);

  useEffect(() => {
    console.log(selectedData)
  }, [selectedData])

  return (
    <SortableList
      items={defaultCategory ? defaultCategory : dataSource}
      distance={5}
      pressThreshold={5}
      lockAxis="y"
      onSortStart={onStart}
      onSortEnd={onSortEnd}
    />
  );
};
export default ListItems;
