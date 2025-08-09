import { InputNumber, message, Modal } from "antd";
import React, { useState } from "react";
import SelectField from "../../components/com/form/SelectField";
import { getService } from "../../services";
import { Headline } from "./style";

const { confirm } = Modal;

export const choiceSend = [
  {
    id: "true",
    name: "Disponible"
  },
  {
    id: "false",
    name: "No disponible"
  }
];

export const choiceStatus = [
  {
    id: "active",
    name: "Activo"
  },
  {
    id: "inactive",
    name: "Inactivo"
  }
];

export async function getRestaurants(
  setterDataSource,
  setterIsLoading,
  brand_id = ""
) {
  setterIsLoading(true);
  const service = getService("users-brand-permissions");
  if (brand_id !== "") {
    try {
      const response = await service.find({
        query: {
          $limit: 100,
          brand_id: brand_id,
          $client: { restaurants: true }
        }
      });
      setterDataSource(response);
      setterIsLoading(false);
    } catch (e) {
      message.error(e.message);
      setterIsLoading(false);
    }
  }
}

export const statusFormatter = {
  active: "Activo",
  inactive: "Inactivo",
  null: "nulo"
};

/* createOverwriteValue Esta funcion tiene puede crear un nuevo overwrite, para ello necesita
 * @params reference: La referencia del servicio en el cual se crearea
 * @params payload: Los datos para la creacion, se recomienda enviar el objeto completo y depurar dentro de la funcion campos no deseados
 * @params action: Esta permite que se recarge la lista de items con la nueva informacion
 * @params getDataItem: Es una funcion que se encargaa de volver a cargar la data del ite que se esta utilizando
 * @params idItem: Este es el id del item que se encuentra actualizando debe ser entero
 * @params setterData: Esta puede ser cualquier funcion set que permita recuperar los datos de la respuesta
 * */
export async function createOverwriteValue(
  reference,
  payload,
  action,
  getDataItem,
  idItem,
  setterData
) {
  const service = getService(reference);
  try {
    const response = await service.create({
      restaurant_id: payload.id,
      menu_item_id: payload.menu_item_id,
      ...payload,
      name: undefined,
      overwrite: undefined,
      price_tax_excl: undefined
    });
    idItem && (await getDataItem(idItem, setterData));
    payload?.menu_item_id &&
      (await action(null, { ...response, id: payload?.menu_item_id }));
    message.success("Item creado exitosamente");
  } catch (e) {
    message.error(e.message);
  }
}

export async function updateOverwriteValue(
  reference,
  payload,
  action,
  getDataItem,
  idItem,
  setterData
) {
  /* updateOverwriteValue Esta funcion tiene puede actualizar un overwrite existente
   * @params reference: La referencia del servicio el cual generara la actulizacion
   * @params payload: Los datos para la actualizacion, se recomienda enviar el objeto completo y depurar dentro de la funcion campos no deseados
   * @params action: Esta permite que se recarge la lista de items con la nueva informacion
   * @params getDataItem: Es una funcion que se encargaa de volver a cargar la data del ite que se esta utilizando
   * @params idItem: Este es el id del item que se encuentra actualizando debe ser entero
   * @params setterData: Esta puede ser cualquier funcion set que permita recuperar los datos de la respuesta
   * */
  const service = getService(reference);
  try {
    const response = await service.patch(
      payload.id,
      {
        ...payload,
        name: undefined,
        tax_value: undefined,
        overwrite: undefined,
        price_tax_excl: undefined
      },
      {}
    );
    idItem && (await getDataItem(idItem, setterData));
    payload?.menu_item_id &&
      (await action(null, { ...response, id: payload?.menu_item_id }));
    message.success("Item actualizado exitosamente");
  } catch (e) {
    message.error(e.message);
  }
}

export async function getDataOnlyItem(id, setterItem) {
  const serviceItems = getService("menu-items");
  if (id !== null && id !== undefined) {
    try {
      const response = await serviceItems.get(id);
      setterItem(response);
    } catch (e) {
      message.error(e.message);
    }
  }
}

export const ModalCreateOverwrite = ({
  isOpen,
  setterIsOpen,
  item,
  type,
  field,
  name,
  record,
  onSubmit: setterAction,
  setNewItem
}) => {
  const [payload, setPayload] = useState({});
  return (
    <Modal
      visible={isOpen}
      onCancel={() => setterIsOpen(false)}
      destroyOnClose={true}
      title="Generar un nuevo overwrite"
      onOk={async () => {
        record.overwrite === false
          ? await createOverwriteValue(
              "menu-items-restaurant-overwrite",
              {
                ...payload,
                restaurant_id: record?.id,
                menu_item_id: record?.menu_item_id
              },
              setterAction,
              getDataOnlyItem,
              item.id,
              setNewItem
            )
          : await updateOverwriteValue(
              "menu-items-restaurant-overwrite",
              {
                ...payload,
                id: record.id,
                restaurant_id: record.restaurant_id
              },
              setterAction,
              getDataOnlyItem,
              item.id,
              setNewItem
            );
        setPayload({});
        setterIsOpen(false);
      }}
    >
      <>
        {(type === "status" || type === "send") && (
          <>
            <Headline>
              {type === "status" ? "Estado" : "Tipo de envio"}
            </Headline>
            <SelectField
              choices={type === "status" ? choiceStatus : choiceSend}
              placeholder="Seleccione un estado"
              style={{ width: "100%" }}
              onChange={e => {
                setPayload({ ...payload, [name]: e });
              }}
            />
          </>
        )}
        {type === "price" && (
          <>
            <Headline>{field === "tax" ? "Precio" : "precio tachado"}</Headline>
            <InputNumber
              size="large"
              min={1000}
              value={
                name === "price_tax_incl"
                  ? item?.price_tax_incl
                  : item?.strikethrough_price
              }
              style={{ width: "100%" }}
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              onChange={e => setPayload({ ...payload, [name]: e })}
            />
          </>
        )}
      </>
    </Modal>
  );
};

export async function handleDelete(id, getterData) {
  const serviceDepartments = getService("departments");
  if (id) {
    confirm({
      title: "¿Estas seguro que deseas eliminar este departamento?",
      content: "Oprime OK para eliminar el registro.",
      onOk() {
        serviceDepartments
          .remove(id)
          .then(_ => {
            message.success("Registro eliminado exitosamente eliminado");
            getterData();
          })
          .catch(err => message.error(err.message));
      },
      onCancel() {}
    });
  }
}
