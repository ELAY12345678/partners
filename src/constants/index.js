export const APPLICATION_ID = process.env.REACT_APP_APPLICATION_ID;
export const API_KEY = process.env.REACT_APP_API_KEY;
export const API_KEY_GOOGLE_MAPS = process.env.REACT_APP_API_KEY_GOOGLE_MAPS;

/* api */
export const URL_BASE_API_PROD = "https://api.apparta.co";
/* api staging*/
export const URL_BASE_API_STG = "https://api-staging.apparta.co";
/* api local*/
export const URL_BASE_API_LOCAL = "http://192.168.88.92:3030";

export const URL_BASE_API = window.location.hostname === "localhost" ? URL_BASE_API_PROD : URL_BASE_API_PROD;
export const URL_BASE = URL_BASE_API;

/* Default Settings */
export const URL_AUTHENTICATION = "/authentication";

export const URL_S3 = "https://appartaapp.s3.amazonaws.com/";
export const S3_PATH_IMAGE_HANDLER = "https://d110hltguvwo1i.cloudfront.net";
export const s3PathImageHandrer = "https://d110hltguvwo1i.cloudfront.net";
export const URL_S3_SERVER = URL_BASE;
export const SIGIN_S3 = URL_S3_SERVER + "/s3Client/sign";

export const BUCKET = process.env.REACT_APP_BUCKET;
export const ACCESS_KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;
export const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
export const EMPTY_SEARCH_TEXT = "-- Limpiar Búsqueda --";

export const permissions = ["admin", "superadmin", "visor"];

export const DEFAULT_USER_AVATAR = "users/1/avatarplaceholder.png";
export const DEFAULT_IMAGE = "apparta-menu/ICONO-APPARTA-MENU.png";
export const URL_DEFAULT_AVATAR = "/images/avatar.svg";
export const LOGO_COLOR = "/images/logo-color.svg";
export const LOGO_WHITE = "/images/logo-white.svg";
export const IMAGE_404 = "/images/404.svg";

export const extensions = ["png", "jpg", "jpeg", "jfif"];
export const colors = [
  "transparent",
  "#0079bf",
  "#d29034",
  "#519839",
  "#b04632",
  "#89609e",
  "#cd5a91",
  "#4bbf6a",
  "#00aecc",
  "#828b91"
];

export const MINUTES_STEPS_FOR_DISCOUNTS = 15;