import { from } from "rxjs";
import feathersClient from "./feathers-connection";
import FeathersService from "./feathers-service";

const feathersService = {
  login: (email, password) =>
    from(
      feathersClient.authenticate({
        strategy: "local",
        email: email,
        password: password
      })
    ),
  retryLogin: () =>
    from(
      feathersClient.authenticate({
        strategy: "jwt",
        accessToken: localStorage.getItem("feathers-jwt")
      })
    ),
  logout: () => from(feathersClient.logout()),
  current: () => from(feathersClient.service("current-user").find({})),
  get_project: id => from(feathersClient.service("projects").get({ id })),
  // projects: new FeathersService('deals-projects'),
  users: new FeathersService("users"),
  contacts: new FeathersService("contacts"),
  blogs: new FeathersService("blogs"),
  projects: new FeathersService("projects"),
  phases: new FeathersService("projects-phases"),
  favoriteProjects: new FeathersService("favorite-projects"),
  projectTypes: new FeathersService("projects-types"),
  contactProjects: new FeathersService("contact-projects"),
  projectComparison: new FeathersService("project-comparison"),
  zones: new FeathersService("zones"),
  neighborhoods: new FeathersService("neighborhoods")
  // verifyEmailAccount: new FeathersService('verify-email-account'),
};

export default feathersService;
