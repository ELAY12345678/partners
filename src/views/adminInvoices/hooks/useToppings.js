import { useEffect, useState } from "react";
import { getService } from "../../../services";

export const useToppings = () => {
  const toppingsService = getService("invoice-payments-toppings");
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    toppingsService.find({}).then(( data ) => {
      setToppings(data); 
    }).catch((error) => {
    //   message.error(error.message);
    //   setToppings([]);
    //   setLoading(false);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  return {
    toppings,
    loading,
  };
};
