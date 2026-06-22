import {
    Button,
    Col,
    Drawer,
    Form,
    Image,
    Input,
    message,
    Row,
    Select,
    Tag,
} from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
    AiOutlineClose,
    AiOutlineDelete,
    AiOutlineEdit,
    AiOutlinePlus,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import AsyncButton from "../../components/asyncButton";
import { Grid } from "../../components/com";
import DragAndDropUploader from "../../components/com/DragAndDropUploader";
import { SimpleForm } from "../../components/com/form/SimpleForm";
import { RoundedButton } from "../../components/com/grid/Styles";
import RichTextField from "../../components/richTextField";
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from "../../constants";
import { getService } from "../../services";
import { onUploadFileVersionHurgot } from "../../utils/FileUploader";

const MEDIA_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MEDIA_FILE_MATCH = "\\.(jpe?g|png|gif)$";

const getFilePath = (file) => file?.fileKey || file?.filename || file?.key;

const uploadFiles = (files, establishment_id) =>
  new Promise((resolve, reject) => {
    const originFiles = _.map(
      files,
      ({ originFileObj }) => originFileObj,
    ).filter(Boolean);
    if (!originFiles.length) {
      resolve([]);
      return;
    }
    onUploadFileVersionHurgot(originFiles, {
      path: `pop-ups/product/${establishment_id}/`,
      validate: { match: MEDIA_FILE_MATCH },
    }).subscribe({
      next: (uploaded) => {
        const list = Array.isArray(uploaded) ? uploaded : [uploaded];
        resolve(_.map(list, getFilePath).filter(Boolean));
      },
      error: reject,
    });
  });

