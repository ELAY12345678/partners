import React from "react";

const Orders = React.lazy(() => import("./views/orders/Orders"));
const MenuCategories = React.lazy(() => import("./views/menu-categories/MenuCategories"));
const ReservationsHistory = React.lazy(() => import("./views/reservationsHistory"));
const EstablishmentRatings = React.lazy(() => import("./views/establishmentRatings"));
const DiscountSpecifics = React.lazy(() => import("./views/discounts/specific"));
const DiscountTemplates = React.lazy(() => import("./views/discounts/templates"));
const DiscountDeals = React.lazy(() => import("./views/discounts/deals"));
const Billing = React.lazy(() => import("./views/billing"));
const InvoicesDetails = React.lazy(() => import("./views/billing/view/old-invoices/invoiceDetails"));
const Transfer = React.lazy(() => import("./views/Transfer"));
const AppartaPayHistory = React.lazy(()=> import("./views/payAccountHistory"));

const Users = React.lazy(() => import("./views/users/Users"));
const UserForm = React.lazy(() => import("./components/users/UserForm"));
const Configurations = React.lazy(() => import("./views/configurations/Configurations"));
const ConfigurationsForm = React.lazy(() => import("./views/configurations/ConfigurationsForm"));

const EstablishmentsPosition = React.lazy(() => import("./views/establishments-position"));
const Banners = React.lazy(() => import("./views/banners"));
const Groups = React.lazy(() => import("./views/groups"));
const Campaigns = React.lazy(() => import("./views/campaigns"));
const AppartaPayCoupons = React.lazy(() => import("./views/appartaPayCoupons"));
const Zones = React.lazy(() => import("./views/zones"));
const ReportZones = React.lazy(() => import("./views/reports-zones"));
const Cms = React.lazy(() => import("./views/cms"));
const Establishments = React.lazy(() => import("./views/establishments"));
const EstablishmentDetails = React.lazy(() => import("./views/establishments/EstablishmentDetails"));
const Places = React.lazy(() => import("./views/places"));
const Categories = React.lazy(() => import("./views/categories"));
const Reservations = React.lazy(() => import("./views/reservations"));
const Coupons = React.lazy(() => import("./views/coupons"));
const ReservationsOnDemand = React.lazy(() => import("./views/reservationsOnDemand"));
const PayAccounts = React.lazy(() => import("./views/payAccounts"));
const PaymentsDetails = React.lazy(() => import("./views/payAccounts/paymentsDetails"));
const GlobalTemplate = React.lazy(() => import("./views/globalTemplates"));
const TemplateDetails = React.lazy(() => import("./views/globalTemplates/TemplateDetails"));
const Fidelizations = React.lazy(() => import("./views/fidelizations"));
const UserRating = React.lazy(() => import("./views/users-ratings"));
const MenuBanners = React.lazy(() => import("./views/menu-banners"));
const MenuGroupProfile = React.lazy(() => import("./views/menu-banners/GroupProfileDetails"));

const PayBenefitDetails = React.lazy(() => import("./views/payAccounts/payBenefitDetails"))

const Tickets = React.lazy(() => import("./views/tickets"));
const TicketsForm = React.lazy(() => import("./views/tickets/TicketsForm"));

const OnBoarding = React.lazy(() => import("./views/OnBoarding"));
const OnBoardingScreens = React.lazy(() => import("./views/OnBoarding/OnBoardingScreens"));

const Security = React.lazy(() => import("./views/security"));

const AdminInvoices = React.lazy(() => import("./views/adminInvoices"));

const Blogs = React.lazy(() => import("./views/blogs/Blogs"));
const BlogsForm = React.lazy(() => import("./views/blogs/BlogsForm"));
const PopUp = React.lazy(() => import("./views/pop-up"));
const EstablishmentsPositionTmp =React.lazy(() => import("./views/establishments-position-tmp"));

