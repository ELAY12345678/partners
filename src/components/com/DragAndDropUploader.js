import React, { useState, useEffect } from "react";
import { Upload, message, Icon, Spin, Button, Row, Col } from "antd";
import S3 from "aws-s3";
import {
  URL_S3,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  BUCKET
} from "../../constants";
import _ from "lodash";
import { MyModal } from "./MyModal";

import { AiOutlineInbox } from "react-icons/ai";
import { onUploadFileVersionHurgot } from "../../utils/FileUploader.js";

const defaultFormats = ["image/jpeg", "image/jpg", "image/png"];
const { Dragger } = Upload;

const DragAndDropUploader = ({
  path,
  dragger = true,
  multiple = true,
  autoIncrement = true,
  showUploadList = true,
  showRemoveIcon,
  name,
  formats = defaultFormats,
  maxFiles,
  onChange,
  onDelete,
  onFinish,
  ...props
}) => {


  const [previewVisible, setPreviewVisible] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [currentfile, setCurrentFile] = useState({});
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);


  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const getMax = (arr = []) => {
    return _.maxBy(arr, it => {
      return it.index;
    });
  };

  const getMaxIndex = (arr = []) => {
    if (!autoIncrement) {
      return props.fileList.length;
    }
    if (arr.length === 0) return -1;
    const max = getMax(arr);
    return max.index;
  };

  function onProgress(value) {
    setProgress(value);
  }

  const uploadFile = async (unExtractFiles) => {
    const files = _.map(unExtractFiles, ({originFileObj})=> originFileObj);
    setProgress(0);
    await onUploadFileVersionHurgot(
      files,
      _.merge(
        {},
        props.fileName ? { name: props.fileName } : {},
        props.filePath ? { path: props.filePath } : {},
        props.fileMatch ? { validate: { match: props.fileMatch } } : {},
        props.fileMaxSize
          ? { validate: { maxSize: props.fileMaxSize } }
          : {},
        { onProgress: onProgress }
      )
    ).subscribe({
      next: async (files) => {
        if (onFinish) {
          await onFinish(files);
        }
        setProgress(0);
        setFileList([]);
      },
      error: (error) => {
        setProgress(0);
        message.error(error?.message || 'Upps! intenta nuevamente');
      },
    })
  };

  const beforeUpload = file => {
    return false;
  };

  const handleRemove = file => {
    const tempFileList = _.filter(fileList, ({ uid }) => uid !== file?.uid);
    console.log(tempFileList)
    // setFileList(tempFileList);
  };

  const handleChange = info => {
    const { file, fileList: newFileList, event } = info;
    const tempFileList = [...newFileList];
    const sliceFileList = (maxFiles && tempFileList?.length) > maxFiles ? _.slice(tempFileList, 0, maxFiles) : tempFileList;
    setFileList(sliceFileList || []);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewVisible(true);
    setCurrentFile(file);
    setPreviewImage(file.url || file.preview);
  };

  return (
    <div style={{ width: '100%' }}>
      {dragger ? (
        <Spin spinning={progress !== 0}>
          <Dragger
            fileList={fileList}
            listType="picture-card"
            showRemoveIcon={showRemoveIcon || false}
            showUploadList={showUploadList}
            multiple={multiple}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            onPreview={handlePreview}
            onChange={handleChange}
            loadin
            disabled={progress !== 0}
            style={{ width: '100%' }}
          >
            <div style={{ width: '100%', padding: '0 12rem' }}>
              <p className="ant-upload-drag-icon">
                <AiOutlineInbox />
              </p>
              <p className="ant-upload-text">
                Cargar imagen
              </p>
              <p className="ant-upload-hint">
                Formatos Permitidos:{" "}
                {formats.toString().replace(/(image\/)/g, "")}
              </p>
            </div>
          </Dragger>
        </Spin>
      ) : (
        <Upload
          fileList={fileList}
          showUploadList={false}
          showRemoveIcon={showRemoveIcon || false}
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          Upload
        </Upload>
      )}
      <Row justify="center" style={{ marginTop: '2rem' }} >
        <Col>
          <Button
            disabled={fileList?.length === 0}
            loading={progress !== 0}
            type="primary" style={{ borderRadius: '5px' }}
            onClick={() => uploadFile(fileList)}
          >
            Subir Archivos
          </Button>
        </Col>
      </Row>
      <MyModal
        closable={true}
        width={"calc(75% - 20px)"}
        title={currentfile.name || "Preview"}
        onCancel={() => setPreviewVisible(false)}
        visible={previewVisible}
      >
        <img
          alt="example"
          style={{ width: "100%", margin: "0px 0px 20px 0px" }}
          src={previewImage}
        />
      </MyModal>
    </div>
  );
};

export default DragAndDropUploader;
