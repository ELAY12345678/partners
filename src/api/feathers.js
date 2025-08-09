import feathers from "@feathersjs/client";
import { URL_BASE_API, URL_AUTHENTICATION } from "../constants";

const app = feathers();
app.configure(feathers.rest(URL_BASE_API).fetch(window.fetch.bind(window)));
app.configure(
  feathers.authentication({
    path: URL_AUTHENTICATION,
    entity: "user",
    service: "users",
    cookie: "feathers-jwt",
    storageKey: "feathers-jwt",
    storage: window.localStorage
  })
);

export const galleryService = app.service("gallery");
export const getService = (service) => app.service(service);

export default app;
