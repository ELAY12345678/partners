import { Col, Input, message, Modal, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import GalleryUploader from "../../components/com/gallery/GalleryUploader";
import { getService } from "../../services";
import { Headline } from "./style";

const ModalDeparments = ({
  brand_id,
  visible,
  setterVisible,
  idDepartment,
  getterData,
}) => {
  const service = getService("departments");
  const [payload, setPayload] = useState({});

  const getDataDepartment = useCallback(
    async function() {
      try {
        const response = await service.get(idDepartment);
        setPayload({
          id: response?.id,
          name: response?.name,
          path_background: response?.path_background,
        });
      } catch (e) {
        message.error(e.message);
      }
    },
    [service, idDepartment]
  );

  useEffect(() => {
    if (idDepartment !== undefined && idDepartment > 0) {
      getDataDepartment().then();
    }
  }, [getDataDepartment, idDepartment]);

  return (
    <>
      <Modal
        title={
          <Headline
            style={{ marginBottom: -7, display: "flex", alignItems: "center" }}
          >
            {`${
              idDepartment !== undefined
                ? "Editar departamento"
                : "Crear departamento"
            }`}
          </Headline>
        }
        destroyOnClose={true}
        visible={visible}
        onCancel={() => {
          setterVisible(false);
          setPayload({});
        }}
        onOk={async () => {
          if (idDepartment !== undefined) {
            try {
              await service.patch(idDepartment, { ...payload });
              await getterData();
              setterVisible(false);
            } catch (e) {
              message.error(e.message);
            }
          } else {
            try {
              await service.create({ brand_id, ...payload });
              await getterData();
              setterVisible(false);
            } catch (e) {
              message.error(e.message);
            }
          }
        }}
      >
        <Row gutter={[24, 12]}>
          <Col span={24} align="center">
            <Headline>Nombre</Headline>
            <Input
              name="name"
              placeholder="Nombre"
              value={payload?.name}
              onChange={(e) => {
                const { name, value } = e.target;
                setPayload({ ...payload, [name]: value });
              }}
            />
          </Col>
          {payload?.id && (
            <Col span={24} align="center">
              <Headline>Imagen principal</Headline>
              <GalleryUploader
                refresh={getterData}
                size="large"
                _id={payload}
                record={payload}
                source="path_background"
                reference="departments"
                path={`departments/${brand_id}/deparments`}
              />
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};

export default ModalDeparments;
