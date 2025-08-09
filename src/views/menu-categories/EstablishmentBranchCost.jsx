import React, { useState, useEffect } from 'react';
import { Col, InputNumber, message, Row, Select, Switch } from 'antd';
import AsyncButton from '../../components/asyncButton';
import { getService } from '../../services';
import { AiOutlineDelete } from 'react-icons/ai';
import _ from 'lodash';


const CALCULATE_PRICE_BY = [
    {
        id: 'fixed_percentage',
        name: '% Fijo',
    },
    {
        id: 'global_percentage',
        name: '% Global',
    },
    {
        id: 'fixed_amount',
        name: '$ Fijo',
    },
    {
        id: 'full_price',
        name: 'Sin descuento',
    },
];

const EstablishmentBranchCost = ({ itemHasCost, itemCost, getDataCostItems, item, address, establishment_id, establishment_branch_id, key }) => {

    const menuItemCostService = getService("establishment-menu-items-cost");

    const [price, setPrice] = useState();

    function handleChangePrice(value) {
        setPrice({ ...price, ...value });
    };

    const handleSaveCost = async (
        id = "",
        payload,
        setterPayload,
        establishmentId = "",
        establishmentMenuItemId = "",
        establishmentBranchId = "",
        getterDataItems = () => { },
        setterRefresh
    ) => {
        if (id !== "") {
            try {
                await menuItemCostService.patch(id, {
                    price: payload.price,
                    calculate_price_by: payload.calculate_price_by,
                    [payload?.calculate_price_by]: payload[payload?.calculate_price_by] || undefined
                }, {});
                message.success("Valor de sucursal actualizado exitosamente");
                setterPayload({});
                await getterDataItems(establishmentMenuItemId);
                setterRefresh(false);
            } catch (e) {
                message.error(e.message);
            }
        } else {
            try {
                await menuItemCostService.create({
                    price: payload.price,
                    calculate_price_by: payload.calculate_price_by,
                    [payload?.calculate_price_by]: payload[payload?.calculate_price_by] || undefined,
                    establishment_id: establishmentId,
                    establishment_menu_item_id: establishmentMenuItemId,
                    establishment_branch_id: establishmentBranchId,
                });
                message.success("Valor de sucursal creado exitosamente");
                setterPayload({});
                await getterDataItems(establishmentMenuItemId);
                setterRefresh(false);
            } catch (e) {
                message.error(e.message);
            }
        }
    };

    const handleDeleteCost = async (
        id,
        establishmentMenuItemId = "",
        getterDataItems = () => { },
        setterRefresh
    ) => {
        try {
            await menuItemCostService.remove(id);
            getterDataItems(establishmentMenuItemId);
            setterRefresh(false);
            message.success("Se ha eliminado el valor exitosamente");
        } catch (e) {
            message.error("error", e.message);
        }
    };

    const handleStatusCost = async (
        id = "",
        payload,
        establishmentMenuItemId = "",
        getterDataItems = () => { },
    ) => {
        if (id !== "") {
            try {
                await menuItemCostService.patch(id, { status: payload ? 'active' : 'inactive' }, {});
                message.success("Estado de sucursal actualizado exitosamente");
                await getterDataItems(establishmentMenuItemId);
            } catch (e) {
                message.error(e.message);
            }
        }
    };

    useEffect(() => {
        setPrice({ ...itemCost, calculate_price_by: itemCost?.calculate_price_by || CALCULATE_PRICE_BY[1].id });
    }, [itemCost])


    return (
        <Col flex={1} key={key}>
            <Row>
                {address}
            </Row>
            <Row gutter={[4, 16]}>
                <Col flex={0.1}>
                    <InputNumber
                        min={1}
                        placeholder="Precio..."
                        name="Price"
                        style={{ width: "97%" }}
                        value={price?.price}
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onChange={(value) => {
                            handleChangePrice({ price: value });
                        }}
                    />
                </Col>
                <Col flex={0.1} >
                    <Select
                        value={
                            price?.calculate_price_by
                        }
                        onSelect={(value) =>
                            handleChangePrice({ calculate_price_by: value })
                        }
                    >
                        {
                            _.map(CALCULATE_PRICE_BY, (option, index) =>
                                <Select.Option key={index} value={option.id}>
                                    {option.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                    {
                        price?.calculate_price_by === CALCULATE_PRICE_BY[0].id &&
                        <InputNumber
                            min={0}
                            style={{ minWidth: '150px' }}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace('%', '')}
                            value={price?.fixed_percentage}
                            onChange={(value) => {
                                handleChangePrice({ fixed_percentage: value });
                            }}
                        />
                    }
                    {
                        price?.calculate_price_by === CALCULATE_PRICE_BY[2].id &&
                        <InputNumber
                            min={1}
                            style={{ minWidth: '150px' }}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            value={price?.fixed_amount}
                            onChange={(value) => {
                                handleChangePrice({ fixed_amount: value });
                            }}
                        />
                    }
                </Col>
                <Col flex={0.7}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <AsyncButton
                            type="primary"
                            style={{ borderRadius: '0.5rem' }}
                            onClick={async () => {             
                                await handleSaveCost(
                                    itemCost?.id,
                                    price,
                                    setPrice,
                                    establishment_id,
                                    item?.id,
                                    establishment_branch_id,
                                    getDataCostItems,
                                    () => { }
                                );
                            }}
                            children={itemHasCost ? <>Actualizar</> : <>Crear</>}
                        />
                        {
                            itemHasCost
                            && (
                                <>
                                    <Switch
                                        checked={
                                            itemCost?.status === 'active'
                                        }
                                        onChange={(value) => handleStatusCost(
                                            itemCost?.id,
                                            value,
                                            item?.id,
                                            getDataCostItems,
                                        )}
                                    />
                                    <AsyncButton
                                        style={{ borderRadius: '0.5rem' }}
                                        onClick={async () => {
                                            await handleDeleteCost(
                                                itemCost?.id,
                                                item?.id,
                                                getDataCostItems,
                                                () => { }
                                            );
                                        }}
                                        icon={<AiOutlineDelete />}
                                    />
                                </>
                            )
                        }
                    </div>
                </Col>
            </Row>
        </Col>
    );
}

export default EstablishmentBranchCost;