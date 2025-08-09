import React, { Component } from "react";
// import { notification , message, Icon } from 'antd';
import { withRouter } from "react-router-dom";
import S3Uploader from "react-s3-uploader";
import ImageField from "../components/ImageField";
import { URL_S3, URL_S3_SERVER } from "../constants";
import styled from "styled-components";

import uuid from 'react-uuid'

const Container = styled.div`
  /* background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%); */
  border: 0;
  border-radius: 8px !important;
  minwidth: 250px !important;
  width:calc(100% - 30px)!importantheight: auto !important;
  overflow: hidden;
  padding: 0px !important;
  margin: 10px !important;

  box-shadow: 0 3px 5px 2px rgba(220, 220, 220, 0.3);
  & .image-bg {
    width: 100%;
    height: 200px !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
  }
`;
class S3Field extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    progress: null,
    image: null,
    onChange: null
  };

  componentWillReceiveProps({ record, source, value, ...props }) {
    this.setState({
      image: value || record[source]
    });
  }
  componentDidMount() {
    let { record, source, match, value } = this.props;

    this.setState({
      image: record[source] || value,
      id: match.params.id || uuid()
    });
  }
  onUploadStart = (file, next) => {
    this.setState({ name_file: file.name });
    next(file);
  };

  onSignedUrl = (...props) => { };

  onUploadProgress = (progress, ...props) => {
    this.setState({ progress });
  };

  onUploadError = error => { };

  onUploadFinish = urls => {
    let { onChange, id } = this.props;
    let image = urls.fileKey;
    this.setState({
      image
    });
    if (onChange) onChange(image, id);
  };

  render() {
    let { file = {}, match, label, source } = this.props;
    const { image, id } = this.state;

    if (file.name) return <div className="s3Button mr-2">{file.name}</div>;
    return (
      <div className="mr-2">
        {label && <label>{label}</label>}
        {<ImageField source={source} value={image} {...this.props} />}
        <label
          htmlFor={this.props.idComponent}
          className="flat-button-file"
          variant="outlined"
          color="primary"
        >
          {file.name ? "Actualizar imagen" : "Subir imagen"}
        </label>
        <label className="s3Button">
          <S3Uploader
            id={this.props.idComponent}
            signingUrl="/s3Client/sign"
            signingUrlMethod="GET"
            accept="*/*"
            s3path={`${this.props.path}/${id}/${this.props.finalPath}/`}
            preprocess={this.onUploadStart}
            onSignedUrl={this.onSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            signingUrlWithCredentials={true} // in case when need to pass authentication credentials via CORS
            uploadRequestHeaders={{ "x-amz-acl": "public-read" }} // this is the default
            contentDisposition="auto"
            scrubFilename={filename => filename.replace(/[^\w\d_\-.]+/gi, "")}
            server={URL_S3_SERVER}
            // inputRef={cmp => this.uploadInput = cmp}
            autoUpload={true}
            className="s3-uploader"
            style={{ visibility: "hidden" }}
          />
        </label>
      </div>
    );
  }
}

export default withRouter(S3Field);
