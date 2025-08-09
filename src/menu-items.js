import { AiOutlineDollarCircle, AiOutlineFile, AiOutlinePercentage, AiOutlinePhone, AiOutlineQuestion, AiOutlineSetting, AiOutlineStar, AiOutlineTool } from 'react-icons/ai';
import { BsCreditCard, BsGrid, BsImages, BsPinMap } from 'react-icons/bs';
import { FaMobileAlt } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { GrSecure } from 'react-icons/gr';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoCalendarClearOutline, IoDocumentTextOutline, IoFastFoodOutline, IoFootstepsOutline, IoRestaurantOutline, IoStorefrontOutline } from 'react-icons/io5';
import { MdFormatListNumbered, MdLocationSearching, MdOutlineCampaign, MdOutlineNotificationsActive, MdOutlineSupportAgent } from 'react-icons/md';
import { RiCoupon2Line, RiUserStarLine } from 'react-icons/ri';

const menu = {
  items: [
    {
      label: "Dashboard",
      key: "/dashboard",
      icon: <MdOutlineNotificationsActive />,
    },
    {
      label: "Menú/Carta",
      key: "/dashboard/establishment/menu",
      icon: <IoRestaurantOutline />,
    },
    {
      label: "Historial de reservas",
      key: "/dashboard/reservations/history",
      icon: <IoCalendarClearOutline />,
    },
    {
      label: "Calificaciones",
      key: "/dashboard/establishment/ratings",
      icon: <AiOutlineStar />,
    },
    {
      label: "Descuentos",
      key: "/dashboard/establishment/discounts",
      icon: <AiOutlinePercentage />,
      children: [
        {
          label: "Específicos",
          key: "/dashboard/establishment/discounts/specific",
          icon: <AiOutlinePercentage />,
        },
        {
          label: "Plantillas",
          key: "/dashboard/establishment/discounts/templates",
          icon: <AiOutlineFile />,
        },
        {
          label: "Ofertas",
          key: "/dashboard/establishment/discounts/deals",
          icon: <AiOutlinePercentage />,
        },
      ]
    },
    {
      label: "Facturación",
      key: "/dashboard/establishment/billing",
      icon: <IoDocumentTextOutline />,
    },
    {
      label: "Transferencias",
      key: "/dashboard/establishment/transfer",
      icon: <BsCreditCard />,
    },
    {
      label: "Histórico AppartaPay",
      key: "/dashboard/establishment/apparta-pay-history",
      icon: <AiOutlineDollarCircle />,
    },
    {
      id: "users",
      permissions: ["admin"],
      label: "Administración",
      key: "/dashboard/management",
      icon: <AiOutlineSetting />,
      children: [
        {
          label: "Apparta Donde quieras",
          key: "/dashboard/management/reservations-on-demand",
          icon: <AiOutlinePhone />,
        },
        {
          label: "Banners",
          key: "/dashboard/management/banners",
          icon: <BsImages />,
        },
        {
          label: "Apparta Menu",
          key: "/dashboard/management/menu-banners",
          icon: <FaMobileAlt />,
        },
        {
          label: "Blog Apparta",
          key: "/dashboard/management/blogs",
          icon: <AiOutlineFile />,
        },
        {
          label: "Calif. de usuarios",
          key: "/dashboard/management/users-ratings",
          icon: <AiOutlineStar />,
        },
        {
          label: "Campañas",
          key: "/dashboard/management/campaigns",
          icon: <MdOutlineCampaign />,
        },
        {
          label: "Categorías",
          key: "/dashboard/management/categories",
          icon: <BsGrid />,
        },
        {
          label: "Cms",
          key: "/dashboard/management/cms",
          icon: <AiOutlineQuestion />,
        },
        {
          label: "Configuraciones",
          key: "/dashboard/management/configurations",
          icon: <AiOutlineTool />,
        },
        {
          label: "Cuentas AppartaPay",
          key: "/dashboard/management/pay-accounts",
          icon: <AiOutlineDollarCircle />,
        },
        {
          label: "Cupones AppartaPay",
          key: "/dashboard/management/appartapay-coupons",
          icon: <RiCoupon2Line />,
        },
        {
          label: "Cupones",
          key: "/dashboard/management/coupons",
          icon: <RiCoupon2Line />,
        },
        {
          label: "Facturas",
          key: "/dashboard/management/invoices",
          icon: <IoDocumentTextOutline />,
        },
        {
          label: "Fidelización",
          key: "/dashboard/management/fidelizations",
          icon: <RiUserStarLine />,
        },
        {
          label: "Lugares",
          key: "/dashboard/management/places",
          icon: <HiOutlineLocationMarker />,
        },
        {
          label: "OnBoarding",
          key: "/dashboard/management/on-boarding",
          icon: <IoFootstepsOutline />,
        },
        {
          label: "Plantillas globales",
          key: "/dashboard/management/global-templates",
          icon: <AiOutlineFile />,
        },
        {
          label: "Posiciones",
          key: "/dashboard/management/establishments-position",
          icon: <MdFormatListNumbered />,
        },
        {
          label: "Posiciones Tmp",
          key: "/dashboard/management/establishments-position-tmp",
          icon: <MdFormatListNumbered />,
        },
        {
          label: "Reservas",
          key: "/dashboard/management/reservations",
          icon: <IoFastFoodOutline />,
        },
        {
          label: "Restaurantes",
          key: "/dashboard/management/establishments",
          icon: <IoStorefrontOutline />,
        },
        {
          label: "Seguridad",
          key: "/dashboard/management/security",
          icon: <GrSecure />,
        },
        {
          label: "Tickets de soporte",
          key: "/dashboard/management/support-tickets",
          icon: <MdOutlineSupportAgent />,
        },
        {
          label: "Usuarios",
          key: "/dashboard/management/users",
          icon: <FiUsers />,
        },
        {
          label: "Zonas",
          key: "/dashboard/management/zones",
          icon: <MdLocationSearching />,
        },
        {
          label: "Zonas de reportes",
          key: "/dashboard/management/reports-zones",
          icon: <BsPinMap />,
        },
        {
          label: "Grupos",
          key: "/dashboard/management/groups",
          icon: <BsPinMap />,
        },
        // {
        //   label: "Pop-up",
        //   key: "/dashboard/management/pop-up",
        //   icon: <BsPinMap />,
        // },
        
      ]
    },
  ],
};

export default menu;
