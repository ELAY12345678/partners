import React from "react";
import { Upload, Icon, message, Button, Tooltip } from "antd";
import { URL_BASE_API } from "../../constants";
import styled from "styled-components";
const RoundedButton = styled(Button)`
  border-radius: 20px !important;
`;

/* 
 primaryKey: "lic_nbr",
 model: "agentsContacts"
*/
const FileUploader = ({
  primaryKey,
  model,
  ...props
}) => {
  let options = {
    name: props.name || "uri",
    action: props.action || `${URL_BASE_API}/uploads`,
    data: {
      primaryKey,
      model
    },
    headers: {
      authorization: localStorage.getItem("feathers-jwt")
    },
    showUploadList: props.showUploadList || false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        if (props.onSubmit) props.onSubmit(info.file);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  return (
    <>
      <Upload {...options}>
        <Tooltip placement="bottom" title="Import Csv">
          <RoundedButton
            style={
              props.style || {
                background: "#1dbf73",
                border: "1px solid #1dbf73",
                borderRadius: "50%"
              }
            }
            type="primary"
            icon="upload"
          />
        </Tooltip>
      </Upload>
    </>
  );
};

export default FileUploader;
