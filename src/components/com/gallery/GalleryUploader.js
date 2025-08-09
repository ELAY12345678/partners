import React, { useState } from "react";
import {
  message,
  List,
  Avatar,
  InputNumber,
  Card,
  Button,
  Divider,
  Popconfirm,
  Row,
  Col,
  Image,
} from "antd";
import DragAndDropUploader from "../../../components/com/DragAndDropUploader";
import { getService } from "../../../services/";
import { URL_S3, S3_PATH_IMAGE_HANDLER } from "../../../constants/";
import { Wrapper } from "./Styles";
import _ from "lodash";
import { useEffect } from "react";
import Carousel from "./Carousel";
import uuid from "react-uuid";

import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";

const { Meta } = Card;

const serviceGalleryMedia = getService("gallery-media");
const serviceGallery = getService("gallery");

const GalleryUploader = ({
  dataSource,
  onChange,
  onUpload,
  source,
  path = "galleries",
  filterDefaultValues = {},
  refresh,
  withCropper,
  setterVisibleCropper,
  defaultImage,
  actionDelete = true,
  height,
  width,
  ...props
}) => {
  const [media, setMedia] = useState([]);
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState();
  const [reference, setReference] = useState();

  const save = (gallery_id) => {
    if (reference) {
      const servie = getService(reference);
      servie
        .patch(record.id, {
          [source]: gallery_id,
        })
        .then((res) => {
          refresh(null, res);
          message.success("Gallery updated successfully!");
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const Update = async (file) => {
    if (!record["gallery_id"]) {
      let gallery = await serviceGallery.create({});
      if (onChange) onChange(gallery);
      if (gallery) record["gallery_id"] = gallery.id;
      if (gallery && gallery.id) save(gallery.id);
    }
    if (file.key)
      serviceGalleryMedia
        .create({
          gallery_id: record["gallery_id"],
          path: file.key,
          type: file.type,
          priority: file.index,
        })
        .then((response) => {
          getMedia();
          /* setMedia([
                        ...media,
                        response
                    ].filter(it => (it.priority))); */
        })
        .catch((err) => message.error(err.message));
  };

  const handleDelete = (id) => {
    serviceGalleryMedia
      .remove(id)
      .then((response) => {
        getMedia();
        message.info("Media eliminado!");
      })
      .catch((err) => message.error(err.message));
  };

  const update = (file) => {
    let { reference, onChange } = props;
    /* if (onChange) onChange(source, file.key); */
    if (reference && record && source) {
      const service = getService(reference);
      service
        .patch(record.id, {
          [source]: file.key,
        })
        .then((res) => {
          setImage(file.key);
          setShow(true);
          refresh(null, res);
          if (onChange) onChange(source, file);
          if (onUpload) onUpload(source, file);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  const handleOnChange = ({ key, type, ...file }) => {
    delete file.url;
    let files = media;
    file["uid"] = `${files.length}`;
    file["key"] = key;
    file["type"] = type;
    file["url"] = file.location;
    file["path"] = file.location;
    file["status"] = file.status === 204 ? "done" : "error";
    files.push(file);
    if (props.form && source)
      props.form.setFieldsValue({
        [source]: key,
      });
    update(file);
  };

  const handlePriority = (value, record) => {
    setMedia([]);
    if (record.id)
      serviceGalleryMedia
        .patch(record.id, {
          priority: value,
        })
        .then((response) => {
          if (onChange) onChange(response);
          getMedia();
          message.success("Prioridad Actualizada");
        })
        .catch((err) => message.error(err.message));
  };

  const getMedia = async () => {
    if (!source || !record["gallery_id"]) return;
    if (record["gallery_id"]) {
      setLoading(true);
      serviceGalleryMedia
        .find({
          query: {
            gallery_id: record["gallery_id"],
            $limit: 900000,
            $sort: {
              priority: 1,
            },
            ...filterDefaultValues,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          setMedia(data);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err.message);
        });
    }
  };
  var handleOnPriority = _.debounce(handlePriority, 1000, { maxWait: 1000 });

  const renderItems = (record, index) => {
    let url = record.path || record.url;
    if (url && url.indexOf(URL_S3) == -1) url = `${URL_S3}/${url}`;
    return (
      <List.Item>
        <Card
          actions={[
            <Popconfirm
              onConfirm={() => handleDelete(record.id)}
              title="Eliminar Media?"
              okText="Si"
              cancelText="No"
            >
              <Button shape="circle" type="ghost" icon="delete" />
            </Popconfirm>,
          ]}
          cover={<img src={url} />}
        >
          <Meta
            description={
              <>
                <span>Prioridad</span>
                <InputNumber
                  min={0}
                  defaultValue={record.priority}
                  name="priority"
                  onChange={(value) => handleOnPriority(value, record)}
                />
              </>
            }
          />
        </Card>
      </List.Item>
    );
  };

  useEffect(() => {
    if (props.reference) {
      setReference(props.reference);
    }
  }, [props.reference]);

  useEffect(() => {
    if (props.record) {
      setRecord(props.record);
      if (source && props.record) {
        setShow(
          (typeof props.record.image_gallery?.path !== "undefined" &&
            props.record[source] != null) ||
            props.record.path_image_main !== null
        );
        setImage(
          props.record[source]
            ? props.record[source]
            : props.record.image_gallery?.path ||
                props.record.path_image_main ||
                props.record[source]
        );
      }
    }
  }, [props]);

  if (!record) return <>Record not found</>;

  return (
    <Wrapper>
      <Row justify={'center'}>
        {media && show && (
          <Col span={24}>
            <div className="image-container">
              <Image
                fallback="data:image/png;base64,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"
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                  url: `${defaultImage || image}`,
                  width: width || 1000,
                  height: height || 600,
                })}
                `}
                width={width || "100%"}
                height={height || "250px"}
                alt="imagen"
                preview={{
                  src: `${URL_S3}${defaultImage || image}`,
                }}
              />
              <div className="image-actions">
                {/*
                {withCropper && (
                  <Button
                    onClick={() => {
                      setterVisibleCropper(true);
                    }}
                    size="small"
                    shape="circle"
                    type="primary"
                    icon={<AiOutlineEdit />}
                  />
                )}
                */}
                {actionDelete && (
                  <Button
                    onClick={async () => {
                      const service = getService(reference);
                      if (props.form && source)
                        props.form.setFieldsValue({
                          [source]: null,
                        });
                      try {
                        if (props._id) {
                          const response = await service.patch(
                            props._id,
                            { [source]: null },
                            {}
                          );
                          if (refresh) refresh(null, response);
                          message.success("Imagen eliminada exitosamente");
                        }
                        refresh(null, null);
                      } catch (e) {
                        message.error("Error al eliminar la imagen");
                      }
                      setShow(false);
                    }}
                    size="small"
                    shape="circle"
                    type="primary"
                    icon={<AiOutlineClose />}
                  />
                )}
              </div>
            </div>
          </Col>
        )}
        {!show && (
          <Col>
            <DragAndDropUploader
              dataSource={media}
              record={record}
              onChange={handleOnChange}
              /*onDelete={handleOnDelete} */
              path={path}
            />
          </Col>
        )}
      </Row>
    </Wrapper>
  );
};
export default GalleryUploader;
