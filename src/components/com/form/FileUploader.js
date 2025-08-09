import React, { Component } from "react";
// import { notification , message, Icon } from 'antd';
import S3Uploader from "react-s3-uploader";
import ImageField from "../ImageField";
import { URL_S3, URL_S3_SERVER } from "../../../constants";
import styled from "styled-components";
import { Icon, Progress, message, Avatar } from "antd";
import uuid from "react-uuid";
import { getService } from "../../../services";
import _ from "lodash";

const Wrapper = styled.label`
  cursor: ${({ disabled }) => (!disabled ? "pointer" : "normal")};

  /* height: 40px !important; */
  max-width: 250px;
  min-height: 32px;
  width: auto;

  background: var(--primary);
  display: block;
  text-align: center;
  margin: 0px auto;
  border-radius: 30px;
  padding: 5px 10px;
  color: #fff !important;
  font-size: 14px;

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
  & .upload-label i {
    margin: 0px 4px !important;
  }
`;
class FileUploader extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  state = {
    progress: 0,
    file: {},
    record: null,
    image: null,
    idComponent: uuid(),
    onChange: null,
  };

  componentWillReceiveProps({ record, source, value, ...props }) {
    if (!this.state.image && record && record[source]?.path)
      this.setState({
        record,
        image: record[source].path,
      });
  }
  componentDidMount() {
    let { record, source, match, value } = this.props;

    this.setState({
      image: record ? record[source] : null,
      id: this.props.id || uuid(),
    });
    // alert("hello")
  }
  onUploadStart = (file, next) => {
    const blob = file.slice(0, file.size, file.type);
    const newFile = new File(
      [blob],
      `${new Date().valueOf()}.${_.last(_.split(file.name, "."))}`,
      { type: file.type }
    );

    let { name, allowTypes, allowAll = false } = this.props;
    allowTypes = allowTypes || [
      "image/jpg",
      "image/png",
      "image/jpeg",
      "image/svg",
    ];
    if (allowTypes.indexOf(newFile.type) === -1 && !allowAll) {
      message.error("File type is not allowed!");
      return;
    }
    this.setState({ name_file: name || newFile.name, file: newFile });
    next(newFile);
  };

  onSignedUrl = (...props) => {};

  onUploadProgress = (progress, ...props) => {
    this.setState({ progress });
  };

  onUploadError = (error) => {
    message.error("No se pudo cargar el archivo! ", error.message);
  };

  update = (id, file) => {
    let { reference, record, source, onChange } = this.props;
    if (reference && record) {
      const service = getService(reference);
      service
        .patch(record.id, {
          [source]: file,
        })
        .then((res) => {
          if (onChange) onChange(source, file);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  onUploadFinish = async (doc) => {
    let { onChange, id, name, reference, onFinish } = this.props;
    let image = doc.fileKey;
    let { file } = this.state;
    this.setState({
      image,
    });
    if (reference) {
      message.success("Foto subida con éxito!");
      this.update(id, doc.fileKey);
    }
    if (onChange)
      onChange(
        {
          ...file,
          name: name || file.name,
          path: doc.fileKey,
        },
        doc.fileKey,
        id
      );
    if (onFinish) onFinish(image, file);
  };

  render() {
    let { file = {}, match, label, source, preview = true } = this.props;
    const { progress, id, record, image } = this.state;
    if (file.name) return <div className="s3Button mr-2">{file.name}</div>;
    return (
      <Container className="mr-2">
        {image && preview && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              shape="circle"
              size={200}
              src={`${URL_S3}${image}`}
              alt="main-image"
            />
          </div>
        )}
        <div className="content">
          {
            <Wrapper
              htmlFor={this.state.idComponent}
              size="large"
              className="wrapper file-upload"
              variant="outlined"
              type="primary"
              disabled={this.props.disabled}
              style={{ borderRadius: "0.5rem" }}
            >
              {progress > 0 && progress < 100 ? (
                <Progress percent={progress} />
              ) : (
                <>
                  {this.props.children ? (
                    this.props.children
                  ) : (
                    <div className="upload-label">
                      {/* <Icon type="upload" />{" "} */}
                      <span>
                        {(this.props.title && this.props.title) ||
                          "Subir Imagen"}
                      </span>
                    </div>
                  )}
                </>
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
            s3path={this.props.path}
            preprocess={this.onUploadStart}
            onSignedUrl={this.onSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            disabled={this.props.disabled}
            signingUrlWithCredentials={true} // in case when need to pass authentication credentials via CORS
            uploadRequestHeaders={{ "x-amz-acl": "public-read" }} // this is the default
            contentDisposition="auto"
            scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/gi, "")}
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

export default FileUploader;
