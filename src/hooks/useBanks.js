import { message } from "antd";
import { useEffect, useState } from "react";
import { getService } from "../services";

export const useBanks = () => {

    const banksService = getService('banks');
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);


    const getBanks = () => {
        setLoading(true);
        banksService.find({
            query: {
                $limit: 1000,
                $sort: {
                    name: 1
                }
            }
        }).then(({ data }) =>{
            setBanks(data);
            setLoading(false);
            
        }).catch((error) => {
            message.error(error.message);
            setLoading(false);
        })
    }

    useEffect(() => {
        getBanks();
    }, []);

    return [
        banks,
        loading
    ]
}