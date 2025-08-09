import { useEffect, useState } from 'react';
import { getService } from '../../../../services';

export const useTemplates = ({ establishment_id }) => {
    const service = getService("discount-templates");

    const [templates, setTemplates] = useState([]);

    const getTemplates = () => {
        service.find({
            query: {
                $or: [
                    { establishment_id },
                    { type: 'global' },
                ],
                $limit: 100,
                $sort: {
                    name: 1,
                },
                $select: ['id', 'name', 'type']
            }
        })
            .then(({ data }) => {
                setTemplates(data);
            })
    };

    useEffect(() => {
        if (establishment_id)
            getTemplates();
        else
            setTemplates([]);

    }, [establishment_id])

    return [
        templates,
        getTemplates
    ];
}