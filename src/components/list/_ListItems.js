import { List, Switch, Menu, Col, Row, Avatar, Icon, message, Button, Dropdown, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import { getService } from "../../services/services";
import { DEFAULT_IMAGE, URL_PLACEHOLDER, URL_S3 } from "../../constants/";
import { useSelector, useDispatch } from "react-redux";
import { WrapperItemList } from "./Styles";
import { money } from "../../utils";
import _ from "lodash";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { forEach } from "lodash-es";
import { DinamicForm } from "../com/form/";
import { MyModal } from "../com";

const DragHandle = SortableHandle(({ children }) => <span>{children}</span>);
const defaultActions = {
    create: true,
    edit: true,
    delete: false,
    disable: false
}
const ListItems = ({ title,
    createTitle,
    editTitle,
    fields, source,
    createButtonText,
    editButtonText,
    actionCreateText = "Agregar", reference, onLoad, onAdd, onRemove,
    defaultKeySelected = 0, valueField = "position", showAvatar = true, type = "primary", mode = "modal",
    actions = defaultActions, icon,
    cover_field = "path_main",
    filter, onSelect, refinement,
    refresh,
    onDisable,
    initialValues = {},
    ...props }) => {
    const [loading, setLoading] = useState(true);
    const [filterDefaultValues, setFilterDefaultValues] = useState({});
    const [visible, setVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [dragId, setDragId] = useState();
    const [locale, setLocale] = useState("es");
    /* const locale = useSelector(({ auth }) => {
        return auth.locale;
    }); */
    const handleClick = (id, record, item) => {
        if (selectedId != id) {
            setSelectedId(id);
            if (onSelect) onSelect(id, record, item);
        }
    }
    const handleOnDisabled = (value, item) => {
        if (onDisable) return onDisable(value, item);
        if (reference) {
            const service = getService(reference);
            return service.patch(item.id, {
                ["status"]: (value == true ? "active" : "inactive")
            })
                .then(res => {
                })
                .catch(err => {
                    message.error(err.message);
                })
        }
    }
    const onStart = ({ node, index, collection, isKeySorting }, e) => {
        setDragId(node.id);
    }
    const update = (id, params) => {
        if (reference) {
            const service = getService(reference);
            return service.patch(id, {
                ...params
            })
                .then(res => {
                })
                .catch(err => {
                    message.error(err.message);
                })
        }
    }
    const onSortEnd = async ({ oldIndex, newIndex, collection }, e) => {
        try {
            if (oldIndex == newIndex) {
                let item = dataSource.find((item, index) => (index == newIndex));
                if (item) setSelectedId(item.id);
                return;
            };
            let new_array = arrayMove(dataSource, oldIndex, newIndex);
            setDataSource(new_array);
            let count = 0;
            setSubmitting(true);
            new_array.forEach(async (item, index) => {
                await update(item.id, {
                    [valueField]: index
                });
                count++;
                if (count == new_array.length) {
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
        if (refinement) record = refinement(record);
        let extra_actions = [];
        actions.extra = actions.extra || [];
        if (actions.disable) {
            extra_actions.push(<Switch
                defaultChecked={item.status === "active"}
                onChange={(value) => handleOnDisabled(value, item)} />)
        }
        extra_actions = [
            ...extra_actions,
            ...actions.extra,
            (actions.edit || actions.delete) && <Dropdown overlay={() => (<MenuItems record={item} />)}>
                <Button type="link">
                    <Icon type="more" />
                </Button>
            </Dropdown>
        ]
        return <SortableItem
            key={`item-${record.id}`}
            index={index}
            record={record}
            item={item}
            extra_actions={extra_actions} />
    }
    const customizeRenderEmpty = () => (
        <div style={{ textAlign: 'center' }}>
            <Icon type="smile" style={{ fontSize: 20 }} />
            <p>Data Not Found</p>
        </div>
    );
    const getData = () => {
        if (reference) {
            const service = getService(reference);
            console.log("Get Data: ", filterDefaultValues)
            setLoading(true);
            service.find({
                query: {
                    $sort: {
                        [valueField]: 1
                    },
                    ...filterDefaultValues
                }
            })
                .then(({ data }) => {
                    data = data.map((it, index) => ({
                        ...it,
                        [valueField]: index
                    }))
                    setDataSource(filter ? data.filter(filter) : data)
                    if (onLoad) onLoad(data);
                    setLoading(false);
                })
                .catch(err => {
                    message.error(err.message);
                    setLoading(false);
                });
        }
    }
    const remove = id => {
        if (reference) {
            const service = getService(reference);
            service.remove(id)
                .then(res => {
                    message.success("Registro eliminado!");
                    if (onRemove) onRemove(res);
                    getData();
                })
                .catch(err => {
                    message.error(err.message);
                });
        }
    }
    const handleMenuClick = (key, record) => {
        switch (key) {
            case "delete":
                remove(record.id);
                break;
            case "edit":
                setSelectedId(record.id);
                setVisible(true);
                break;
        }
    }
    const handleAdd = () => {
        setSelectedId(null);
        if (mode == "modal")
            setVisible(true);
        if (onAdd) onAdd(source, reference, mode);
    }
    const MenuItems = props => (
        <Menu
            className={props.className || "list-menu"}
            onClick={({ key }) => handleMenuClick(key, props.record)}>
            {actions.edit && <Menu.Item key="edit">
                <Icon type="edit" />
                Editar
            </Menu.Item>}
            {actions.delete && <Menu.Item key="delete">
                <Icon type="delete" />
                Eliminar
            </Menu.Item>}
        </Menu>
    );
    const SortableItem = SortableElement(({ record, item, extra_actions }) => {
        let cover = record[cover_field] ? `${URL_S3}/${record[cover_field]}` : DEFAULT_IMAGE;

        let isSelected = selectedId ? item.id == selectedId : item.id == defaultKeySelected;
        return (

            <List.Item
                id={item.id}
                actions={extra_actions}
                onClick={() => handleClick(item.id, record, item)}
                className={`item item-${type}  ${isSelected ? "item-selected" : ""}`}
            >
                <List.Item.Meta
                    className={`meta-container ${showAvatar ?
                        "meta-container-avatar"
                        : "meta-container-no-avatar"}`}

                    avatar={<div >
                        {JSON.stringify(record)}
                        {type == "primary" && <Icon type={icon || "right"} />}
                        {showAvatar && <Avatar
                            size="large"
                            shape="square"
                            src={cover}
                        />}
                    </div>
                    }
                    title={<div>
                        {record.name}
                    </div>
                    }
                /*description={
                    money(record["price_tax_incl"])
                }*/
                />
            </List.Item>
        )
    });
    const SortableList = SortableContainer(({ items }) => {
        return (<WrapperItemList>
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
                <List
                    header={title && <div className="list-title">
                        {title && <h2>{title}</h2>}
                        <Button
                            onClick={() => getData()}
                            type="link" loading={submitting || loading} icon="reload" />
                    </div>}
                    title={title}
                    footer={!loading && <div>
                        {actions.create && <div className="add-container">
                            <Button
                                onClick={handleAdd}
                                type="link" icon="plus">
                                {actionCreateText}
                            </Button>
                        </div>}
                    </div>}
                    loading={loading}
                    dataSource={dataSource}
                    renderItem={renderItem}
                >
                </List>
            </ConfigProvider>
            {mode == "modal" && <MyModal
                title={`${selectedId ? (editTitle || "Editar") : (createTitle || "Crear")}`}
                onCancel={() => {
                    setVisible(false);
                }}
                visible={visible}
            >
                <DinamicForm
                    id={selectedId}
                    source={reference}
                    fields={fields}
                    record={initialValues}
                    textAcceptButton={
                        selectedId ? editButtonText : createButtonText
                    }
                    onSubmit={() => {
                        getData();
                        setSelectedId(null);
                        setVisible(false);
                    }}
                />
            </MyModal>}
        </WrapperItemList>
        );
    });
    useEffect(() => {
        if (props.dataSource) {
            setSelectedId(props.dataSource[0].id);
            setDataSource(filter ? props.dataSource.filter(filter) : props.dataSource)
        }
    }, [props.dataSource]);
    /* useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]); */
    useEffect(() => {
        if (!_.isEmpty(filterDefaultValues))
            getData();
    }, [refresh]);
    useEffect(() => {
        if (_.isEmpty(filterDefaultValues)) {
            setFilterDefaultValues(props.filterDefaultValues);
        } else if (!_.isEqual(props.filterDefaultValues, filterDefaultValues)) {
            setFilterDefaultValues(props.filterDefaultValues);
        }
    }, [props.filterDefaultValues]);
    useEffect(() => {
        if (!_.isEmpty(filterDefaultValues))
            getData();
    }, [filterDefaultValues]);
    useEffect(() => {
        setSelectedId(defaultKeySelected);
    }, [defaultKeySelected]);
    return <SortableList
        items={dataSource}
        lockOffset={["0%", "100%"]}
        pressDelay={90}
        lockAxis="y"
        onSortStart={onStart}
        onSortEnd={onSortEnd} />
}
export default ListItems;
