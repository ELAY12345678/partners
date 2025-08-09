import React from "react";
import moment from "moment";
import packageJson from "../../../package.json";
import preval from "preval.macro";

const buildTimestamp = preval`module.exports = new Date().getTime();`;

class Component extends React.Component {
  getDateString = () => {
    const lastUpdateMoment = moment.unix(buildTimestamp / 1000);
    const formattedDate = lastUpdateMoment.format("DD.MM.YYYY HH:mm:ss");

    return formattedDate;
  };

  render() {
    return (
      <div>
        {packageJson.version}
        {"."}
        {buildTimestamp} {"("}
        {this.getDateString()}
        {")"}
      </div>
    );
  }
}

Component.propTypes = {};

Component.defaultProps = {};

export default Component;
