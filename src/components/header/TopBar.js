import React, { useState, useEffect } from "react"; 
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMedia } from "react-use";
import { Layout, Row, Col, Icon, Dropdown, Menu, message, Avatar, Button, Badge, Tooltip } from "antd";
/* Redux */
import { connect, useDispatch } from "react-redux";
import * as actionTypes from "../../redux/app/actions";
import { setSetEstablishmentFilters } from '../../views/orders/redux/actions';
//
import { Logout, disconnect } from "../../services/services";
import { getService } from "../../services";
import preval from "preval.macro";
import _moment from "moment-timezone";
import { DEFAULT_USER_AVATAR, S3_PATH_IMAGE_HANDLER } from "../../constants"


import EstablishmentFilters from './EstablishmentFilters';
import RestaurantFiltersForAdmin from "./EstablishmentsFilterForAdmin";

import { LogoAppartaImg, TopHeader } from "./Styles";
import LogoApparta from '../../sources/images/LOGO_SVG.svg';
import { CgMenuGridO } from 'react-icons/cg';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { AiOutlineYoutube } from 'react-icons/ai';

const TopBar = (props) => {
  const location = useLocation();


  useEffect(() => {
    console.log('location', location);

    console.log( location?.pathname !== '/dashboard/establishment/menu');
    console.log( location?.pathname !== '/dashboard/establishment/discounts/templates');
    console.log( location?.pathname !== '/dashboard/establishment/discounts/deals');
    console.log( !location?.pathname?.includes('/dashboard/establishment/invoice'));

    console.log(
      location?.pathname !== '/dashboard/establishment/menu'
                        && location?.pathname !== '/dashboard/establishment/discounts/templates'
                        && location?.pathname !== '/dashboard/establishment/discounts/deals'
                        && !location?.pathname?.includes('/dashboard/establishment/invoice')
                        ? true
                        : false
    );
  }, [location]);


  const navigate = useNavigate();

  const {
    user = {},
    collapsedMenu,
    establishmentFilters,
    handleSetEstablishmentFilters,
    notificationsDataCount,
    ...rest
  } = props;

  const dropMenu = useMedia("(max-width: 576px)");
  const dropEstablishmentFilters = useMedia("(max-width: 718px)");
  const dispatch = useDispatch();
  const service = getService("configurations");
  const [latestBuild, setLastestBuild] = useState(false);
  const prevalBuild = preval`module.exports = new Date()`;
  const currentBuild = _moment(prevalBuild);


  async function getLastBuild() {
    try {
      const response = await service.get(26);
      const latest = _moment(response?.value);


      if (_moment(latest).isSameOrAfter(currentBuild)) {
        alert("Hay una nueva versión. Debes actualizar la pantalla.");
        window.location.reload();
      } else {
        console.log("La version actual es la más reciente .")
      }

    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getLastBuild().then();
  }, [latestBuild]);


  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|iPad Pro|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      dispatch({
        type: actionTypes.DROP_MENU,
        dropMenu: {
          dropMenu: true
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("initialized")) {
      dispatch({
        type: actionTypes.DROP_MENU,
        dropMenu: {
          dropMenu: dropMenu
        }
      });
      localStorage.setItem("initialized", true);
    }
    return () => {
      if (localStorage.getItem("initialized"))
        localStorage.removeItem("initialized");
    };
  }, [dropMenu]);


  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "logout":
        Logout()
          .then(response => {
            disconnect();
            window.localStorage.removeItem("initialized");
            window.localStorage.clear();
            navigate("/");
            window.location.reload();
          })
          .catch(err => message.error(err.message));
        break;
      default:
        break;
    }
  };

  const handleMenuTopClick = ({ key }) => {
    switch (key) {
      case "orders":
        navigate("/dashboard/orders");
        break;
      case "menu-categories":
        navigate("/dashboard/menu-categories");
        break;
      case "menu-reviews":
        navigate("/dashboard/menu-reviews");
        break;
      case "log-orders":
        navigate("/dashboard/log-orders");
        break;
      case "brands":
        navigate("/dashboard/brands");
        break;
      case "restaurants":
        navigate("/dashboard/restaurants");
        break;
      case "shipping-costs":
        navigate("/dashboard/shipping-costs");
        break;
      case "user-brand-permissions":
        navigate("/dashboard/users-brand-permissions?role=user");
        break;
      case "users":
        navigate("/dashboard/users?role=admin");
        break;
      case "kwoledge-base":
        navigate("/dashboard/knowledge-base?role=admin");
        break;
      case "articles":
        navigate("/dashboard/articles");
        break;
      case "logout":
        Logout()
          .then(response => {
            disconnect();
            window.localStorage.removeItem("initialized");
            window.localStorage.clear();
            navigate("/");
            window.location.reload();
          })
          .catch(err => message.error(err.message));
        break;
      default:
        break;
    }
  };

  const menuTop = (
    <Menu onClick={handleMenuTopClick}>
      <Menu.Item key="orders">
        <Icon type="inbox" />
        Recepción de pedidos
      </Menu.Item>
      <Menu.Item key="menu-categories">
        <Icon type="fire" />
        Menú-Carta
      </Menu.Item>
      <Menu.Item key="menu-reviews">
        <Icon type="star" />
        Calificaiónes
      </Menu.Item>
      <Menu.Item key="log-orders">
        <Icon type="shopping" />
        Historial de pedidos
      </Menu.Item>
      <Menu.Item key="brands">
        <Icon type="shop" />
        Marcas
      </Menu.Item>
      <Menu.Item key="restaurants">
        <Icon type="shop" />
        Restaurantes
      </Menu.Item>
      <Menu.Item key="shipping-costs">
        <Icon type="rocket" />
        Costos de envio
      </Menu.Item>
      <Menu.Item key="users-brand-permissions">
        <Icon type="team" />
        Mi equipo
      </Menu.Item>
      <Menu.Item key="users">
        <Icon type="team" />
        Usuarios PoketMenu
      </Menu.Item>
      <Menu.Item key="kwoledge-base">
        <Icon type="book" />
        Centro de ayuda
      </Menu.Item>
      <Menu.Item key="articles">
        <Icon type="file-text" />
        Articulos
      </Menu.Item>
      <Menu.Item key="logout">
        <Icon size="large" type="logout" />
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: 'logout',
          label: 'Cerrar sesión',
        },
        {
          key: 'user',
          label: `${user?.first_name} ${user?.last_name}`,
        },
        {
          key: 'build',
          label: `Build: ${_moment(prevalBuild).format("YYYY-MM-DD HH:mm:ss")}`,
        },
      ]}
    />
  );

  const handlePermission = permission => {
    // Whatever the user answers, we make sure Chrome stores the information
    if (!("permission" in Notification)) {
      Notification.permission = permission;
    }
    // set the button to shown or hidden, depending on what the user answers
    if (
      // Notification.permission === "denied" ||
      Notification.permission === "default"
    ) {
      message.error("Notifications not allowed");
    } else {
    }
  };

  const checkNotificationPromise = () => {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (user) {
      if (!("Notification" in window)) {
      } else {
        if (checkNotificationPromise()) {
          Notification.requestPermission().then(permission => {
            handlePermission(permission);
          });
        } else {
          Notification.requestPermission(function (permission) {
            handlePermission(permission);
          });
        }
      }
    }
  }, []);


  useEffect(() => {
    console.log('dropEstablishmentFilters', dropEstablishmentFilters);
  }, [dropEstablishmentFilters]);

  return (
    <TopHeader>
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        style={{
          width: '100%',
          height: '54px',
          paddingRight: '20px'
        }}
      >
        <Col>
          <Row type="flex" align="middle" >
            <Col>
              <Button
                type="text"
                onClick={() => rest.onToggleNavigation()}
                className="trigger"
              >
                <CgMenuGridO color="var(--purple)" />
              </Button>
            </Col>
            <Col>
              <Link to="/dashboard">
                <LogoAppartaImg
                  src={LogoApparta}
                  alt='logo app'
                />
              </Link>
            </Col>
          </Row>
        </Col>
        {!dropEstablishmentFilters &&
          <Col>
            {
              user.role === "admin"
                ? (
                  <RestaurantFiltersForAdmin
                    user={user}
                    establishmentFilters={establishmentFilters}
                    handleSetEstablishmentFilters={handleSetEstablishmentFilters}
                    showBranch={
                       location?.pathname !== '/dashboard/establishment/menu'
                        && location?.pathname !== '/dashboard/establishment/discounts/templates'
                        && location?.pathname !== '/dashboard/establishment/discounts/deals'
                        && !location?.pathname?.includes('/dashboard/establishment/invoice')
                        ? true
                        : false}
                  />
                ) : (
                  <EstablishmentFilters
                    user={user}
                    establishmentFilters={establishmentFilters}
                    handleSetEstablishmentFilters={handleSetEstablishmentFilters}
                    showBranch={
                      location?.pathname !== '/dashboard/establishment/menu'
                        && location?.pathname !== '/dashboard/establishment/discounts/templates'
                        &&  location?.pathname !== '/dashboard/establishment/discounts/deals'
                        &&  !location?.pathname?.includes('/dashboard/establishment/invoice')
                        ? true
                        : false}
                  />
                )
            }
          </Col>
        }
        <Col>
          <Row gutter={16}>
            <Col>
              <Tooltip title='Tutorial Dashboard'>
                <Button
                  type="link"
                  icon={<AiOutlineYoutube size={25} />}
                  onClick={() =>
                    window.open('https://www.youtube.com/watch?v=XloZmviOzuI&ab_channel=MarianaRincon', '_blank')
                  }
                />
              </Tooltip>
            </Col>
            <Col >
              <Badge
                count={notificationsDataCount}
                overflowCount={9}
                style={{ background: "var(--purple)" }}>
                <Button
                  type="text"
                  shape="circle"
                  disabled={!(notificationsDataCount > 0)}
                  icon={<MdOutlineNotificationsNone size={25} />}
                  onClick={() => rest.onCollapsedNotification()}
                />
              </Badge>
            </Col>
            <Col >
              <Dropdown overlay={menu}>
                {
                  user?.avatar_gallery?.path ? (
                    <Avatar
                      src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                        url: user.avatar_gallery.path,
                        width: 64,
                        height: 64,
                      })}`}
                    />
                  ) : (
                    <Avatar
                      src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                        url: DEFAULT_USER_AVATAR,
                        width: 64,
                        height: 64,
                      })}`}
                    />
                  )
                }
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
      {dropEstablishmentFilters &&
        <Row
          type="flex"
          align="middle"
          justify="center"
          style={{
            width: '100%',
            height: '45px',
            borderTop: '1px solid rgb(217, 217, 217)'
          }}
        >
          <Col>
            {
              user.role === "admin"
                ? (
                  <RestaurantFiltersForAdmin
                    user={user}
                    establishmentFilters={establishmentFilters}
                    handleSetEstablishmentFilters={handleSetEstablishmentFilters}
                    showBranch={
                      location?.pathname !== '/dashboard/establishment/menu'
                        && location?.pathname !== '/dashboard/establishment/discounts/templates'
                        && location?.pathname !== '/dashboard/establishment/discounts/deals'
                        && !location?.pathname?.includes('/dashboard/establishment/invoice')
                        ? true
                        : false}
                  />
                ) : (
                  <EstablishmentFilters
                    user={user}
                    establishmentFilters={establishmentFilters}
                    handleSetEstablishmentFilters={handleSetEstablishmentFilters}
                    showBranch={
                        location?.pathname !== '/dashboard/establishment/menu'
                        && location?.pathname !== '/dashboard/establishment/discounts/templates'
                        && location?.pathname !== '/dashboard/establishment/discounts/deals'
                        && !location?.pathname?.includes('/dashboard/establishment/invoice')
                        ? true
                        : false}
                  />
                )
            }
          </Col>
        </Row>
      }
    </TopHeader >
  );
};

/* Inject reducers */

const mapStateToProps = state => {
  const { appReducer, dashboardReducer } = state;
  return {
    collapsedMenu: appReducer.collapsedMenu,
    dropMenu: appReducer.dropMenu,
    user: appReducer.user,
    establishmentFilters: dashboardReducer.establishmentFilters,
    notificationsDataCount: appReducer.notificationsDataCount
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    onCollapsedNotification: () => dispatch({ type: actionTypes.COLLAPSE_NOTIFICATION }),
    handleSetEstablishmentFilters: (payload) => dispatch(setSetEstablishmentFilters(payload))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
