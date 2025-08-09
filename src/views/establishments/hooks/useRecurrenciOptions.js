import {getService} from "../../../services";
import {useEffect, useState} from "react";

export const useRecurrenciOptions =()=>{
    const service = getService("configurations");

    const [recurrenciOptions, setRecurrenciOptions] = useState([]);

    async function getLastBuild() {
        try {
            const response = await service.get(107);
            setRecurrenciOptions(JSON.parse(response?.value || '{}')?.plans || []);
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        getLastBuild();
    }, []);

    return {
        recurrenciOptions,
    }
}
