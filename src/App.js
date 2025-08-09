import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import _ from "lodash";
import { Router, createHistory, navigate } from "@reach/router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loadeable from "react-loadable";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "codemirror/lib/codemirror.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "./App.css";
import { socket } from "./api";
/* import * as messages from "./constants/messages"; */
import NotFound from "./views/NotFound";
/* import { retryLoginAndGetCurrentUser } from "./actions/auth"; */
import qs from "qs";
/* Redux Store */
import { store } from "./redux/app";
import { Provider, useSelector } from "react-redux";
import {
  changeRefresh,
  changeAppartaPayRefresh,
} from "./views/orders/redux/actions";
/* Redux */
import { connect } from "react-redux";
import * as actionTypes from "./redux/app/actions";

import Loader from "./components/loader";
/* Fonts */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faCoffee } from "@fortawesome/free-solid-svg-icons";
/* Import Services */
import {
  reAuthenticate,
  current,
  payPaymentsService,
  payWithdrawalService,
} from "./services/services";
import { message } from "antd";

/* Multi language */
import { I18n } from "react-polyglot";
/* import messages from './language'; */
/* import DashboardLayout from "./layouts/dashboard_layout"; */

/*firebase daniel start*/
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getService, OrderService } from "./services/";

const firebaseConfig = {
  apiKey: "AIzaSyCx6MGJKuGg_BOWuN4xAqspViZS1XJMapk",
  authDomain: "apparta-app.firebaseapp.com",
  databaseURL: "https://apparta-app.firebaseio.com",
  projectId: "apparta-app",
  storageBucket: "apparta-app.appspot.com",
  messagingSenderId: "927332588055",
  appId: "1:927332588055:web:418449ed05f9fbba91da52",
  measurementId: "G-S64EJKSEMC",
};
const fapp = initializeApp(firebaseConfig);
const messaging = getMessaging(fapp);

onMessage(messaging, (payload) => {
  console.log("----> payload: ", payload);
  let { data } = payload;
});

/*para el image handler*/
window.imageShark = ({ url, width, height }) =>
  btoa(
    JSON.stringify({
      bucket: "appartaapp",
      key: url,
      edits: { resize: { width, height, fit: "cover" } },
    })
  );

window.imageSharkOriginSize = ({ url }) =>
  btoa(JSON.stringify({ bucket: "appartaapp", key: url }));

const messages = {
  es: {},
  en: {},
};

library.add(fab, fas, faCheckSquare, faCoffee);

/* Import Components */
const DashboardLayout = Loadeable({
  loader: () => import("./layouts/dashboard_layout"),
  loading: Loader,
});
const SignIn = Loadeable({
  loader: () => import("./views/authentication/signin/SignIn"),
  loading: Loader,
});
// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function() {
  let str = this.toString();
  let regex = /(\s[\w])+/g;
  let match = str.match(regex);
  if (match) {
    match.forEach((key) => {
      if (key) str = str.replace(key, key.toUpperCase());
    });
  }
  if (str[0]) return str[0].toUpperCase() + str.slice(1, str.length);
};
// eslint-disable-next-line no-extend-native
String.prototype.format = function() {
  let str = this;
  for (let key in arguments) {
    let value = arguments[key];
    if (typeof value == "object") {
      let match = str.match(/\{(\w+\.?\w+)\}/g);
      if (match) {
        match.forEach((k) => {
          k = k.replace(/\{|\}/g, "");
          let val = k.split(".").reduce((prev, current) => {
            return prev[current] ? prev[current] : prev;
          }, value);
          str = str.replace("{" + k + "}", val);
        });
      }
    } else {
      str = str.replace("{" + key + "}", value);
    }
  }
  return str;
};
library.add(fab, fas, faCheckSquare, faCoffee);

const Root = styled.div`
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  html,
  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  span,
  * {
    font-family: "Poppins", "font-awesome";
  }
`;

// let history = createHistory(window);

const NOTIFICATION_TYPE = {
  appartapay: "appartapay",
  reservation: "reservation",
  payWithdrawal: "payWithdrawal",
};

