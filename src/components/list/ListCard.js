import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import debounce from "lodash/debounce";
/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "../../redux/app/actions";
import {
  Row,
  Col,
  Spin,
  List,
  Card,
  Icon,
  Button,
  message,
  Modal,
  Skeleton
} from "antd";
import PropTypes from "prop-types";
import { getService } from "../../services/services";
const URL_BASE = "http://gooneworld.com";
const { Meta } = Card;
const Container = styled.div`
  overflow: auto;
  padding: 8px 24px;
  min-height: 100vh;
`;
const Loader = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
`;

const ToolContainer = styled(Row)`
  margin: 10px 0px;

  border-bottom: 1px solid #cccccc4a;
  padding-bottom: 10px;
  box-shadow: 0px 4px 1px #cccccc14;

  background: #fff;
  padding: 8px;
  border-radius: 4px;
`;
const ListCard = ({
  source = "",
  column = 3,
  refinement,
  renderItem,
  data,
  title,
  layout = "horizontal",
  switchLayout = true,
  onUpdate,
  updated,
  actions = [],
  tools = [],
  filters = [],
  toolStyle = {},
  ...props
}) => {
  const [dataSource, setDataSource] = useState(data || props.dataSource || []);
  const [service, setService] = useState();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(props.loading);
  const [refresh, setRefresh] = useState(props.refresh || false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(props.hasMore || false);
  const [itemLayout, setLayout] = useState(layout);

  useEffect(() => {
    setRefresh(props.refresh);
    if (props.refresh) {
      resetData();
    }
    if (!initialized) {
      getData({
        query: {
          limit: 10,
          page: page + 1
        }
      });
      setInitialized(true);
    }
    return () => { };
  }, [props.refresh, props.loading, itemLayout]);
  const resetData = () => {
    if (props.onReload) props.onReload();
    getData(
      {
        query: {
          limit: 10,
          page: 1
        }
      },
      props.refresh
    );
  };
  const defaultRenderItem = (item, index) => {
    return (
      <List.Item key={index}>
        <Skeleton avatar title={false} loading={loading} active>
          <Card
            hoverable
            actions={[
              <a target="_blank" href={`${URL_BASE}/${item.url}`}>
                <Icon type="eye" /> View Detail
              </a>,
              <Button type="link" onClick={() => handleDelete(item.id)}>
                <Icon type="delete" /> Delete
              </Button>
            ]}
          >
            <Meta
              title={
                <>
                  <Icon size="large" type="home" />{" "}
                  {item.Slug ? (
                    <span>{item.Slug.replace(/\-/g, " ").toUpperCase()}</span>
                  ) : (
                    <span>{item.url}</span>
                  )}
                </>
              }
            />
          </Card>
        </Skeleton>
      </List.Item>
    );
  };
  const getData = (params = {}, reload) => {
    if (props.data) setDataSource(props.data);

    if (source !== "") {
      const service = getService(source);
      setService(service);
      setLoading(true);
      return service
        .find(params)
        .then(({ data }) => {
          if (data.length > 0) {
            if (refinement)
              data = data.map((item, index, arr) =>
                refinement(item, index, arr)
              );
            if (!reload) {
              setHasMore(true);
              setPage(page + 1);
              setDataSource([...dataSource, ...data]);
            } else {
              setDataSource(data);
              setHasMore(true);
              setPage(1);
            }
          } else {
            setHasMore(false);
          }
          setLoading(false);
          /* onUpdate(false); */
        })
        .catch(err => {
          message.error("ERROR");
        });
    }
  };
  const removeItem = id => {
    service
      .remove(id)
      .then(response => {
        let data = dataSource.filter(it => it.id !== id);
        setDataSource(data);
        message.info("Element removed!");
      })
      .catch(err => message.error(err));
  };
  const handleLayout = () => {
    let layout = itemLayout == "horizontal" ? "vertical" : "horizontal";
    setLayout(layout);
    if (props.onLayout) props.onLayout(layout);
  };
  const handleReload = async () => {
    if (props.onReload) props.onReload();
    if (!loading) {
      await getData(
        {
          query: {
            limit: 10,
            page: 1
          }
        },
        true
      );
    }
  };

  const handleInfiniteOnLoad = () => {
    if (props.onLoadMore) props.onLoadMore();
    getData({
      query: {
        limit: 10,
        page: page + 1
      }
    });
  };
  const handleDelete = id => {
    Modal.confirm({
      title: "Confirm",
      icon: <Icon type="exclamation-circle" />,
      content: "Do you want to delete the record?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => removeItem(id)
    });
  };
  const onChange = async (value, { key }, it) => {
    getData(
      {
        query: {
          limit: 10,
          [it.name || "search"]: value,
          page: 1
        }
      },
      true
    );
    if (it.onChange) it.onChange(value, key);
  };
  const handleChange = debounce(onChange, 100);
  return (
    <>
      <ToolContainer type="flex" justify="space-between" align="middle">
        {(filters.length == 0 || title) && <Col>{title}</Col>}
        {filters.map(it => (
          <Col>
            {React.cloneElement(it, {
              onChange: (value, { key }) => handleChange(value, { key }, it)
            })}
          </Col>
        ))}
        <Col>
          <Row type="flex" justify="end" align="middle" {...toolStyle}>
            {tools.map(it => (
              <Col>{it}</Col>
            ))}
            <Col>
              <Button
                type="link"
                icon={loading ? "loading" : "reload"}
                onClick={handleReload}
              />
            </Col>
            {switchLayout && (
              <Col>
                <Button
                  type="link"
                  icon={itemLayout == "horizontal" ? "table" : "bars"}
                  onClick={handleLayout}
                />
              </Col>
            )}
          </Row>
        </Col>
      </ToolContainer>
      <Container>
        <InfiniteScroll
          {...props}
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List
            itemLayout={itemLayout}
            size="large"
            grid={
              itemLayout == "horizontal"
                ? { gutter: 8, xl: column, lg: 2, md: 2, sm: 1, xs: 1 }
                : { gutter: 8, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }
            }
            dataSource={dataSource}
            renderItem={renderItem || defaultRenderItem}
          >
            {loading && hasMore && (
              <Loader className="demo-loading-container">
                <Spin />
              </Loader>
            )}
          </List>
        </InfiniteScroll>
      </Container>
    </>
  );
};
const mapStateToProps = state => {
  return {
    updated: state.updated
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onUpdate: updated => dispatch({ type: actionTypes.UPDATE_LIST, updated })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListCard);
