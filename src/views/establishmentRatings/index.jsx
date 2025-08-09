import React, { useState } from 'react';
import _ from 'lodash';
import { Col, Divider, Layout, Progress, Row, Select, Typography, message } from 'antd';
import { useSelector } from 'react-redux';
import { Grid } from '../../components/com';
import moment from 'moment';

import { AiOutlineDelete, AiOutlineStar } from 'react-icons/ai';
import { Box } from './styles';
import { useEstablishmentRating } from './hooks/useEstablishmentRating';
import { useRatingPercent } from './hooks/useRatingPercent';

import IconStar from '../../sources/icons/star';
import meal from '../../sources/icons/meal.svg';
import environment from '../../sources/icons/environment.svg';
import service from '../../sources/icons/service.svg';
import cleaning from '../../sources/icons/cleaning.svg';
import time from '../../sources/icons/time.svg';
import { useEstablishmentRatingDetails } from './hooks/useEstablishmentRatingDetails';
import AsyncButton from '../../components/asyncButton';
import { getService } from '../../services';

const USERS_ROLES = {
    admin: 'admin',
    user: 'user',
};

const columns = [
    {
        title: "Sucursal",
        dataIndex: "meta_establishment_branch_address",
        render: (value, record) => <>{`${(value || record?.establishment_branch?.address) || ""}`}</>,
        sorter: true,
    },
    {
        title: "Calificación",
        dataIndex: "rating_score",
        render: (value, record) => <>
            {value}
            <AiOutlineStar style={{ color: '#f4cd4d' }} />
        </>,
        sorter: true,
        width: '150px'
    },
    {
        title: "Comentario",
        dataIndex: "rating_comment",
    },
    {
        title: "Fecha",
        dataIndex: "createdAt",
        render: (value, record) => <>{`${moment(value).format("LL")}`}</>,

    },
];

const RatingByNumberBar = ({ number, percent }) => {
    return (
        <Row align='middle' gutter={16} style={{ width: '100%' }}>
            <Col flex='2rem'>
                <Row justify='center'>
                    <Col>
                        <Typography.Text>
                            {number}
                        </Typography.Text>
                    </Col>
                </Row>
            </Col>
            <Col flex='none' style={{ color: '#f4cd4d' }}>
                <AiOutlineStar size={25} />
            </Col>
            <Col flex='auto'>
                <Progress percent={percent} strokeColor={percent <= 10 ? '#FF4B4B' : percent <= 25 ? '#F4CD4D' : 'var(--purple)'} />
            </Col>
        </Row>
    );
};

const RatingCard = ({ icon, title, rating }) => {
    return (
        <Col flex={1}>
            <Box >
                <Col span={24} >
                    <Row align='middle' justify='space-between' gutter={8}>
                        <Col>
                            <img src={icon} alt='icon rating' height={'45em'} />
                        </Col>
                        <Col>
                            <Row align='middle' gutter={8}>
                                <Col>
                                    <Typography.Title level={2} style={{ margin: 0 }}>
                                        {typeof rating === 'string' ? rating?.substring(0, 4) : rating || '0.0'}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Row align='middle'>
                                        <IconStar size={30} />
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Typography.Title level={4} style={{ margin: 0, marginTop: '1rem' }}>
                            {title}
                        </Typography.Title>
                    </Row>
                </Col>
            </Box>
        </Col>
    );
};

