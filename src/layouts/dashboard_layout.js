import React, { useState, useEffect, Suspense } from "react";
import { Alert, Layout, } from "antd";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import NotFound from "../views/NotFound";
import Loader from "../components/loader";

/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "../redux/app/actions";

/* Import Components */
import SideMenu from "../components/menu/SideMenu";
import { TopBar } from "../components/header";
import routes from "../routes";
import { allowAccess } from "../utils/Helper";
import Loadeable from "react-loadable";
import {
  Wrapperlayout,
} from "./Styles";
import { useSelector } from "react-redux";
import SideNotification from "../components/notifications/SideNotification";
import MenuCategories from "../views/menu-categories/MenuCategories";

const { ErrorBoundary } = Alert;


const { Content } = Layout;

const DashboardLayout = ({
  user = {},
  children,
  ...props
}) => {
  const [menu, setMenu] = useState([]);
  const [theme_color, setTheme] = useState({});
  const theme = useSelector(({ appReducer }) => appReducer.theme);
  const dropMenu = useSelector(({ appReducer }) => appReducer.dropMenu);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (routes)
      routes.forEach((it) => {
        /* Add Edit Route */
        if (typeof it.edit == "undefined") {
          routes.push({
            ...it,
            path: `${it.path}/:id`,
          });
        } else {
          routes.push(it.edit);
        }
        /* Add Create Route */
        if (typeof it.create == "undefined") {
          routes.push({
            ...it,
            path: `${it.path}/:id`,
          });
        } else {
          routes.push(it.create);
        }
        //console.log("Route:", it.path)
      });
    setMenu(
      routes.map((route, index) => {
        //console.log(route.permissions);
        return allowAccess(route.permissions) ? (
          <Route
            key={index}
            path={route?.path}
            exact={route?.exact}
            element={<route.component {...props} name={route.name} />}
          />
        ) : null;
      })
    );
    return () => { };
  }, []);
  
  useEffect(() => {
   
    if (theme) setTheme(theme);
    return () => { };
  }, [theme]);

  useEffect(() => {
    if (!window.localStorage.getItem("initialized")) {
      window.localStorage.setItem("initialized", true);
      setInitialized(true);
    } else {
      setInitialized(Boolean(window.localStorage.getItem("initialized")));
    }
    return () => {
      if (window.localStorage.getItem("initialized")) {
        window.localStorage.removeItem("initialized");
        setInitialized(false);
      }
    };
  }, []);

  if (!initialized) return <Loader />;

  return (
    <Wrapperlayout
      style={{ height: "100vh" }}
      {...theme_color}
    >
      <TopBar
        theme={theme}
        title={props.current && props.current.title}
        {...theme_color}
        {...props}
      />
      <Layout
        style={{
          background: theme_color.background || "#f3f3f3",
        }}
      >
        <SideMenu {...props} />
        <Layout>
        
          <Content
            style={{
              background: theme_color.background || "#f3f3f3",
            }}
          >
            <ErrorBoundary>
            <Suspense fallback={<Loader />}> 
              <Routes style={{ height: '100%', width: '100%' }} >
                {menu}
                <Route path="*" exact={true} element={<NotFound />} />
                
              </Routes> 
            </Suspense>
            </ErrorBoundary>
          </Content>
        </Layout>
        <SideNotification />
      </Layout>
    </Wrapperlayout>
  );
};

const mapStateToProps = (state) => {
  const { appReducer } = state;
  return {
    user: appReducer.user,
    pathname: appReducer.pathname,
    current: appReducer.current,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onChangePath: (pathname) =>
      dispatch({ type: actionTypes.CHAGE_PATH, pathname }),
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
