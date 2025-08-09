import React, { useState } from 'react';
import _ from "lodash";
import { AiOutlineDelete } from "react-icons/ai";
import { Table, Checkbox, Col, Select, message, Typography, Row } from "antd";
import { Box } from "../../../components/Styles";
import { useEstablishmentCategories } from "../hooks/useEstablishmentCategories";
import { useCategories } from "../hooks/useCategories";
import AsyncButton from '../../../components/asyncButton';
import { getService } from '../../../services';

const Categories = ({ establishmentData }) => {

    const establishmentsCategoriesService = getService("establishments-categories");

    const [establishmentCategories, getEstablishmentCategories, loadingEstablishmentCategories] = useEstablishmentCategories({ id: establishmentData?.id });
    const [categoriesData, loadingCategories] = useCategories();

    const [selectedCategory, setSelectedCategory] = useState();

    const addCategory = async () => {
        if (establishmentData?.id)
            await establishmentsCategoriesService
                .create({
                    category_id: selectedCategory,
                    establishment_id: establishmentData.id,
                })
                .then((response) => {
                    setSelectedCategory();
                    getEstablishmentCategories();
                    message.success("Categoría agregada!");
                })
                .catch((err) => {
                    message.error(err.message);
                });
    };

    const deleteCategory = async ({ id }) => {
        await establishmentsCategoriesService
            .remove(id)
            .then(() => {
                getEstablishmentCategories();
                message.success("Categoría Eliminada!");
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const changeMainCategory = async ({ id }) => {
        try {
            await establishmentsCategoriesService.patch(id, { main: "true" }, {});
            getEstablishmentCategories();
            message.success("La categoría principal fue actualizada");
        } catch (e) {
            message.error(e.message);
        }
    }

    return (
        <Box gutter={16}>
            <Col span={12}>
                <Row>
                    <Typography.Title level={5}>
                        Listado de Categorías
                    </Typography.Title>
                </Row>
                <Table
                    loading={loadingEstablishmentCategories}
                    dataSource={establishmentCategories}
                    pagination={false}
                    columns={[
                        {
                            key: 'category',
                            dataIndex: 'category',
                            title: 'Nombre',
                            sorter: true,
                            render: (value) => value?.name || ''
                        },
                        {
                            key: 'delete',
                            dataIndex: 'id',
                            title: 'Eliminar',
                            render: (id) => <AsyncButton icon={<AiOutlineDelete />} type='text' shape="circle" onClick={() => deleteCategory({ id })} />
                        },
                        {
                            key: 'main',
                            dataIndex: 'main',
                            title: 'Principal',
                            width: 50,
                            render: (value, { id }) =>
                                <AsyncButton type='text' onClick={() => changeMainCategory({ id })}>
                                    <Checkbox checked={value === "true"} />
                                </AsyncButton>
                        }
                    ]}
                />
            </Col>
            <Col span={12}>
                <Row>
                    <Typography.Title level={5}>
                        Asignar Categorías
                    </Typography.Title>
                </Row>
                <Row gutter={16}>
                    <Col span={14}>
                        <Select
                            loading={loadingCategories}
                            style={{
                                width: '100%',
                            }}
                            value={selectedCategory}
                            placeholder='Categoría...'
                            onSelect={(value) => setSelectedCategory(value)}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(categoriesData, ({ id, name }, index) =>
                                    <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                )

                            }
                        </Select>
                    </Col>
                    <Col>
                        <AsyncButton
                            type='primary'
                            disabled={!selectedCategory}
                            onClick={addCategory}
                        >
                            Agregar
                        </AsyncButton>
                    </Col>
                </Row>
            </Col>
        </Box >
    );
}

export default Categories;