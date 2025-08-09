import React, { Component } from "react";
// import { notification , message, Icon } from 'antd';
import S3Uploader from "react-s3-uploader";
import ImageField from "../ImageField";
import { URL_S3, URL_S3_SERVER } from "../../../constants";
import styled from "styled-components";
import { Icon, Progress, message } from "antd";
import uuid from "react-uuid";

const Wrapper = styled.label`
  cursor: ${({ disabled }) => (!disabled ? "pointer" : "normal")};

  height: 40px !important;
  max-width: 250px;
  width: auto;

  background: var(--primary);
  display: block;
  text-align: center;
  margin: 0px auto;
  border-radius: 30px;
  padding: 10px;
  color: #fff !important;
  font-size: 16px;

  & .ant-progress-outer {
    margin: 10px 0px 0px 0px;
  }
  & .s3Button {
    display: none !important;
  }
  & label {
    color: #fff !important;
  }
`;

const Container = styled.div`
  /* background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%); */
  /*  padding: 10px 0px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px !important; */
  width: 100%;

  & .s3Button {
    display: none !important;
  }
  & .anticon {
    vertical-align: middle !important;
  }
  & label {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  & .upload-label i{
    margin:0px 4px!important;
  }
`;
class FileUpload extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  state = {
    progress: 0,
    file: {},
    image: null,
    idComponent: uuid(),
    onChange: null
  };

  componentWillReceiveProps({ record, source, value, ...props }) {
    this.setState({
      image: record ? record[source] : null
    });
  }
  componentDidMount() {
    let { record, source, match, value } = this.props;

    this.setState({
      image: record ? record[source] : null,
      id: this.props.id || uuid()
    });
  }
  onUploadStart = (file, next) => {
    let { name, allowTypes, allowAll = false } = this.props;
    allowTypes = allowTypes || ["application/pdf"];
    if (allowTypes.indexOf(file.type) === -1 && !allowAll)
      return message.error("File type is not allowed!");
    console.log("UploadFile:", file.type);
    this.setState({ name_file: name || file.name, file });
    next(file);
  };

  onSignedUrl = (...props) => {};

  onUploadProgress = (progress, ...props) => {
    this.setState({ progress });
  };

  onUploadError = error => {
    message.error(error.message);
  };

  onUploadFinish = doc => {
    let { onChange, id, name } = this.props;
    let image = doc.fileKey;
    let { file } = this.state;
    this.setState({
      image
    });
    if (onChange)
      onChange(
        {
          ...file,
          name: name || file.name,
          path: doc.fileKey
        },
        doc.fileKey,
        id
      );
  };

  render() {
    let { file = {}, match, label, source } = this.props;
    const { progress, id } = this.state;

    if (file.name) return <div className="s3Button mr-2">{file.name}</div>;
    return (
      <Container className="mr-2">
        <div className="content">
          {
            <Wrapper
              htmlFor={this.state.idComponent}
              size="large"
              className="wrapper file-upload"
              variant="outlined"
              type="primary"
              disabled={this.props.disabled}
            >
              {this.props.children ? (
                this.props.children
              ) : (
                <div className="upload-label">
                  <Icon type="upload" />{" "}
                  <span>{this.props.label && this.props.label}</span>
                </div>
              )}
              {progress > 0 && progress < 100 && (
                <Progress percent={progress} />
              )}
            </Wrapper>
          }
        </div>
        <label className="s3Button">
          <S3Uploader
            id={this.state.idComponent}
            signingUrl="/s3Client/sign"
            signingUrlMethod="GET"
            accept="*/*"
            s3path={`${this.props.path}/${id}/${this.props.finalPath}/`}
            preprocess={this.onUploadStart}
            onSignedUrl={this.onSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            disabled={this.props.disabled}
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

export default FileUpload;
