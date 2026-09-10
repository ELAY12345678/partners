import { useEffect, useState } from "react";
import { message } from "antd";
import { getService } from "../services";

export const useContries = () => {
  const countriesService = getService("countries");

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const getCountries = async () => {
    setLoadingCountries(true);
    countriesService
      .find({
        query: {
          $limit: 10000,
          // $select: ['id', 'name', 'currency', 'iso_code_2'],
        },
      })
      .then((res) => {
        setCountries(res?.data || []);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingCountries(false);
      });
  };

  useEffect(() => {
    getCountries();
  }, []);

  return {
    countries,
    loadingCountries,
  };
};
