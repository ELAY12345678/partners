import React, { useEffect, useState } from 'react';
import { Layout, Row, Select, List, Avatar, Badge, Typography, Col, Divider, InputNumber, message } from 'antd';
import { useCities } from '../../hooks/useCities';
import { getService } from '../../services';
import { useRawQueries } from './hooks/useRawQueries';
import { S3_PATH_IMAGE_HANDLER } from '../../constants';
import { Box } from '../../components';
import { AiFillStar } from 'react-icons/ai';
import _ from 'lodash';
import AsyncButton from '../../components/asyncButton';

const queryPosition = [
    { id: "position_breakfast", name: 'position_breakfast' },
    { id: "position_brunch", name: 'position_brunch' },
    { id: "position_lunch", name: 'position_lunch' },
    { id: "position_dinner", name: 'position_dinner' },
    { id: "position_after_dinner", name: 'position_after_dinner' },
]

const RenderItem = ({ item, cityId, changePosition }) => {

    const [positionNumbers, setPositionNumbers] = useState(null);

    useEffect(() => {
        setPositionNumbers(item)
    }, [item])

    return (
        <List.Item
            actions={[
                <AsyncButton
                    type="primary"
                    onClick={() => {
                        changePosition(positionNumbers, cityId, item.id);
                    }}
                >
                    Guardar
                </AsyncButton>
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Badge.Ribbon
                        placement='start'
                        text={<>{parseFloat(item?.total_rating_score).toFixed(1)} <AiFillStar /></>}
                    >

                        <Avatar
                            size={80}
                            src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                url: item.logo_path,
                                width: 150,
                                height: 150,
                            })}`
                            }
                        />
                    </Badge.Ribbon>

                }
                title={
                    <>
                        <Typography.Title level={5}>
                            {item?.name || ''}
                        </Typography.Title>
                    </>
                }
                description={
                    <Row gutter={8}>
                        <Col>
                            <label>
                                <div>
                                    Default
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_default}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_default: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        <Col>
                            <label>
                                <div>
                                    Breakfast
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_breakfast}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_breakfast: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        <Col>
                            <label>
                                <div>
                                    Brunch
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_brunch}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_brunch: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        <Col>
                            <label>
                                <div>
                                    Lunch
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_lunch}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_lunch: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        <Col>
                            <label>
                                <div>
                                    Dinner
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_dinner}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_dinner: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        <Col>
                            <label>
                                <div>
                                    After Dinner
                                </div>
                                <div>
                                    <InputNumber
                                        value={positionNumbers?.position_after_dinner}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, position_after_dinner: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                    </Row>
                }
            />
            {/* <div>content</div> */}
        </List.Item>
    );
}

const EstablishmentsPosition = () => {

    const serviceEstablishmentPositions = getService("establishments-position");

    const [city_id, setCityId] = useState();
    const [position, setPosition] = useState();
    const [cities, loadingCities] = useCities();

    const [dataRawQueries, loadingRawQueries] = useRawQueries({ city_id, position });

    const changePosition = async (position, cityId, establishmentId) => {
        try {
            await serviceEstablishmentPositions.create({
                position: position.position_default,
                position_breakfast: position.position_breakfast,
                position_brunch: position.position_brunch,
                position_lunch: position.position_lunch,
                position_dinner: position.position_dinner,
                position_after_dinner: position.position_after_dinner,
                establishment_id: establishmentId,
                city_id: cityId,
            });
        } catch (e) {
            message.error(e.message);
        }
    }

    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Box>
                <Col span={24}>
                    <Row gutter={16} justify='center' >
                        <Col>
                            <Select
                                loading={loadingCities}
                                style={{
                                    width: '15em'
                                }}
                                size="large"
                                placeholder="Selecciona una ciudad"
                                onSelect={(e) => {
                                    setCityId(e);
                                }}
                            >
                                {
                                    cities.map(({ id, name }, index) =>
                                        <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                style={{
                                    width: '15em'
                                }}
                                size="large"
                                placeholder="Horario"
                                allowClear
                                disabled={!city_id}
                                onClear={() => setPosition()}
                                onSelect={(e) => {
                                    setPosition(e);
                                }}
                            >
                                {
                                    queryPosition.map(({ id, name }, index) =>
                                        <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                }
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Divider style={{ background: 'transparent', borderTop: 0 }} />
                <Col span={24}>
                    <Row justify='center'>
                        <Col sm={24} md={24} lg={15} >
                            <List
                                loading={loadingRawQueries}
                                pagination={false}
                            >
                                {
                                    _.map(dataRawQueries, (item, index) =>
                                        <RenderItem
                                            item={item}
                                            index={index}
                                            changePosition={changePosition}
                                            cityId={city_id}
                                        />
                                    )
                                }
                            </List>
                        </Col>
                    </Row>
                </Col>
            </Box>
        </Layout.Content>
    );
}

export default EstablishmentsPosition;