import { message } from "antd";
import _ from "lodash";
import { useEffect } from "react";
import { useState } from "react";
import { getService } from "../../../../services";

export const useMenuItems = ({ establishment_id }) => {

    const menuItemsServices = getService('establishment-menu-items');

    const [menuItemsOptions, setMenuItemsOptions] = useState([]);
    const [loadingMenuItems, setLoadingMenuItems] = useState(false);

    const getMenuItemsDatas = () => {
        setLoadingMenuItems(true);
        menuItemsServices.find({
            query: {
                establishment_id,
                apparta_menu_status: 'active',
                $limit: 10000,
            }
        })
            .then(({ data }) => {
                setMenuItemsOptions(data);
                setLoadingMenuItems(false);
            })
            .catch((err) => {
                message.error(err);
                setLoadingMenuItems(false);
            });
    };

    useEffect(() => {
        if (establishment_id)
            getMenuItemsDatas();
        else
            setMenuItemsOptions([]);
    }, [establishment_id])


    return [
        menuItemsOptions,
        loadingMenuItems
    ];
}