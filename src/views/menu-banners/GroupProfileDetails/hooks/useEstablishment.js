import { message } from 'antd';
import _ from 'lodash';
import { debounce } from 'lodash';
import { useState } from 'react';
import { getService } from '../../../../services';

export const useEstablishment = () => {

    const establishmentService = getService('establishments');
    const [establishments, setEstablishments] = useState([]);
    const [loadingEstablishment, setLoadingEstablishment] = useState(false);

    const getEstablishment = (value) => {
        if (value === '') {
            setEstablishments([])
            return;
        }
        setLoadingEstablishment(true);
        establishmentService.find({
            query: {
                q: value,
                $client: {
                    skipJoins: true
                },
                $limit: 50,
                $select: ['id', 'name', 'slug']
            }
        })
            .then(({ data }) => {
                setEstablishments(_.map(data, ({ id, name, slug }) => ({ id: JSON.stringify({ id, slug }), name })));
                setLoadingEstablishment(false);
            })
            .catch((err) => {
                message.error(err);
                setLoadingEstablishment(false);
            });
    }
    const debounceGetEstablishmentsDatas = debounce(getEstablishment, 500, { maxWait: 800 });


    return [
        establishments,
        loadingEstablishment,
        debounceGetEstablishmentsDatas
    ];
}