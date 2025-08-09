import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
const DateField = ({ value, initialValue, onRender, record, name, ...props }) => {
  const [initial, setInitialValue] = useState();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      /*  if (props.initial) {
         setInitialValue(moment(props.initial));
       }
       if (typeof props["data-__meta"]["initialValue"] !== "undefined") {
         let initialValue = moment(props["data-__meta"]["initialValue"]);
         setInitialValue(initialValue);
         console.log("Date: ", props);
       } */
      setInitialized(true);
    }
    return () => { };
  }, []);
  return initialized && <DatePicker {...props} defaultValue={moment(props.initialValue)} />;
};
export default DateField;
