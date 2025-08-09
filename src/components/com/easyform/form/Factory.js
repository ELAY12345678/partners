import React from 'react';
import { Input } from 'antd';

const Factory = ({ xtype, record, children, source, reference, ...props }) => {

    console.log("xtype: ", xtype)
    switch (xtype) {
        case "textinput":

            break;
        default:
            return <Input {...props} />
            break
    }
}
export default Factory;