import { Button, message, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { URL_S3 } from "../../constants";
import { getService } from "../../services";
import PLUS_PNG from "../../sources/icons8-plus-+-40.png";
import HOME_PNG from "../../sources/icons8-restaurant-48.png";
import { handleDelete } from "./index";
import ModalDeparments from "./ModalDepartments";
import {
  Headline,
  Image,
  WrapperHome,
  WrapperItem,
  WrapperListItems
} from "./style";

const RenderListItemDepartments = ({
  id,
  setterDepartament,
  setterLengthDepartments
}) => {
  const serviceDepartments = getService("departments");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [idSelected, setIdSelected] = useState();
  const [idDepartmentEdited, setIdDepartmentEdited] = useState();

  const getDataDepartments = useCallback(
    async function() {
      if (id !== undefined) {
        setLoading(true);
        try {
          const response = await serviceDepartments.find({
            query: {
              brand_id: id,
              $limit: 5000,
              $sort: {
                name: 1
              }
            }
          });
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          setDataSource(response?.data);
          setterLengthDepartments(response?.total);
        } catch (e) {
          message.error(e);
        }
      }
    },
    [serviceDepartments, id, setterLengthDepartments]
  );

  useEffect(() => {
    getDataDepartments().then();
  }, [getDataDepartments]);

  return (
    <>
      <WrapperListItems>
        <>
          <WrapperHome
            onClick={async () => {
              setterDepartament(0);
              setIdSelected(0);
            }}
          >
            <img src={HOME_PNG} alt="" height={"auto"} width={60} />
            <Headline style={{ color: "#6610f2", whiteSpace: "normal" }}>
              Ver todos
            </Headline>
          </WrapperHome>
          {dataSource?.map((it, index) => (
            <WrapperItem
              key={index + it?.id}
              onClick={() => {
                setIdSelected(it?.id);
                setterDepartament(it?.id);
              }}
              active={idSelected === it?.id}
            >
              <Skeleton avatar active loading={loading} paragraph={{ rows: 0 }}>
                <Image
                  src={`${URL_S3}/${it?.path_background}`}
                  alt="logo"
                  height={"auto"}
                  width={"100%"}
                  active={idSelected === it?.id}
                />
                {idSelected === it?.id && (
                  <>
                    <Button
                      type="primary"
                      icon="edit"
                      shape="circle"
                      style={{ position: "relative", left: -55 }}
                      onClick={() => {
                        setIdDepartmentEdited(it?.id);
                        setVisible(true);
                      }}
                    />
                    <Button
                      type="primary"
                      icon="delete"
                      shape="circle"
                      style={{ position: "relative", left: -50 }}
                      onClick={async () => {
                        await handleDelete(it?.id, getDataDepartments);
                      }}
                    />
                  </>
                )}
              </Skeleton>
            </WrapperItem>
          ))}
          <WrapperHome
            onClick={async () => {
              setVisible(true);
              setIdDepartmentEdited(undefined);
            }}
            style={{ paddingRight: 17, paddingTop: 5 }}
          >
            <img src={PLUS_PNG} alt="" height={"auto"} width={40} />
            <Headline style={{ color: "#6610f2" }}>Agregar</Headline>
            <Headline style={{ color: "#6610f2", marginTop: -12 }}>
              departamento
            </Headline>
          </WrapperHome>
        </>
      </WrapperListItems>

      <ModalDeparments
        brand_id={id}
        visible={visible}
        setterVisible={setVisible}
        idDepartment={idDepartmentEdited}
        getterData={getDataDepartments}
      />
    </>
  );
};

export default RenderListItemDepartments;
