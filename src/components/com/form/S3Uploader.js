import React, { useState, useEffect } from "react";
import ReactS3Uploader from "react-s3-uploader";
import Uploader from "react-s3-uploader/s3upload";
import styled from "styled-components";
import { Upload, Button, Icon, Avatar, Card } from "antd";
import "./fileupload.css";

const { Meta } = Card;

const Label = styled.div`
  letter-spacing: 0;
  /* color: #000000;
  text-transform: uppercase;
  opacity: 1; */
  color: #000000;
  text-transform: uppercase;
  opacity: 0.3;
  font-size: 0.8125rem;
  /* margin-bottom: 10px; */
  /* padding: 0 8px; */
`;

const Wrapper = styled.div`
  flex-grow: 1;
`;
const CustomLabel = props => (
  <label
    {...props}
    className="label-s3uploader"
    htmlFor={props.idComponent}
    className="flat-button-file"
    variant="outlined"
    color="primary"
  >
    {props.children}
  </label>
);
const CustomLabelStyled = styled(CustomLabel)`
  letter-spacing: 0;
  /* color: #000000;
  text-transform: uppercase;
  opacity: 1; */
  color: #000000;
  text-transform: uppercase;
  opacity: 0.3;
  font-size: 0.8125rem;
  margin-bottom: 10px;
  padding: 0 8px;
`;
const serverS3 = "https://micamacol.s3.amazonaws.com/";
const S3Uploder = props => {
  let [signedUrl, setSignedUrl] = useState(null);
  let { headers, loader = true } = props;
  let [uploading, setUploading] = useState(false);
  let [image_path, setPreview] = useState(props.initialValue);
  let [filename, setFileName] = useState(null);
  const uploader = new Uploader({
    signingUrl: "/s3Client/sign",
    signingUrlMethod: "GET",
    accept: "image/*",
    s3path: props.path,
    signingUrlWithCredentials: true,
    contentDisposition: "auto",
    uploadRequestHeaders: {
      "x-amz-acl": "public-read"
    },
    onProgress: progress => {
      console.log("Progress: ", progress);
    },
    onFinishS3Put: function(signResult, file) {
      let { filename, name } = signResult;
      setPreview(filename);

      setUploading(false);
      if (props.onChange) {
        props.onChange(filename);
      }
    },
    /* scrubFilename: filename => filename.replace(/[^\w\d_\-.]+/gi, ''), */
    server: "https://api.camacolatlantico.org"
  });
  const handleCahnge = info => {
    let { server, signingUrl } = uploader;
    fetch(`${server}${signingUrl}`)
      .then(response => {
        return response.json();
      })
      .then(function(data) {
        let { signedUrl, filename } = data;
        console.log(data);
        setSignedUrl(signedUrl);
      });
  };
  const uploadToS3 = data => {
    let { file } = data;
    let filename = file.name;
    console.log("----> FileName: ", file, filename);
    try {
      setFileName(filename);
      setUploading(true);
      uploader.uploadFile(file);
    } catch (err) {
      console.log("ERROR: ", err);
      setUploading(false);
    }
    return console.log("file:", file);
  };
  return (
    <div className="card-container">
      {!loader ? (
        <>
          <CustomLabelStyled idComponent={props.idComponent}>
            {props.children}
          </CustomLabelStyled>
          {
            <label className="s3Button">
              <ReactS3Uploader
                id={props.idComponent}
                signingUrl="/s3Client/sign"
                signingUrlMethod="GET"
                accept="image/*"
                s3path={props.path}
                /*
            preprocess={onUploadStart}
            onSignedUrl={onSignedUrl}
            onProgress={onUploadProgress}
            onError={onUploadError}
            onFinish={onUploadFinish} */
                signingUrlWithCredentials={true} // in case when need to pass authentication credentials via CORS
                uploadRequestHeaders={{
                  "x-amz-acl": "public-read"
                }} // this is the default
                contentDisposition="auto"
                scrubFilename={filename =>
                  filename.replace(/[^\w\d_\-.]+/gi, "")
                }
                server="https://api.camacolatlantico.org"
                autoUpload={true}
                style={{ visibility: "hidden" }}
              />
            </label>
          }
        </>
      ) : (
        <Card
          className={
            props.className ? "card-type " + props.className : "card-type"
          }
          style={{ width: "100%" }}
          cover={
            image_path ? (
              <>
                <div className="cover-type">
                  <div
                    style={{
                      backgroundImage: `url(${serverS3}${image_path})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </div>
                {filename && <span className="file_name">{filename}</span>}
              </>
            ) : (
              <Avatar className="avatar-icon" size={150} icon="build" />
            )
          }
        >
          <Upload
            showUploadList={false}
            onChange={handleCahnge}
            customRequest={uploadToS3}
          >
            <>
              <Button
                size={props.size || "large"}
                className="btn-file-upload"
                loading={uploading}
              >
                {!uploading && <Icon type="upload" />}{" "}
                {!uploading
                  ? filename || image_path
                    ? "Actualizar Foto"
                    : "Subir Foto"
                  : "Cargando..."}
              </Button>
            </>
          </Upload>
        </Card>
      )}
    </div>
  );
};

const Field = ({ name, label, hasFormik = false, ...props }) => {
  let [initialized, setInitialValues] = useState(false);
  return (
    <Wrapper>
      <div mb={1}>
        <S3Uploder {...props} />
      </div>
    </Wrapper>
  );
};
export default Field;
