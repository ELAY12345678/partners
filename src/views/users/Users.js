import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
/* Redux */
import { connect, useDispatch } from "react-redux";
import * as actionTypes from "../../redux/app/actions";
/* Components */
import { Grid } from "../../components/com";
import { Button, Empty, Avatar, Layout, Tag } from "antd";

import qs from "qs";
import SelectField from "../../components/com/form/SelectField";

import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';

import { URL_S3, DEFAULT_USER_AVATAR, S3_PATH_IMAGE_HANDLER } from '../../constants'

const RoundedButton = styled(Button)`
  border-radius: 20px !important;
`;
export const WrapperStatusField = styled.div`
  &.status-field.inactive span {
    color: red;
  }
`;
const roles = [
  {
    id: "admin",
    name: "Administrador",
  },
  {
    id: "user",
    name: "Usuario",
  },
];
const status = [
  {
    id: "active",
    name: "Activo",
  },
  {
    id: "disabled",
    name: "Desactivado",
  },
  {
    id: "pending validation",
    name: "Pendiente de validación",
  },
  {
    id: "pending_information",
    name: "Pendiente por información",
  },
];
const genders = [
  {
    id: "male",
    name: "Masculino",
  },
  {
    id: "female",
    name: "Femenino",
  },
  {
    id: "not_defined",
    name: "No definido",
  },
];
const StatusField = ({
  source,
  choices,
  optionText = "name",
  optionValue = "id",
  ...props
}) => {
  const [record, setRecord] = useState();
  const [value, setValue] = useState();
  useEffect(() => {
    if (props.record) setRecord(props.record);
  }, [props.record]);
  useEffect(() => {
    if (record) {
      let value = choices.find((it) => it[optionValue] === record[source]);
      if (value) setValue(value[optionText]);
    }
  }, [choices, optionText, optionValue, record, source]);
  if (!record) return <span></span>;
  return (
    <WrapperStatusField className={`status-field ${record && record[source]}`}>
      <span>{value}</span>
    </WrapperStatusField>
  );
};
const columns = [
  {
    title: "Código País",
    dataIndex: "phone_country_code",
    sorter: true,
  },
  {
    title: "Teléfono",
    dataIndex: "phone",
    sorter: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: true,
  },
  {
    title: "Disabled Reason",
    dataIndex: "disabled_reason",
    sorter: true,
  },
  {
    title: "Estado",
    sorter: true,
    dataIndex: "status",
    render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color={value === 'disabled' ? 'red' : 'orange'}>{value}</Tag>
  },
];

const UserGrid = ({ columns, filters, ...props }) => {
  const navigate = useNavigate();

  const handleAdd = (id) => {
    navigate(
      `/dashboard/management/users/${id ? id : "create"}`
    );
  };

  if (props.loading) return null;

  return (
    <Grid
      custom={true}
      filterDefaultValues={{
        $skip: 50
      }}
      permitFetch={true}
      create={false}
      searchField="q"
      searchText="Usuario..."
      search={true}
      searchById={true}
      columns={columns}
      filters={filters}
      extra={
        <div>
          <RoundedButton
            icon={<AiOutlinePlus />}
            type={"primary"}
            onClick={() => handleAdd()}
          >
            Agregar
          </RoundedButton>
        </div>
      }
      actions={{
        edit: false,
        create: false,
        extra: (
          <div>
            <Button
              icon={<AiOutlineEdit />}
              type={"link"}
              onClick={(record) => handleAdd(record.id)}
            />
          </div>
        ),
      }}
      source={"users"}
      {...props}
    />
  );
};

const Users = ({ updated, onUpdate, ...props }) => {
  const dispatch = useDispatch();
  const [brand_id, setBrandId] = useState();
  const [restaurant_id, setRestaurantId] = useState();
  const [filter, setFilter] = useState();
  const [loading, setLoading] = useState(props.loading);
  const [role, setRole] = useState();

  useEffect(() => {
    let query;
    if (props.location) {
      let { search } = props.location;
      query = qs.parse(search.replace(/\?/, ""));
      if (query) {
        if (role != query["role"]) {
          setLoading(true);
          setRole(query.role);
        }
      }
    }
  }, [props.location]);

  useEffect(() => {
    if (filter) {
      setBrandId(filter.brand_id);
      setRestaurantId(filter.restaurant_id);
    }
  }, [filter]);

  useEffect(() => {
    if (role) {
      setLoading(false);
      dispatch({
        type: actionTypes.CHANGE_FILTERS,
        defaultFilters: {
          restaurant_id: role === "user",
          brand_id: role === "user",
        },
      });
    }
  }, [role]);

  useEffect(() => {
    if (props.location) {
      let query = qs.parse(props.location.search.replace(/\?/, ""));
      if (query) {
        for (let key in query) {
          if (
            typeof query[key] === "undefined" ||
            query[key] === "" ||
            query[key] === null
          ) {
            delete query[key];
          }
        }
        setFilter(query);
      }
    }
  }, [props.location]);

  useEffect(() => {
    if (filter) {
      let { brand_id, restaurant_id } = filter;
      setBrandId(brand_id);
      setRestaurantId(restaurant_id);
    }
  }, [filter]);

  return (
    <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
      <UserGrid
        {...props}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            sorter: true,
          },
          {
            title: "Foto",
            dataIndex: "avatar_path",
            sorter: false,
            render: (value) =>
              <Avatar
                size="large"
                alt={'Avatar'}
                src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                  url: value || DEFAULT_USER_AVATAR,
                  width: 64,
                  height: 64,
                })}`}
              />
          },
          {
            title: "Nombre",
            dataIndex: "first_name",
            sorter: true,
            render: (value, { last_name }) =>
              `${value || ""} ${last_name || ""}`,
          },
          {
            title: "Genero",
            dataIndex: "gender",
            sorter: true,
            render: (value, record) => (
              <StatusField
                initial={value}
                className={`status-field ${record && record[value]}`}
                record={record}
                source="gender"
                choices={genders}
              />
            ),
          },
          {
            title: "Role",
            dataIndex: "role",
            sorter: true,
            render: (value, record) => (
              <StatusField
                initial={value}
                className={`status-field ${record && record[value]}`}
                record={record}
                source="role"
                choices={roles}
              />
            ),
          },
          ...columns,
        ]}
        loading={loading}
        // filterDefaultValues={
        //   role === "user"
        //     ? brand_id &&
        //     restaurant_id && {
        //       role: { $ne: "admin" },
        //       restaurant_id,
        //       brand_id,
        //     }
        //     : undefined
        // }
        filters={
          <>
            <SelectField
              alwaysOn
              source="status"
              name="status"
              label="Estado"
              placeholder="Estado"
              allowEmpty
              choices={status}
              size="medium"
            />
            <SelectField
              alwaysOn
              source="role"
              name="role"
              label="Role"
              placeholder="Role"
              allowEmpty
              choices={roles}
              size="medium"
            />
          </>
        }
      />
    </Layout.Content>
  );
};
const mapStateToProps = (state) => {
  return {
    updated: state.updated,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdate: (updated) => {
      dispatch({ type: actionTypes.UPDATE_LIST, updated });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
