import { Avatar, Badge, Col, Divider, InputNumber, Layout, List, message, Row, Select, Tabs, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { Box } from '../../components';
import AsyncButton from '../../components/asyncButton';
import { TabsStyled } from '../../components/Styles';
import { S3_PATH_IMAGE_HANDLER } from '../../constants';
import { useCitiesTmp } from '../../hooks/useCitiesTmp';
import { getService } from '../../services';
import { useRawQueries } from './hooks/useRawQueries';
const queryPosition = [
    { id: "position_breakfast", name: 'position_breakfast' },
    { id: "position_brunch", name: 'position_brunch' },
    { id: "position_lunch", name: 'position_lunch' },
    { id: "position_dinner", name: 'position_dinner' },
    { id: "position_after_dinner", name: 'position_after_dinner' },
]

const RenderItem = ({ item, cityId, changePosition,sort }) => {

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
                                    Posición
                                </div>
                                <div>
                                    <InputNumber
                                        // value={positionNumbers?.position_default}
                                        value={positionNumbers?.[sort]}
                                        onChange={value => {
                                            setPositionNumbers({ ...positionNumbers, [sort]: value });
                                        }}
                                    />
                                </div>

                            </label>
                        </Col>
                        
                    </Row>
                }
            />
      
        </List.Item>
    );
}

const EstablishmentPositions = ({loadingCities,cities,city_id,setCityId,loadingRawQueries,dataRawQueries,sort,title,changePosition}:any)=>{

    return (<Layout.Content style={{ height: '100%', overflow: 'auto' }}>
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
                                    cities.map(({ id, city_name }, index) =>
                                        <Select.Option key={index} value={id}>
                                            {city_name}
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
                                            sort={sort}
                                        />
                                    )
                                }
                            </List>
                        </Col>
                    </Row>
                </Col>
            </Box>
        </Layout.Content>)
}

const typeCategory =[{
        name: 'Reserva esta noche',
        sort: 'tmp_book_tonight_rank'
    },{
        name: 'Populares',
        sort: 'tmp_popular_rank'
    },{
        name: 'Mesas exclusivas',
        sort: 'tmp_exclusive_tables_rank'
    },{
        name: 'Top Pizzerías',
        sort: 'tmp_top_pizzerias'
    },{
        name: 'Top Hamburgueserías',
        sort: 'tmp_top_hamburgers'
    },{
        name: 'Top Taquerías',
        sort: 'tmp_top_taquerias'
    },
    
]
const EstablishmentsPositionTmp = () => {

    const serviceEstablishment = getService("establishments");

    const [city_id, setCityId] = useState();
    const [position, setPosition] = useState();
    const [cities, loadingCities] = useCitiesTmp();
    const [activeKey, setactiveKey] = useState('0')
    const {dataRawQueries, loadingRawQueries,resetData} = useRawQueries({ city_id, position,sort: typeCategory[activeKey]?.sort  });

    const changePosition = async (establishment, cityId, establishmentId) => {
    
        try{
            serviceEstablishment.patch(establishmentId, {
                    [typeCategory[activeKey]?.sort]: establishment?.[typeCategory[activeKey]?.sort],
                })
                    .then((response) => {
                        
                    })
                    .catch((err) => message.error(err.message));
        } catch (e) {

        }

        // try {
        //     await serviceEstablishmentPositions.create({
        //         position: position.position_default,
        //         position_breakfast: position.position_breakfast,
        //         position_brunch: position.position_brunch,
        //         position_lunch: position.position_lunch,
        //         position_dinner: position.position_dinner,
        //         position_after_dinner: position.position_after_dinner,
        //         establishment_id: establishmentId,
        //         city_id: cityId,
        //     });
        // } catch (e) {
        //     message.error(e.message);
        // }
    }
    console.log('activeKeyactiveKey',activeKey)
    const onchangeTab = (key)=>{
        console.log('onchange tab',key)
        setactiveKey(key-1)
        resetData()
    }
    return (<Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
                <TabsStyled onChange={onchangeTab} destroyInactiveTabPane defaultActiveKey="1">
                    {typeCategory.map((item,index)=>
                        <Tabs.TabPane 
                        // onChange={onchangeTab}
                        
                         destroyInactiveTabPane tab={item?.name} key={`${index + 1}`}>

                        <EstablishmentPositions 
                            loadingCities={loadingCities} 
                            cities={cities} 
                            city_id={city_id} 
                            setCityId={setCityId}
                            loadingRawQueries={loadingRawQueries}
                            dataRawQueries={dataRawQueries}
                            sort={item?.sort}
                            changePosition={changePosition}
                            />
                    </Tabs.TabPane>
                    )}
                    
                    
                </TabsStyled>
            </Layout.Content>
        
    );
}

export default EstablishmentsPositionTmp;