const routes = [
  {
    path: "/dashboard/management/users",
    name: "users",
    permissions: ["admin"],
    component: Users,
    edit: {
      path: "/dashboard/management/users/:id",
      name: "users",
      component: UserForm,
    },
    create: {
      path: "/dashboard/management/users/create",
      name: "users",
      component: UserForm,
    },
  },
  {
    path: "/dashboard/management/configurations",
    name: "Configurations",
    permissions: ["admin"],
    component: Configurations,
    edit: {
      path: "/dashboard/management/configurations/:id",
      name: "configurations",
      component: ConfigurationsForm,
    },
    create: {
      path: "/dashboard/management/configurations/create",
      name: "configurations",
      component: ConfigurationsForm,
    },
  },
  {
    path: "/dashboard/management/blogs",
    name: "blogs",
    permissions: ["admin"],
    component: Blogs,
    edit: {
      path: "/dashboard/management/blogs/:id",
      name: "blogs",
      component: BlogsForm,
    },
    create: {
      path: "/dashboard/management/blogs/create",
      name: "blogs",
      component: BlogsForm,
    },
  },
  {
    path: "/dashboard/management/support-tickets",
    name: "support-tickets",
    permissions: ["admin"],
    component: Tickets,
    create: {
      path: "/dashboard/management/support-tickets/create",
      name: "tickets",
      component: TicketsForm,
    },
  },
  {
    path: "/dashboard/management/pay-accounts",
    name: "pay-accounts",
    permissions: ["admin"],
    component: PayAccounts,
  },
  {
    path: "/dashboard/management/pay-accounts/details",
    name: "payments-details",
    permissions: ["admin"],
    component: PaymentsDetails,
  },
  {
    path: "/dashboard/management/pay-accounts/benefit",
    name: "pay-benefit",
    permissions: ["admin"],
    component: PayBenefitDetails,
  },
  {
    path: "/dashboard/management/reservations-on-demand",
    name: "reservations-on-demand",
    permissions: ["admin"],
    component: ReservationsOnDemand,
  },
  {
    path: "/dashboard/management/banners",
    name: "banners",
    permissions: ["admin"],
    component: Banners,
  },
  {
    path: "/dashboard/management/menu-banners",
    name: "menu-banners",
    permissions: ["admin"],
    component: MenuBanners,
  },
  {
    path: "/dashboard/management/menu-banners/profile-group-details",
    name: "menu-groups-profile",
    permissions: ["admin"],
    component: MenuGroupProfile,
  },
  {
    path: "/dashboard/management/campaigns",
    name: "campaigns",
    permissions: ["admin"],
    component: Campaigns,
  },
  {
    path: "/dashboard/management/establishments-position",
    name: "establishments-position",
    permissions: ["admin"],
    component: EstablishmentsPosition,
  },
  {
    path: "/dashboard/management/establishments-position-tmp",
    name: "establishments-position-tmp",
    permissions: ["admin"],
    component: EstablishmentsPositionTmp,
  },
  
  {
    path: "/dashboard/management/appartapay-coupons",
    name: "appartapay-coupons",
    permissions: ["admin"],
    component: AppartaPayCoupons,
  },
  {
    path: "/dashboard/management/zones",
    name: "zones",
    permissions: ["admin"],
    component: Zones,
  },
  {
    path: "/dashboard/management/reports-zones",
    name: "reports-zones",
    permissions: ["admin"],
    component: ReportZones,
  },
  {
    path: "/dashboard/management/cms",
    name: "cms",
    permissions: ["admin"],
    component: Cms,
  },
  {
    path: "/dashboard/management/security",
    name: "security",
    permissions: ["admin"],
    component: Security,
  },
  {
    path: "/dashboard/management/places",
    name: "places",
    permissions: ["admin"],
    component: Places,
  },
  {
    path: "/dashboard/management/on-boarding",
    name: "OnBoarding",
    permissions: ["admin"],
    component: OnBoarding,
  },
  {
    path: "/dashboard/management/on-boarding/screens",
    name: "OnBoardingScreens",
    permissions: ["admin"],
    component: OnBoardingScreens,
  },
  {
    path: "/dashboard/management/categories",
    name: "categories",
    permissions: ["admin"],
    component: Categories,
  },
  {
    path: "/dashboard/management/global-templates",
    name: "global-templates",
    permissions: ["admin"],
    component: GlobalTemplate,
  },
  {
    path: "/dashboard/management/global-templates/details",
    name: "global-templates-details",
    permissions: ["admin"],
    component: TemplateDetails,
  },
  {
    path: "/dashboard/management/establishments",
    name: "establishments",
    permissions: ["admin"],
    component: Establishments,
  },
  {
    path: "/dashboard/management/establishments/:establishmentId",
    name: "establishments",
    permissions: ["admin"],
    component: EstablishmentDetails,
  },
  {
    path: "/dashboard/management/reservations",
    name: "reservations",
    permissions: ["admin"],
    component: Reservations,
  },
  {
    path: "/dashboard/management/coupons",
    name: "coupons",
    permissions: ["admin"],
    component: Coupons,
  },
  {
    path: "/dashboard/management/invoices",
    name: "invoices",
    permissions: ["admin"],
    component: AdminInvoices,
  },
  {
    path: "/dashboard/management/fidelizations",
    name: "fidelizations",
    permissions: ["admin"],
    component: Fidelizations,
  },
  {
    path: "/dashboard/management/users-ratings",
    name: "users-ratings",
    permissions: ["admin"],
    component: UserRating,
  },
  {
    path: "/",
    name: "orders",
    permissions: ["admin", "user"],
    component: Orders,
  },
  {
    path: "/dashboard/establishment/menu",
    name: "menu-categories",
    permissions: ["admin", "user"],
    component: MenuCategories,
  },
  {
    path: "/dashboard/reservations/history",
    name: "reservations-history",
    permissions: ["admin", "user"],
    component: ReservationsHistory,
  },
  {
    path: "/dashboard/establishment/ratings",
    name: "reservations-history",
    permissions: ["admin", "user"],
    component: EstablishmentRatings,
  },
  {
    path: "/dashboard/establishment/discounts/specific",
    name: "discounts-specific",
    permissions: ["admin", "user"],
    component: DiscountSpecifics,
  },
  {
    path: "/dashboard/establishment/discounts/templates",
    name: "discounts-templates",
    permissions: ["admin", "user"],
    component: DiscountTemplates,
  },
  {
    path: "/dashboard/establishment/discounts/deals",
    name: "discounts-templates",
    permissions: ["admin", "user"],
    component: DiscountDeals,
  },
  {
    path: "/dashboard/establishment/billing",
    name: "billing",
    permissions: ["admin", "user"],
    component: Billing,
  },
  {
    path: "/dashboard/establishment/billing/invoice/detail/:id",
    name: "invoices-details",
    permissions: ["admin", "user"],
    component: InvoicesDetails,
  },
  {
    path: "/dashboard/establishment/transfer",
    name: "transfer",
    permissions: ["admin", "user"],
    component: Transfer,
  },
  {
    path: "/dashboard/establishment/apparta-pay-history",
    name: "appartaPayHistory",
    permissions: ["admin", "user"],
    component: AppartaPayHistory,
  },
  {
    path: "/dashboard/management/groups",
    name: "banners",
    permissions: ["admin"],
    component: Groups,
  },
  {
    path: "/dashboard/management/pop-up",
    name: "pop-up",
    permissions: ["admin"],
    component: PopUp,
  },
];
export default routes;
