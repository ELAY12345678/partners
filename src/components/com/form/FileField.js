import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import S3Uploader from "react-s3-uploader";
import { Progress } from "antd";
import styled from "styled-components";

const WrapperImage = styled.div`
  margin: 0px auto;
  padding: 4px;
  max-width: 200px;
  position: relative;
  display: block;
  & img {
    object-fit: contain;
    max-width: 100%;
    object-position: center;
  }
`;
const FileWrapper = styled.div`
  & .flat-button-file {
    max-width: 100% !important;
  }
`;
class FileField extends Component {
  state = {
    progress: null,
    reference: null,
    file: {},
    image: null,
  };
  getInitialValue = () => {
    let { name, choices, source, record, reference } = this.props;
    if (name && choices) {
      if (choices.length && record) {
        let option = reference
          ? choices.find((item) => item.id == record[source])
          : choices[0];
        if (option)
          this.setState({
            image: option[name || "path"],
          });
      }
    }
  };
  componentDidMount() {
    this.getInitialValue();
  }
  componentDidUpdate() {
    let { record, source, reference } = this.props;
  }
  componentWillReceiveProps(nextprops) {
    let { source, record, reference } = nextprops;
    if (!reference) {
      if (nextprops.image)
        this.setState({
          image: nextprops.image,
        });
      if (record && nextprops.source)
        this.setState({
          image: record[nextprops.source]
            ? record[nextprops.source][nextprops.name || "path"]
            : null,
        });
      if (record && record[source] && !nextprops.name)
        this.setState({
          image: record[source],
        });
    }
  }
  onUploadStart = (file, next) => {
    this.setState({
      name_file: file.name,
      file,
    });
    next(file);
  };

  onSignedUrl = (...props) => {};

  onUploadProgress = (progress, ...props) => {
    this.setState({ progress });
  };

  onUploadError = (error) => {};

  onUploadFinish = (files) => {
    let { file } = this.state;
    const {
      match: { params },
    } = this.props;
    this.setState({
      image: files.fileKey,
    });
    if (this.props.onFinish)
      this.props.onFinish(files.fileKey, file, params.id || this.props.id);
  };

  render() {
    const {
      file = {},
      match,
      path,
      finalPath,
      data = {},
      idKey = "id",
    } = this.props;
    const { progress, image } = this.state;
    let pathNew = null;
    if (match) {
      const id = match.params.id || data[idKey] || this.props.id;
      if (this.props.finalPath) {
        pathNew = `${path}/${id}/${finalPath}`;
      } else {
        pathNew = `${path}/${id}`;
      }
    }

    if (file.name) return <div className="s3Button mr-2">{file.name}</div>;

    /* if (this.props.reference)
      return <>
        {JSON.stringify(this.props)}
      </> */
    return (
      <FileWrapper className="mr-2">
        {image ? (
          <WrapperImage>
            <img
              src={`${'https://appartaapp.s3.amazonaws.com/'}${image}`}
              className="custom-img-field"
              alt="main-image"
            />
          </WrapperImage>
        ) : null}
        {progress > 0 && progress < 100 && (
          <Progress percent={progress} status="active" />
        )}
        <label
          htmlFor={this.props.idComponent}
          className="flat-button-file"
          variant="outlined"
          color="primary"
        >
          {this.props.label ? this.props.label : "Subir Imágen "}
        </label>
        <label className="s3Button">
          <S3Uploader
            id={this.props.idComponent}
            signingUrl="/s3Client/sign"
            signingUrlMethod="GET"
            accept="*/*"
            s3path={pathNew}
            preprocess={this.onUploadStart}
            onSignedUrl={this.onSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            signingUrlWithCredentials={true} // in case when need to pass authentication credentials via CORS
            uploadRequestHeaders={{ "x-amz-acl": "public-read" }} // this is the default
            contentDisposition="auto"
            scrubFilename={(filename) =>
              `${Math.floor(Date.now() / 1000)}${filename.replace(
                /[^\w\d_\-.]+/gi,
                ""
              )}`
            }
            server="https://api.apparta.co"
            // inputRef={cmp => this.uploadInput = cmp}
            autoUpload={true}
            className="s3-uploader"
            style={{ visibility: "hidden" }}
          />
        </label>
      </FileWrapper>
    );
  }
}

export default FileField;
