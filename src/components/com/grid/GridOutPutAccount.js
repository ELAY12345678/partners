import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  message,
  Row,
  Col,
  Tooltip,
  Button,
  Modal,
  Icon,
  DatePicker
} from "antd";
import { Wrapper, SearchBox, RoundedButton } from "./Styles";
// import { exportToCsv, exportTableToPdf } from "../../../utils/Helper";
import { FileUploader } from "..";
import { getService } from "../../../services/";
import { useNavigate } from "react-router-dom";
import { MyModal } from "../MyModal";
import Box from "../box/Box";
import uuid from "react-uuid";
import _ from "lodash";

import { AiOutlineReload, AiOutlinePlus, AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import moment from "moment";

const { confirm } = Modal;
const { RangePicker } = DatePicker;

const defaultState = {
  actions: {
    edit: true,
    create: true,
    delete: true
  },
  pagination: {
    showSizeChanger: true,
    defaultCurrent: 0,
    current: 1,
    showTotal: total => {
      return `Total ${total} record${total > 1 ? "s" : ""}`;
    },
    defaultPageSize: 50,
    pageSizeOptions: ["10", "20", "30", "40", "50"]
  }
};

const Grid = (
  {
    source,
    mode = "default",
    report = {},
    initialValues = {},
    custom = false,
    edit,
    create,
    actions = defaultState.actions,
    columns,
    searchText,
    search = false,
    searchById = false,
    refresh = true,
    extra,
    autoScrollX = false,
    exportCsv = false,
    importCsv = false,
    model,
    path,
    searchField = "search",
    buttomAddText = "Agregar",
    title,
    permitFetch = true,
    style,
    returnToParentData,
    updateSource,
    paginationActive = true,
    scroll = false,
    transparent,
    selection = false,
    getCheckboxProps,
    onChangeSelection,
    maxSelection,
    expandable,
    limit = 25,
    ...props
  }
) => {
  const navigate = useNavigate();
  const idComponent = uuid();
  const myRef = useRef();
  const [LIMIT, setLIMIT] = useState(limit);
  const [pagination, setPagination] = useState({
    ...defaultState.pagination,
    // defaultPageSize: LIMIT,
    onShowSizeChange: (current = "invalid value", size) => {
      setLIMIT(size);
    },
  });
  const [filters, setFilters] = useState();
  const [filterDefaultValues, setFilterDefaultValues] = useState({ ...props.filterDefaultValue });
  const [dataSource, setDataSource] = useState(props.dataSource || []);
  const [sorter, setSorter] = useState();
  const [loading, setLoading] = useState(props.loading || false);
  const [exporting, setExport] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isVisibleModalExport, setIsVisisibleModalExport] = useState(false);
  const [rangeDateExport, setRangeDateExport] = useState({});
  const [record, setRecord] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const reservationsService = getService('reservations');

  const getReservations = ({ invoice_payment_id }) => {
    return reservationsService.find({
      query: {
        invoice_payment_id,
        $sort: {
          meta_day: -1
        },
        commission_tax_incl: {
          $gt: 0
        },
        $limit: 1000000000,
      }
    }).then((response) => response?.data || []
    )
  }

  const onSelectChange = (newSelectedRowKeys, newSelectedRecords) => {
    const tempSelecteds = maxSelection ? newSelectedRowKeys.slice(0, maxSelection) : newSelectedRowKeys;
    const tempSelectedRecords = maxSelection ? newSelectedRecords.slice(0, maxSelection) : newSelectedRecords;
    setSelectedRowKeys(tempSelecteds);
    if (onChangeSelection) {
      onChangeSelection(tempSelecteds, tempSelectedRecords);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: getCheckboxProps,
    sticky: true,
  };

  const itemLayout = {
    gridCol: {
      xl: { span: 24 },
      sm: { span: 24 },
      xs: { span: 24 }
    },
    formCol: {
      xl: { span: 24 },
      sm: { span: 24 },
      xs: { span: 24 }
    }
  };

  const handleDelete = (id, record) => {
    if (!source && props.onDelete) {
      props.onDelete(id, record);
    }
    if (source && id) {
      confirm({
        title: "¿Estas seguro?",
        content: "Oprime OK para eliminar el registro.",
        onOk() {
          const service = getService(source);
          service
            .remove(id)
            .then(response => {
              getData();
              message.info("Record eliminado");
            })
            .catch(err => message.error(err.message));
        },
        onCancel() { }
      });
    }
  };

  const handleActions = ({ name, path, onClick, ...record }) => {
    if (onClick) return onClick(record);
    if (name) {
      return navigate(
        `/${props.basePath || "dashboard"}${path || "/" + source}/${name}`
      );
    }
    if (path) {
      return navigate(`/${props.basePath || "dashboard"}${path}`);
    }
  };

  const handleSearch = (value, field) => {
    setFilters({
      ...filters,
      [field ? field : searchField]: value ? value : undefined
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const handleOnChange = (paginator, new_filters, sorter) => {
    let pager = { ...pagination };
    pager.current = paginator.current;
    setPagination(pager);
    setFilters({ ...filters, ...new_filters });
    if (sorter.field)
      setSorter({
        [sorter.field]: sorter.order === "ascend" ? 1 : -1
      });
  };

  const onChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: !value ? filterDefaultValues?.[field] ? filterDefaultValues?.[field] : undefined : value
    });
  };

  const getData = params => {
    if (props.dataSource) {
      return setLoading(false);
    }
    if (!params) {
      params = {
        query: {
          $limit: LIMIT,
          $sort: sorter || filterDefaultValues.$sort,
          ...filterDefaultValues,
          ...filters,
          $skip: 0
        }
      };
    }
    if (source && permitFetch && !_.isEmpty(filterDefaultValues)) {
      setLoading(true);
      const service = getService(source);
      /* Pagination */
      params["query"]["$skip"] = (pagination.current - 1) * LIMIT;
      service
        .find(params)
        .then(async ({ data, meta, total }) => {

          let pager = { ...pagination };
          pager.total = meta ? meta.TotalRecords : total;
          setPagination(pager);
          // setDataSource(data);
          // if (returnToParentData){
          //   returnToParentData(data);
          // }

          let newData = [];
          const reservationsComissionsIds = [];

          for (let i = 0; i < data?.length; i++) {
            // console.log(data?.[i])
            if( data?.[i]?.invoice_payment_id ){
            const reservations = await getReservations({ invoice_payment_id: data?.[i]?.invoice_payment_id });
            if (reservations?.length) {
              reservationsComissionsIds.push(data?.[i]?.id);
              newData = [
                ...newData,
                ..._.map(reservations, (item) => ({
                  ...item, 
                  id: `reserva-${item?.id}`, 
                  type: 'reservation_commissions', 
                  status:data?.[i]?.status, 
                  createdAt: item?.meta_day , 
                  amount: item?.commission_tax_incl ,
                  sortCreatedAt: Number(moment(item?.meta_day).format('YYYYMMDD') || ''),
                })),
              ];
            }
          } else {
            newData.push({
              ...data?.[i],
              sortCreatedAt:Number(`${moment(data?.[i]?.createdAt).format("YYYYMMDD")}` || '')
            })
          }
          }


          const result = _.orderBy(
            _.filter(newData, (item) => !reservationsComissionsIds.includes(item?.id)),
             ['sortCreatedAt'],
             ['desc']
             )


          setDataSource(result);
          setLoading(false);
        })
        .catch(err => {
          message.error(err.message);
          setLoading(false);
        });
    } else {
      setDataSource([])
    }
  };

  const handleEdit = id => {
    if (source) {
      const service = getService(source);
      if (service && id)
        service
          .remove(id)
          .then(response => {
            setLoading(false);
            getData();
          })
          .catch(err => {
            message.error(err.message);
            setLoading(false);
          });
    }
  };

  const modalExportConfig = {
    title: "Exportar histórico de pedidos",
    width: 900,
    destroyOnClose: true,
    content: () => {
      return (
        <>
          <Row gutter={[24, 24]}>
            <Col span={24} align="center">
              <h6>Eligir el rango de tiempo ( Sí es necesario)</h6>
              <RangePicker
                onChange={(_dataMoment, dataString) =>
                  setRangeDateExport({
                    initial_date: dataString[0],
                    final_date: dataString[1]
                  })
                }
              />
            </Col>
            <Col span={24} align="center">
              <Button
                type="primary"
                style={{ marginRight: 12 }}
                icon="download"
                onClick={handleExport}
              >
                Exportar todos los registros
              </Button>
              <Button type="primary" icon="download" onClick={handleExport}>
                Exportar registros en rango escogido
              </Button>
            </Col>
          </Row>
        </>
      );
    },
    okButtonProps: { disibled: true },
    cancelButtonProps: { disibled: true },
    onOk: () => { },
    onCancel: () => {
      setIsVisisibleModalExport(false);
    }
  };

  function handleExport() {
    const service = getService("export-orders");
    service
      .find({
        query: {
          restaurant_id: filterDefaultValues.restaurant_id,
          ...rangeDateExport
        }
      })
      .then(data => {
        let { location } = data;
        const link = document.createElement("a");
        link.href = location;
        link.setAttribute("download", `FileName.xlsx`);
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
        setExport(false);
        setIsVisisibleModalExport(false);
        setRangeDateExport({});
      })
      .catch(e => {
        message.error(e.message);
      });
  }

  const handleOnSubmit = (err, data) => {
    if (!err && !record) setRecord(data);
    getData();
  };


  useEffect(() => {
    if (props.dataSource) {
      setLoading(false);
      setDataSource(props.dataSource);
    }
  }, [props.dataSource]);

  useEffect(() => {
    if (sorter || filters) {
      getData({
        query: {
          $limit: LIMIT,
          ...filterDefaultValues,
          ...filters,
          $sort: sorter || filterDefaultValues.$sort,
          $skip: custom
            ? pagination.current || pagination.defaultCurrent || 0
            : undefined
        }
      });
    }
  }, [filters, sorter]);

  useEffect(() => {
    if (
      !_.isEmpty(props.filterDefaultValues) &&
      !_.isEqual(props.filterDefaultValues, filterDefaultValues)
    ) {
      setFilterDefaultValues({ ...filterDefaultValues, ...props.filterDefaultValues });
    }
    if (_.isEmpty(props.filterDefaultValues)) {
      setFilterDefaultValues({})
    }
  }, [props.filterDefaultValues]);

  useEffect(() => {
    if (filterDefaultValues && permitFetch) {
      getData({
        query: {
          $limit: LIMIT,
          ...filterDefaultValues,
          ...filters,
          $sort: sorter || filterDefaultValues.$sort,
          $skip: custom
            ? pagination.current || pagination.defaultCurrent || 1
            : undefined
        }
      });
    } else {
      setDataSource([]);
    }
  }, [filterDefaultValues, updateSource]);



  const gridColumns = [
    ...columns
      .map(item => ({
        ...item,
        align: "left",
        display:
          typeof item.display !== "undefined" ? item.display : true
      }))
      .filter(item => item.display),
  ];

  if (!_.isEmpty(actions)) {
    gridColumns.push(
      {
        type: "actions",
        width: !actions.extra ? 100 : 150,
        title: "Acciones",
        /* align: "center", */
        fixed: props.fixed
          ? typeof props.fixed === "boolean"
            ? props.fixed
              ? "right"
              : false
            : props.fixed
          : "right",
        render: record => {
          return (
            <Row
              type="flex"
              justify="center"
              align="middle"
              gutter={0}
            >
              {edit && actions.edit && (
                <Col>
                  <Tooltip
                    className="btn-inline"
                    placement="bottom"
                    title="Edit"
                  >
                    <Button
                      type="link"
                      icon={<AiOutlineEdit />}
                      onClick={() => {
                        setRecord(record);
                        setVisible(true);
                        if (props.onChange) props.onChange(record);
                        if (mode === "default") {
                          let query = props.location.search;

                          navigate(
                            `/${props.basePath ||
                            "dashboard"}${path || "/" + source}/${record.id
                            }${query ? query : ""}`
                          );
                        }
                      }}
                    />
                  </Tooltip>
                </Col>
              )}
              {actions.delete && (
                <Col>
                  <Tooltip
                    className="btn-inline"
                    placement="bottom"
                    title="Delete"
                  >
                    <Button
                      onClick={() => handleDelete(record.id, record)}
                      type="link"
                    >
                      <Icon
                        type="delete"
                        theme="twoTone"
                        twoToneColor="#eb2f96"
                      />
                    </Button>
                  </Tooltip>
                </Col>
              )}
              {actions.show && (
                <Col>
                  <Tooltip
                    className="btn-inline"
                    placement="bottom"
                    title="Show"
                  >
                    <Button
                      onClick={() => {
                        return navigate(
                          `/${props.basePath || "dashboard"}${path ||
                          "/" + source}/${record.id}`
                        );
                      }}
                      type="link"
                    >
                      <Icon
                        type="eye"
                        theme="twoTone"
                        twoToneColor="#6610f2"
                      />
                    </Button>
                  </Tooltip>
                </Col>
              )}
              {actions.extra && Array.isArray(actions.extra)
                ? actions.extra.map((item, index) => {
                  return (
                    <Col key={index}>
                      <Button
                        icon={item.icon}
                        onClick={() => {
                          handleActions(record);
                        }}
                        type="dashed"
                        shape="circle"
                        {...item}
                      />
                    </Col>
                  );
                })
                : actions.extra &&
                actions.extra.props &&
                React.Children.map(
                  actions.extra.props.children,
                  (child, index) => {
                    return (
                      <Col key={index}>
                        {React.cloneElement(child, {
                          record,
                          onClick: () => {
                            if (child.props.onClick) {
                              child.props.onClick(record);
                            }
                          }
                        })}
                      </Col>
                    );
                  }
                )}
            </Row>
          );
        }
      }
    )
  }

  return (
    <Wrapper >
      <Row gutter={4}>
        {visible && mode === "inner" && (
          <Col id={idComponent} {...itemLayout.formCol}>
            <div ref={myRef}>
              {record && record.id && edit
                ? React.cloneElement(edit, {
                  id: record.id,
                  initialValues,
                  redirect: false,
                  record,
                  onSubmit: handleOnSubmit
                })
                : React.cloneElement(create, {
                  redirect: false,
                  initialValues,
                  onSubmit: handleOnSubmit
                })}
            </div>
          </Col>
        )}
        <Col {...itemLayout.gridCol}>
          <Box show title={props.listTitle || props.title || undefined} transparent={transparent}>
            <Row align={'top'} justify={'space-between'} wrap={false}>
              <Col flex={'auto'}>
                <Row
                  style={{
                    margin: 10,
                  }}
                  gutter={[16, 16]}
                  type="flex"
                  justify="space-between"
                  align="middle"
                >
                  <Col>
                    <Row type="flex" gutter={[16, 16]}>
                      {searchById && (
                        <Col>
                          <SearchBox
                            allowClear={true}
                            placeholder={"Id"}
                            name='id'
                            onSearch={value => handleSearch(value, 'id')}
                            onChange={e => {
                              let { value } = e.target;
                              if (!value) handleSearch(value, 'id');
                            }}
                          />
                        </Col>
                      )}
                      {search && (
                        <Col>
                          <SearchBox
                            allowClear={true}
                            placeholder={searchText || "Search..."}
                            onSearch={value => handleSearch(value)}
                            onChange={e => {
                              let { value } = e.target;
                              if (!value) handleSearch(value);
                            }}
                          />
                        </Col>
                      )}
                      {title}
                      {props.filters &&
                        React.Children.map(
                          props.filters.props.children,
                          (it, index) => {
                            if (!it) return null;
                            let { name } = it.props;
                            return (
                              <Col key={index}>
                                {React.cloneElement(it, {
                                  onChange: (e, value) => {
                                    value = e && e.target ? e.target.value : value;
                                    onChange(name || "field-" + index, value ? value === '' ? undefined : value : e);
                                  }
                                })}
                              </Col>
                            );
                          }
                        )}

                    </Row>
                  </Col>
                  <Col>
                    {extra}
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row wrap={false}>
                  {exportCsv && (
                    <Tooltip
                      className="btn-inline"
                      placement="bottom"
                      title="Exportar excel"
                    >
                      <RoundedButton
                        loading={exporting}
                        style={{
                          margin: "0px 10px",
                          background: "#1dbf73",
                          border: "1px solid #1dbf73"
                        }}
                        icon="file-excel"
                        type="primary"
                        onClick={() => {
                          setIsVisisibleModalExport(true);
                        }}
                      >
                        Exportar excel
                      </RoundedButton>
                    </Tooltip>
                  )}
                  {importCsv && model && (
                    <Tooltip
                      className="btn-inline"
                      placement="bottom"
                      title="Upload Csv"
                    >
                      <FileUploader
                        {...model}
                        onSubmit={getData}
                        loading={exporting}
                      />
                    </Tooltip>
                  )}
                  {typeof actions == "boolean"
                    ? actions
                    : create &&
                    actions.create && (
                      <RoundedButton
                        icon={!visible ? <AiOutlinePlus /> : <AiOutlineClose />}
                        type={!visible ? "primary" : "danger"}
                        onClick={() => {
                          setRecord(null);
                          setVisible(visible => !visible);
                          /* window.scrollTo(0, myRef.current ? myRef.current.offsetTop : 0) */
                          /* window.location.hash = idComponent; */
                          let query = props.location.search;
                          if (mode === "default")
                            navigate(
                              `/${props.basePath || "dashboard"}${path ||
                              "/" + source}/create${query ? query : ""}`
                            );
                        }}
                      >
                        {buttomAddText}
                      </RoundedButton>
                    )}
                  {refresh && (
                    <Tooltip
                      className="btn-inline"
                      placement="bottom"
                      title="Refresh"
                    >
                      <Button
                        shape="circle"
                        icon={<AiOutlineReload />}
                        type="link"
                        loading={loading}
                        onClick={() => getData()}
                      />
                    </Tooltip>
                  )}
                </Row>
              </Col>
            </Row>
            {/* \\\\ */}
            <Row
              style={{
                marginBottom: 8,
                marginTop: 8,
              }}
              justify='end'
            >
              {
                selectedRowKeys.length ? (
                  <Col>
                    <span
                      style={{
                        marginLeft: 8,
                      }}
                    >
                      {selectedRowKeys.length} registros seleccionados
                    </span>
                  </Col>
                ) : null
              }
            </Row>
            {/* \\\\ */}
            <Table
              rowSelection={selection && rowSelection}
              size="small"
              onChange={handleOnChange}
              pagination={paginationActive ? pagination : false}
              rowKey="id"
              loading={loading}
              showHeader={props.showHeader}
              columns={
                gridColumns.filter(it => {
                  if (it.type === "actions" && typeof actions === "boolean") {
                    return actions;
                  }
                  return typeof it != "undefined";
                })}
              scroll={scroll ? scroll : {
                y: 600,
                x: 800
              }}
              dataSource={dataSource}
              expandable={expandable}
            />
          </Box>
        </Col>
      </Row>
      {
        <MyModal
          title={props.id !== "create" ? "Edit" : "Create"}
          closabled
          onCancel={() => setVisible(false)}
          visible={visible && mode === "modal"}
        >
          {props.id !== "create" && edit
            ? React.cloneElement(edit, {
              id: props.id
            })
            : create}
        </MyModal>
      }
      {exportCsv && isVisibleModalExport && (
        <Modal {...modalExportConfig} visible={isVisibleModalExport}>
          {modalExportConfig.content()}
        </Modal>
      )}
    </Wrapper>
  );
};

export default Grid;
