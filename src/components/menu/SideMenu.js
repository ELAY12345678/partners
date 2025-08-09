import React, { useEffect, useState } from "react";
import { Menu, Icon, Layout } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import * as actionTypes from "../../redux/app/actions";
import menu from "../../menu-items";
import { allowAccess } from "../../utils/Helper";
import qs from "qs";

const MenuStyled = styled(Menu)`
  &.ant-menu {
    margin-top: 10px !important;
  }
  & .ant-menu-submenu .ant-menu-item {
    padding-left: 30px !important;
  }
  & .ant-menu-submenu-selected {
    color: var(--white) !important;
    background-color: var(--primary) !important;
  }
  & .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
   
  }
  .ant-menu-item {
    height: 50px !important;
    line-height: 50px !important;
    border-radius: 0.25rem;
    padding: 4px 10px !important;
    margin: 0px 0px !important;
    display: flex;
    align-items: center;
    margin-bottom: 4px !important;
    color:rgba(0, 0, 0, 0.87)
    ;
    font-size:14px !important;
  }
  .ant-menu-item-selected {
    background: #eef1f5 !important;
    color: black !important;
    /* box-shadow: 0 10px 5px -8px rgba(0, 0, 0, 0.4) !important; */
  }

  & .ant-menu-item-selected i {
    font-size: var(--font-size-medium);
  }
  & .icon-item svg {
    padding: 0px 4px;
  }
  & .ant-menu-submenu-title {
    height: 30px !important;
    line-height: 30px !important;
  }
  & .ant-menu-submenu .ant-menu-item {
    padding-left: 16px !important;
  }
  & .item-btn {
    background-color: rgba(0, 0, 0, 0.3) !important;
    font-size: 16px !important;
    height: 28px !important;
    padding: 4px !important;
    margin: 0px 10px !important;
    color: #d9d9d9 !important;
  }
`;
const SideMenu = props => {

  const navigate = useNavigate();

  const { collapsedMenu, pathname, onToggleNavigation } = props;

  const [current, setCurrent] = useState();
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState(menu.items || []);
  const user = useSelector(({ user }) => user);

  useEffect(() => {
    let { pathname, current } = props;
    if (pathname) {
      setCurrent(pathname);
    } else {
      props.onChangePath(window.location.pathname);
      setCurrent(window.location.pathname);
    }
    const item = getCurrentItem(menu.items);
    props.onChangePage(item);
    if (!initialized && user) {
      getTeams();
      setInitialized(true);
    }
    return () => { };
  }, [props]);

  const handleClick = ({ key }) => {
    let query = qs.parse(props?.location?.search?.replace(/\?/, ''));
    if (Object.values(query).length > 0) {
      if (key.includes("?")) {
        let search = qs.parse(key.substring(key.indexOf("?") + 1, key.length));
        query = { ...query, ...search }
        key = key.substring(0, key.indexOf("?"));
      }
      key = `${key}${query ? "?" + qs.stringify(query) : ""}`;
    }
    props.onChangePath(key);
    navigate(key);
    if (key === '/dashboard')
      onToggleNavigation();
  };

  const getCurrentItem = items => {
    let { pathname } = window.location;
    let find = null;
    items.forEach(item => {
      if (pathname === item.url) {
        find = item;
      }
      if (!find && item.children) {
        find = getCurrentItem(item.children);
      }
    });
    return find;
  };

  const handleSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    props.onChangePage({
      id: item.props.id,
      title: item.props.title,
      url: item.props.url
    });
  };


  const getTeams = () => {
    /* const service = getService("teams");
    let { company_id } = user;
    service
      .find({
        query: {
          $limit: 5,
          $or: [
            {
              company_id
            },
            {
              user_id: user.id
            }
          ]
        }
      })
      .then(({ data }) => {
        let items = Array.from(menu.items);
        items = [
          ...items,
          {
            id: "teams",
            title: "Teams",
            icon: "team",
            type: "group",
            children: [
              {
                id: "show-all",
                title: "Show All Teams",
                className: "item-btn",
                icon: "eye",
                type: "item",
                url: `/dashboard/teams`
              },
            ]
          }
        ];
        setItems(items);
        setTeams(data);
      })
      .catch(err => {
        message.error(err.message);
      }); */
  };

  const SiderContainer = styled(Layout.Sider)`

  &.ant-layout-sider {
    background:  ${props => props.position === 'right' ? 'transparent' : '#fff'};
    position: ${props => props.position === 'true' ? 'absolute' : 'relative'};
    z-index:101;
    right: ${props => props.position === 'right' ? 0 : 'auto'};
    height: ${props => props.position === 'true' ? '94vh' : '100%'};;
    box-shadow: ${props => props.position === 'right' ? 0 : '0 2px 10px -1px rgba(69, 90, 100, 0.3)'};
    overflow:auto !important;
  }
  .ant-menu-item {
    margin: 0px 0px !important;
    font-size:16px !important;
  }
`;

  return (
    <SiderContainer
      className="sider-container"
      trigger={null}
      collapsible
      collapsed={collapsedMenu}
      collapsedWidth="0"
      width={'300px'}
      position={props?.location?.pathname === '/dashboard' ? 'true' : 'false'}
    >
      <Menu
        className="side-menu"
        theme="light"
        mode="inline"
        style={{ width: '100%', }}
        onClick={handleClick}
        onSelect={handleSelect}
        selectedKeys={[pathname]}
        defaultSelectedKeys={["/dashboard"]}
        items={
          items
            .filter(it => it && allowAccess(it.permissions))
            .map((item, index) => item)
        }
      />
    </SiderContainer>
  );
};

const mapStateToProps = ({ appReducer }) => {
  return {
    pathname: appReducer.pathname,
    current: appReducer.current,
    collapsedMenu: appReducer.collapsedMenu,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onChangePath: pathname =>
      dispatch({ type: actionTypes.CHAGE_PATH, pathname }),
    onChangePage: current => dispatch({ type: actionTypes.CHAGE_PAGE, current }),
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);