const parseMediaList = (value) => {
  if (!value) return [];
  let list = value;
  if (typeof value === "string") {
    try {
      list = JSON.parse(value);
    } catch {
      return value.trim() ? [value] : [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.path || item?.url || item?.fileKey || "",
    )
    .filter(Boolean);
};

const stringifyMediaList = (list) => JSON.stringify(parseMediaList(list));

const DISPLAY_DEVICES = [
  { id: "web", name: "Web" },
  { id: "mobile", name: "Mobile" },
  { id: "all", name: "Todos" },
];

const DISPLAY_LIMITS = [
  { id: 1, name: "1 vez" },
  { id: 2, name: "2 veces" },
  { id: 3, name: "3 veces" },
  { id: 4, name: "4 veces" },
];

const columns = ({ onRemove, onEdit }) => [
  {
    title: "Nombre",
    dataIndex: "name",
    sorter: true,
    width: 200,
  },
  {
    title: "Subtítulo",
    dataIndex: "sub_title",
    sorter: true,
    width: 200,
  },
  {
    title: "Dispositivo",
    dataIndex: "display_device",
    sorter: true,
    width: 120,
    render: (value) =>
      _.find(DISPLAY_DEVICES, ({ id }) => id === value)?.name || value,
  },
  {
    title: "Límite",
    dataIndex: "display_limit",
    sorter: true,
    width: 100,
    render: (value) =>
      _.find(DISPLAY_LIMITS, ({ id }) => id === value)?.name || value,
  },
  {
    title: "Imágenes",
    dataIndex: "media_list",
    width: 100,
    render: (value) => {
      const count = parseMediaList(value).length;
      return count ? (
        <Tag color="blue">{count} imagen(es)</Tag>
      ) : (
        <Tag>Sin imágenes</Tag>
      );
    },
  },
  {
    title: "Acciones",
    dataIndex: "id",
    width: 150,
    render: (id, record) => (
      <Row>
        <Button
          type="text"
          onClick={() => onEdit(record)}
          icon={<AiOutlineEdit />}
        />
        <AsyncButton
          type="link"
          onClick={() => onRemove({ id })}
          icon={<AiOutlineDelete />}
          confirmText="Desea eliminar?"
        />
      </Row>
    ),
  },
];

const PopUpProduct = () => {
  const establishment_id = useSelector(
    ({ dashboardReducer }) =>
      dashboardReducer.establishmentFilters?.establishment_id,
  );
  const popupsService = getService("pop-ups");
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPopUp, setSelectedPopUp] = useState();
  const [updateSource, setUpdateSource] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [pendingFileList, setPendingFileList] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const onRemove = async ({ id }) => {
    await popupsService
      .remove(id)
      .then(() => {
        message.success("Pop-up eliminado!");
        setUpdateSource(!updateSource);
      })
      .catch((error) =>
        message.error("No se pudo eliminar el pop-up! " + error?.message),
      );
  };

  const onEdit = (record) => {
    const parsedMedia = parseMediaList(record?.media_list);
    setSelectedPopUp({
      ...record,
      display_limit:
        record?.display_limit != null
          ? Number(record.display_limit)
          : record?.display_limit,
    });
    setMediaList(parsedMedia);
    setPendingFileList([]);
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (!drawerVisible) return;

    if (selectedPopUp?.id) {
      form.setFieldsValue({
        ..._.mapValues(selectedPopUp, (value) =>
          value !== null ? value : undefined,
        ),
        media_list: stringifyMediaList(mediaList),
        display_limit:
          selectedPopUp.display_limit != null
            ? Number(selectedPopUp.display_limit)
            : selectedPopUp.display_limit,
      });
    } else {
      form.setFieldsValue({ media_list: stringifyMediaList(mediaList) });
    }
  }, [drawerVisible, selectedPopUp?.id]);

  useEffect(() => {
    if (drawerVisible) {
      form.setFieldsValue({ media_list: stringifyMediaList(mediaList) });
    }
  }, [mediaList, drawerVisible]);

  const handleMediaUpload = async (files) => {
    const paths = _.map(files, getFilePath).filter(Boolean);
    if (!paths.length) return;
    const nextMediaList = [...mediaList, ...paths];
    setMediaList(nextMediaList);
    form.setFieldsValue({ media_list: stringifyMediaList(nextMediaList) });
    setPendingFileList([]);
    message.success("Imágenes cargadas");
  };

  const handleRemoveMedia = (path) => {
    const nextMediaList = mediaList.filter((item) => item !== path);
    setMediaList(nextMediaList);
    form.setFieldsValue({ media_list: stringifyMediaList(nextMediaList) });
  };

  const handleSubmit = async (err, values) => {
    if (err) return message.error(err);

    let finalMediaList = [...mediaList];

    if (pendingFileList.length) {
      try {
        setUploadingMedia(true);
        const uploadedPaths = await uploadFiles(
          pendingFileList,
          establishment_id,
        );
        finalMediaList = [...finalMediaList, ...uploadedPaths];
        setPendingFileList([]);
      } catch (error) {
        message.error(error?.message || "Error al subir las imágenes");
        setUploadingMedia(false);
        return;
      }
      setUploadingMedia(false);
    }

    if (!finalMediaList.length) {
      return message.error("Debes agregar al menos una imagen en media_list");
    }

    const data = {
      name: values?.name,
      sub_title: values?.sub_title,
      description: values?.description,
      display_device: values?.display_device,
      display_limit: values?.display_limit,
      media_list: stringifyMediaList(finalMediaList),
      type: "product",
      establishment_id,
    };

    try {
      if (selectedPopUp?.id) {
        await popupsService.patch(selectedPopUp.id, data);
        message.success("Pop-up actualizado exitosamente!");
      } else {
        await popupsService.create(data);
        message.success("Pop-up creado exitosamente!");
      }
      setUpdateSource(!updateSource);
      closeDrawer();
    } catch (error) {
      message.error(error?.message || "Error al guardar el pop-up");
    }
  };

  const closeDrawer = () => {
    form.resetFields();
    setSelectedPopUp();
    setMediaList([]);
    setPendingFileList([]);
    setDrawerVisible(false);
  };

  const openCreateDrawer = () => {
    setSelectedPopUp();
    setMediaList([]);
    setPendingFileList([]);
    form.resetFields();
    setDrawerVisible(true);
  };

  return (
    <>
      <Grid
        custom={true}
        source="pop-ups"
        filterDefaultValues={{
          type: "product",
          establishment_id,
          $limit: 1000,
        }}
        searchField="q"
        searchText="Pop-up product..."
        search={true}
        permitFetch={!!establishment_id}
        actions={{}}
        updateSource={updateSource}
        columns={columns({ onRemove, onEdit })}
        extra={
          <RoundedButton
            icon={<AiOutlinePlus />}
            type="primary"
            onClick={openCreateDrawer}
          >
            Agregar
          </RoundedButton>
        }
      />
      {drawerVisible && (
        <Drawer
          title={`${selectedPopUp ? "Editar" : "Crear"} Pop-up product`}
          placement="right"
          width={520}
          visible={drawerVisible}
          onClose={closeDrawer}
        >
          <SimpleForm
            allowNull={true}
            textAcceptButton={
              uploadingMedia ? "Subiendo imágenes..." : "Guardar"
            }
            initialValues={{
              ...selectedPopUp,
              media_list: stringifyMediaList(mediaList),
              display_limit:
                selectedPopUp?.display_limit != null
                  ? Number(selectedPopUp.display_limit)
                  : selectedPopUp?.display_limit,
            }}
            onSubmit={handleSubmit}
            form={form}
          >
            <Input type="hidden" name="media_list" />
            <div style={{ width: "100%", marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Imágenes (media_list)
              </div>
              {mediaList.length > 0 && (
                <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                  {_.map(mediaList, (path, index) => (
                    <Col key={`uploaded-${path}-${index}`}>
                      <div style={{ position: "relative" }}>
                        <Image
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                          src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                            url: path,
                            width: 80,
                            height: 80,
                          })}`}
                          preview={{ src: `${URL_S3}${path}` }}
                          alt="media"
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          shape="circle"
                          icon={<AiOutlineClose />}
                          style={{ position: "absolute", top: -8, right: -8 }}
                          onClick={() => handleRemoveMedia(path)}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
              <DragAndDropUploader
                path={`pop-ups/product/${establishment_id}/`}
                filePath={`pop-ups/product/${establishment_id}/`}
                formats={MEDIA_FORMATS}
                fileMatch={MEDIA_FILE_MATCH}
                showUploadList={true}
                showRemoveIcon={true}
                onChange={setPendingFileList}
                onFinish={handleMediaUpload}
              />
            </div>
            <Input
              flex={1}
              name="name"
              label="Nombre"
              validations={[{ required: true, message: "Nombre es requerido" }]}
            />

            <Input
              flex={1}
              name="sub_title"
              label="Subtítulo"
              validations={[
                { required: true, message: "Subtítulo es requerido" },
              ]}
            />
            <RichTextField
              key={`description-${selectedPopUp?.id || "new"}`}
              flex={1}
              name="description"
              label="Descripción"
              height="280px"
              defaultValue={selectedPopUp?.description || ""}
              validations={[
                { required: true, message: "Descripción es requerida" },
                {
                  validator: (_, value) => {
                    const text = (value || "").replace(/<[^>]*>/g, "").trim();
                    if (!text) {
                      return Promise.reject(
                        new Error("Descripción es requerida"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            />

            <Select
              flex={1}
              name="display_device"
              label="Dispositivo"
              size="large"
              validations={[
                { required: true, message: "Dispositivo es requerido" },
              ]}
            >
              {_.map(DISPLAY_DEVICES, ({ id, name }, index) => (
                <Select.Option key={index} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
            <Select
              flex={1}
              name="display_limit"
              label="Límite de visualización"
              size="large"
              validations={[{ required: true, message: "Límite es requerido" }]}
            >
              {_.map(DISPLAY_LIMITS, ({ id, name }, index) => (
                <Select.Option key={index} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </SimpleForm>
        </Drawer>
      )}
    </>
  );
};

export default PopUpProduct;
