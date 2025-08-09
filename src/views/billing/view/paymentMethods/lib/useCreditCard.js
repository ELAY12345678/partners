import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getService } from "../../../../../services";

const creditCards = getService('credit-cards');

export const useCreditCard = () => {

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);

    const [creditCardsData, setCreditCardsData] = useState([]);

    const getCreditcardsData = (establishmentFilters) => {
        creditCards.find({ query: {
            ...establishmentFilters,
            user_id:'null',
            $limit:1000,
        }})
        .then((response)=> {
            setCreditCardsData(response?.data || [])
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    useEffect(() => {
        setCreditCardsData([]);
        if(!_.isEmpty(establishmentFilters)){
            getCreditcardsData(establishmentFilters || {});
        }
    }, [establishmentFilters])
    

    return{
        creditCardsData,
        getCreditcardsData,
        setCreditCardsData
    }
    
}