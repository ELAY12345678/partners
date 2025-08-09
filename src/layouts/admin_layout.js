import React, { useState, useEffect, Suspense } from "react";
import { Layout, Menu, Icon, Row, Col } from "antd";
import { Link } from "react-router-dom"; 
import styled from "styled-components";
import NotFound from "../views/NotFound";
import Loader from "../components/loader";
/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "../redux/app/actions";

/* Import Components */
import SideMenu from "../components/menu/SideMenu";
import SideNotification from "../components/notifications/SideNotification";
import { TopBar } from "../components/header";
import routes from "../routes";
//import { BreadCrumb } from "../components/breadcrumb/BreadCrumb";
import { allowAccess } from "../utils/Helper";
import Loadeable from "react-loadable";
import PrivateRoute from "../utils/PrivateRoute";
import { LOGO_WHITE } from "../constants";
const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

const LogoContainer = styled.div`
  padding: 10px;
  background: var(--blue);
  overflow-x: hidden !important;
`;
const Copy = styled.p`
  text-align: center;
`;
const SideBar = styled.div`

  max-width: 212px;

  background: #fff !important;
  overflow-x: hidden !important;

  height: 100%;
  box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);
`;
const SiderContainer = styled(Sider)`
  position: fixed;
  &.ant-layout-sider {
    background: red !important;
    overflow: auto;
    height: '100vh';
    /* position: 'absolute'; */
    float: right;
    left: 0;
    top: 0;
    bottom: 0;
  }
  &.ant-layout-sider-collapsed .ant-menu-item,
  .ant-layout-sider-collapsed .ant-menu-submenu {
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 10px !important;
  }
  &.logo-container {
    border-bottom:1px solid !important;
  }
  &.logo-container:hover {
    transform: scale(1.5);
    border-bottom:1px solid !important;
  }
  &.ant-layout-sider-collapsed .logo-container div {
    width: 64px !important;
  }
  &.ant-layout-sider-collapsed .ant-menu-item i {
    font-size: var(--font-size-medium);
  }
`;


const HeaderContainer = styled.div`
  & h2 {
    color: #fff;
    margin-bottom: 0px;
  }
`;
const AdminLayout = ({ user = {}, children, collapsedMenu, ...props }) => {
  const [menu, setMenu] = useState([]);
  useEffect(() => {

    if (routes)
      routes.forEach(it => {
        /* Add Edit Route */
        if (typeof it.edit == "undefined") {
          routes.push({
            ...it,
            path: `${it.path}/:id`
          })
        } else {
          routes.push(it.edit)
        }
        /* Add Create Route */
        if (typeof it.create == "undefined") {
          routes.push({
            ...it,
            path: `${it.path}/:id`
          })
        } else {
          routes.push(it.create)
        }
        //console.log("Route:", it.path)
      })
    setMenu(
      routes.map((route, index) => {
        //console.log(route.permissions);
        return allowAccess(route.permissions) ? (
          <route.component
            key={index}
            path={route.path}
            exact={route.exact}
            name={route.name}
          />
        ) : null;
      })
    );
    return () => { };
  }, []);
  return (
    <Layout
      // hasSider
      className="main-layout"
      style={{ minHeight: "100vh", background: "red" }}
    >
      <SiderContainer
        className="sider-container"
        trigger={null}
        collapsible
        collapsed={collapsedMenu}
      >
        <LogoContainer className="logo-container">
          <Link to="/" className="logo">
            <div
              style={{
                background: `url(${LOGO_WHITE})`,
                backgroundRepeat: "no-repeat",
                height: 30,
                backgroundSize: "100% 100%",
                width: 120
              }}
            />
          </Link>
        </LogoContainer>
        <SideBar>{<SideMenu />}</SideBar>
      </SiderContainer>
      <Layout style={{
        marginBottom: -50
      }}>
      </Layout>
      <SiderContainer
        className="sider-container"
        trigger={null}
        collapsible
        collapsed={collapsedMenu}
      >
        <SideBar>{<SideNotification />}</SideBar>
      </SiderContainer>
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    collapsedMenu: state.collapsedMenu,
    user: state.user,
    pathname: state.pathname,
    current: state.current
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onChangePath: pathname =>
      dispatch({ type: actionTypes.CHAGE_PATH, pathname })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminLayout);
