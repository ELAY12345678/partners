import React, { Component } from "react";
// import { notification , message, Icon } from 'antd';
import S3Uploader from "react-s3-uploader";
import ImageField from "../ImageField";
import { URL_S3, URL_S3_SERVER,URL_IMAGES } from "../../../constants";
import styled from "styled-components";
import { Icon, Button } from "antd";
import uuid from "react-uuid";
const Logo = require("../../../sources/images/avatar.svg");
const Wrapper = styled.label`
  overflow: hidden;
  height: 100px !important;
  width: 100px;
  display: block;
  border-radius: 50%;
  background-color: #fff !important;
  padding: 20px 30px;
  color: #fff;
  font-size: 34px;
  object-fit: contain;
  /* position: absolute; */
  margin: 0px auto;
  text-align: center;
  /* left: calc(45% - 25px); */
  top: 10px;
  border: 2px solid #e6f7ff;

  background-size: cover !important;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  /* transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1); */

  :hover {
    /*  opacity: 0.5; */
  }

  i {
    z-index: 2000;
    background: #0dacfb;
    padding: 10px;
    border-radius: 50%;

    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    display: none;
    font-size: 24px !important;
    color: #fff !important;
    width: 60px;
    height: 60px;
    position: absolute;
    left: 20px;
    top: 20px;
    padding: 15px;
  }
`;

const Container = styled.div`
  /* background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%); */
  /* padding: 10px 0px !important;
  margin: 10px !important; */
  /* min-height: 140px; */
  /* width: 100%; */
  margin-right: 0.5rem !important;
  /* position: absolute; */
  /*  top: -18px;
  left: -10px; */
  display: block;
  .s3Button {
    display: none;
  }
  & .content:hover i {
    display: block;
  }
  & .wrapper::before {
    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  & .content:hover .wrapper::before {
    content: " ";
    height: 100%;
    width: 100%;
    background: var(--primary);
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    opacity: ${({ disabled }) => (disabled ? 0 : 0.5)};
    padding: 10px !important;
    border: 0px;
  }
`;
class S3Button extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    progress: null,
    image: null,
    idComponent: uuid(),
    onChange: null
  };

  componentWillReceiveProps({ record, source, value, ...props }) {
    this.setState({
      image: value || record ? record[source] : null
    });
  }
  componentDidMount() {
    let { record, source, match, value } = this.props;

    this.setState({
      image: value || record ? record[source] : null,
      id: this.props.id || uuid()
    });
  }
  onUploadStart = (file, next) => {
    this.setState({ name_file: file.name });
    next(file);
  };

  onSignedUrl = (...props) => {};

  onUploadProgress = (progress, ...props) => {
    this.setState({ progress });
  };

  onUploadError = error => {};

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
      <Container disabled={this.props.disabled} className="mr-2">
        <div className="content">
          {
            <Wrapper
              htmlFor={this.state.idComponent}
              className="wrapper"
              variant="outlined"
              disabled={this.props.disabled}
              color="primary"
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover!important",
                background: `url(${
                  this.props.value ? URL_S3 + "/" + this.props.value : Logo
                })`
              }}
            >
              {!this.props.disabled && <Icon size="large" type="edit" />}
            </Wrapper>
          }
        </div>
        <label className="s3Button">
          <S3Uploader
            id={this.state.idComponent}
            signingUrl="/s3Client/sign"
            signingUrlMethod="GET"
            accept="*/*"
            disabled={this.props.disabled}
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
      </Container>
    );
  }
}

export default S3Button;