const App = ({
  onCurrentUser,
  setCurrentUserPermissions,
  handleChangeRefresh,
  setNotificationData,
  removeNotificationData,
  handleChangeAppartaPayRefresh,
  ...props
}) => {
  const user = useSelector(({ appReducer }) => appReducer?.user);
  const myRef = useRef(null);
  const [locale, setLocale] = useState("es");
  const [isLoadingAuthenticated, setIsLoadingAuthenticated] = useState(true);

  const connect = ({ strategy = "jwt", accessToken, ...rest }) => {
    return socket.authenticate({
      strategy,
      accessToken,
      ...rest,
    });
  };

  useEffect(() => {
    setIsLoadingAuthenticated(true);
    reAuthenticate()
      .then(({ user, accessToken }) => {
        /* Socket Authentication */
        onCurrentUser(user);
        connect({
          accessToken,
        });
        current()
          .then(async (response) => {
            try {
              let currentToken = await getToken(messaging, {
                vapidKey:
                  "BJscdz8mrOfOES_F2M2UWH7yvxKzDIayIFjzfhFdfwDEgsELiRC0Ewc-UON1-gUpY3LuZ-yb0IYXNXf8sbJGfjc",
              });
              if (currentToken)
                window.localStorage.setItem("firebase-token", currentToken);
              onCurrentUser({ ...user, "firebase-token": currentToken });

              setCurrentUserPermissions(user.permissionsv2 || []);
              // let { pathname } = history.location;
              // if (pathname === "/") navigate("/dashboard");
            } catch (err) {
              message.error(err);
            }
          })
          .catch((err) => {
            message.error(err.message);
            // navigate("/");
          });
      })
      .catch((err) => {
        // let { pathname } = history.location;
        // if (pathname.includes("dashboard")) navigate("/");
      })
      .finally(() => {
        setIsLoadingAuthenticated(false);
      }); 
  }, []);

  useEffect(() => {
    payWithdrawalService.on("patched", (payment) => {
      document
        .getElementById("root")
        .click(); /*se hace esto para garantizar que haya sonido , se emula un click*/
      var audio = new Audio(
        "https://menuapps3.s3.us-east-1.amazonaws.com/static/audioblocks-xylophone-menu-app-indicate-alert-3_HKdJ1zU0P8_NWM.mp3"
      );
      audio.play();
      setNotificationData({
        ...payment,
        notificationType: NOTIFICATION_TYPE.payWithdrawal,
      });
    });
    return () => {
      payWithdrawalService.off("patched");
    };
  }, []);

  useEffect(() => {
    OrderService.on("created", (reservation) => {
      if (reservation.status === "acquired") handleChangeRefresh();
      if (reservation.status === "pendingApproval") {
        setNotificationData({
          ...reservation,
          notificationType: NOTIFICATION_TYPE.reservation,
        });
        document.getElementById("root").click();
        var audio = new Audio(
          "https://menuapps3.s3.us-east-1.amazonaws.com/static/audioblocks-xylophone-menu-app-indicate-alert-3_HKdJ1zU0P8_NWM.mp3"
        );
        audio.play();
      }
    });

    OrderService.on("patched", (reservation) => {
      if (
        reservation.status === "acquired" ||
        reservation.status === "notApproved" ||
        reservation.status === "canceledByUser"
      ) {
        removeNotificationData({
          ...reservation,
          notificationType: NOTIFICATION_TYPE.reservation,
        });
      }
      handleChangeRefresh();
    });

    return () => {
      OrderService.off("created");
      OrderService.off("patched");
    };
  }, []);

  useEffect(() => {
    payPaymentsService.on("created", (payment) => {
      document
        .getElementById("root")
        .click(); /*se hace esto para garantizar que haya sonido , se emula un click*/
      var audio = new Audio(
        "https://menuapps3.s3.us-east-1.amazonaws.com/static/audioblocks-xylophone-menu-app-indicate-alert-3_HKdJ1zU0P8_NWM.mp3"
      );
      audio.play();
      setNotificationData({
        ...payment,
        notificationType: NOTIFICATION_TYPE.appartapay,
      });
      handleChangeAppartaPayRefresh();
    });
    payPaymentsService.on("patched", (payment) => {
      document
        .getElementById("root")
        .click(); /*se hace esto para garantizar que haya sonido , se emula un click*/
      var audio = new Audio(
        "https://menuapps3.s3.us-east-1.amazonaws.com/static/audioblocks-xylophone-menu-app-indicate-alert-3_HKdJ1zU0P8_NWM.mp3"
      );
      audio.play();
      setNotificationData({
        ...payment,
        notificationType: NOTIFICATION_TYPE.appartapay,
      });
      handleChangeAppartaPayRefresh();
    });

    return () => {
      payPaymentsService.off("created");
      payPaymentsService.off("patched");
    };
  }, []);
  // Fin sockets

  useEffect(() => {
    if (
      user &&
      user?.role === "user" &&
      user?.permissionsv2 &&
      !(user?.permissionsv2?.length > 15)
    ) {
      const reservationService = getService("reservations");
      reservationService
        .find({
          query: {
            establishment_id: {
              $in: user?.permissionsv2?.map(
                ({ establishment_id }) => establishment_id
              ),
            },
            $limit: 100000,
            $sort: {
              createdAt: -1,
            },
            $client: {
              skipJoins: true,
            },
            status: "pendingApproval",
            meta_day: moment().format("YYYY-MM-DD"),
          },
        })
        .then(({ data }) => {
          if (!_.isEmpty(data))
            _.map(data, (reservation) =>
              setNotificationData({
                ...reservation,
                notificationType: NOTIFICATION_TYPE.reservation,
              })
            );
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  }, [user]);

  const ScrollToTop = ({ children, location }) => {
    // useEffect(
    //   () => window.scrollTo(0, myRef.current ? myRef.current.offsetTop : 0),
    //   [location.pathname]
    // );
    return children;
  };

  return (
    <I18n locale={locale} messages={messages[locale]}>
      <Provider store={store}>
        <Root>
          <BrowserRouter>
            <ScrollToTop path="/">
              {isLoadingAuthenticated ? (
                <Loader />
              ) : !!user?.role ? (
                <DashboardLayout path="/dashboard/*" />
              ) : (
                <Routes>
                  <Route  path="/" element={<SignIn />} />
                  <Route  path="/signin" element={<SignIn />} />
                  <Route  path="*" exact={true} element={<NotFound />} />
                </Routes>
              )}
            </ScrollToTop>
          </BrowserRouter>
        </Root>
      </Provider>
    </I18n>
  );
};

const mapStateToProps = (state) => {
  const { appReducer } = state;
  return {
    user: appReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCurrentUser: (user) =>
      dispatch({
        type: actionTypes.AUTHENTICATION,
        user,
      }),
    setNotificationData: (notification) =>
      dispatch({
        type: actionTypes.SET_NOTIFICATION_DATA,
        payload: notification,
      }),
    setCurrentUserPermissions: (permissions) =>
      dispatch({
        type: "DASHBOARD/SET_USER_PERMISSIONS",
        payload: permissions,
      }),
    removeNotificationData: (notification) =>
      dispatch({
        type: actionTypes.REMOVE_NOTIFICATION_DATA,
        payload: notification,
      }),
    handleChangeRefresh: () => dispatch(changeRefresh(true)),
    handleChangeAppartaPayRefresh: () =>
      dispatch(changeAppartaPayRefresh(true)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