const EstablishmentRatings = () => {

    const [ratingFilter, setRatingFilter] = useState({});
    const [updateSource, setUpdateSource] = useState(false);

    const establishmentFilters = useSelector(({ dashboardReducer }) => dashboardReducer.establishmentFilters);
    const currentUser = useSelector(({ appReducer }) => appReducer?.user);

    const [rating] = useEstablishmentRating({ establishment_id: establishmentFilters.establishment_id });
    const [ratingPercent] = useRatingPercent(establishmentFilters);
    const [ratingDetails] = useEstablishmentRatingDetails({ establishment_id: establishmentFilters.establishment_id, establishment_branch_id: establishmentFilters.establishment_branch_id });

    const handleChangeRatingFilter = (value) => {
        if (value === 'default')
            setRatingFilter({ rating_score: undefined });
        else
            setRatingFilter({ rating_score: value });
    };

    const onRemove = async ({ id }) => {
        const ratingService = getService('establishment-ratings');
        await ratingService.remove(id)
            .then(() => {
                message.success("Calificación eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch((error) =>
                message.error('No se pudo eliminar la calificación! ' + error?.message)
            )
    };

    const branchsIdPermissions = (permissionsv2) => {
        const permissionsEstablishments = permissionsv2.filter(
            (it) => it.type === 'establishments',
        );

        const permissionsEstablishmentsBranchs = permissionsEstablishments?.map(
            (permissionEstablishment) => {
                if (permissionEstablishment.establishment_id === Number(establishmentFilters.establishment_id))
                    return (
                        permissionEstablishment?.establishments_branchs?.map(
                            (branch) => branch.id,
                        )
                    )
            }
        );
        return _.flattenDeep(permissionsEstablishmentsBranchs)
    };

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Row
                align='middle'
                gutter={[16, 16]}
            >
                <Col>
                    <IconStar color="var(--purple)" />
                </Col>
                <Col>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Calificaciones
                    </Typography.Title>
                </Col>
            </Row>
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            <Box >
                <Col md={24} lg={12} >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Typography.Title level={5}>
                                La calificación promedio de tu marca es:
                            </Typography.Title>
                            <Typography.Paragraph>
                                El promedio de tu marca resulta de la suma del promedio de todas tus tiendas
                            </Typography.Paragraph>
                        </Col>
                        <Col span={8}>
                            <Row align='middle' justify="start" gutter={16}>
                                <Col>
                                    <Typography.Title >
                                        {rating}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <IconStar />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} >
                    {
                        _.map(ratingPercent, ({ key, value }, index) => <RatingByNumberBar key={index} number={key} percent={value.toFixed(0)} />)
                    }
                </Col>
            </Box>
            {
                establishmentFilters?.establishment_id &&
                <>
                    <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
                    <Row gutter={[16, 16]}>
                        <RatingCard icon={meal} title='Comida' rating={ratingDetails?.food_rating} />
                        <RatingCard icon={environment} title='Ambiente' rating={ratingDetails?.environment_rating} />
                        <RatingCard icon={service} title='Servicio' rating={ratingDetails?.service_rating} />
                        <RatingCard icon={cleaning} title='Limpieza' rating={ratingDetails?.hygiene_rating} />
                        <RatingCard icon={time} title='Tiempo' rating={ratingDetails?.time_rating} />
                    </Row>
                </>
            }
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0 }} />
            {
                !(establishmentFilters.establishment_id)
                    ? (
                        <Box>
                            *Selecciona un restaurante para ver los registros*
                        </Box>
                    )
                    : (
                        <Grid
                            custom={true}
                            filterDefaultValues={{
                                establishment_id: establishmentFilters.establishment_id,
                                establishment_branch_id: establishmentFilters.establishment_branch_id
                                    ? establishmentFilters.establishment_branch_id
                                    : currentUser?.role === USERS_ROLES.admin
                                        ? undefined
                                        : { $in: branchsIdPermissions(currentUser?.permissionsv2) },
                                ...ratingFilter
                            }}
                            permitFetch={!_.isEmpty(establishmentFilters)}
                            title={
                                <Typography.Title level={4}>
                                    Tus calificaciones
                                </Typography.Title>
                            }
                            style={{ borderRadius: '0.5rem' }}
                            source={"establishment-ratings"}
                            columns={
                                currentUser?.role === USERS_ROLES.admin ?
                                    [...columns,
                                    {
                                        title: "Acciones",
                                        dataIndex: 'id',
                                        key: 'actions',
                                        width: '150px',
                                        render: (id, record) =>
                                            <AsyncButton
                                                type="link"
                                                onClick={() => onRemove({ id })}
                                                icon={<AiOutlineDelete />}
                                                confirmText="Desea eliminar?"
                                            >
                                            </AsyncButton>
                                    }] :
                                    columns
                            }
                            actions={{}}
                            extra={
                                <Row gutter={8}>
                                    <Col>
                                        <Typography.Title level={5}>
                                            Filtrar por:
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        <Select
                                            defaultValue="default"
                                            style={{ width: 120, borderRadius: '0.5rem' }}
                                            disabled={_.isEmpty(establishmentFilters)}
                                            onChange={handleChangeRatingFilter}
                                        >
                                            <Select.Option value='default'>
                                                todas
                                            </Select.Option>
                                            <Select.Option value='5.00'>
                                                5 estrellas
                                            </Select.Option>
                                            <Select.Option value='4.00'>
                                                4 estrellas
                                            </Select.Option>
                                            <Select.Option value='3.00'>
                                                3 estrellas
                                            </Select.Option>
                                            <Select.Option value='2.00'>
                                                2 estrellas
                                            </Select.Option>
                                            <Select.Option value='1.00'>
                                                1 estrellas
                                            </Select.Option>
                                        </Select>
                                    </Col>
                                </Row>
                            }
                        />
                    )
            }
            <Divider style={{ background: 'transparent', borderTop: 0, marginTop: 0, marginBottom: '1rem' }} />
        </Layout.Content>
    )
};

export default EstablishmentRatings;