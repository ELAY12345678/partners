import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES";
import { message, Row, Button, Drawer, Image, Tag, Select, DatePicker } from 'antd';

import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

import { Grid } from '../../components/com';
import { SimpleForm } from '../../components/com/form/index';
import { getService } from '../../services';
import AsyncButton from '../../components/asyncButton';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../constants';
import { useCities } from '../../hooks/useCities';
import { RoundedButton } from '../../components/com/grid/Styles';

const STATUS = [
    {
        id: "active",
        name: "Active",
    },
    {
        id: "inactive",
        name: "Inactive",
    },
];


const columns = ({ cities, banners }) => [
    {
        dataIndex: "id",
        key: "id",
        title: "Id",
        sorter: true,
    },
    {
        dataIndex: "menu_banner_id",
        key: "menu_banner_id",
        title: "Banner",
        sorter: true,
        render: (value) => _.find(banners, ({ id }) => id === value)?.name || value
    },
    // {
    //     dataIndex: "banner",
    //     title: "Foto",
    //     render: (value) =>
    //         value?.banner_gallery?.path && <Image
    //             size="large"
    //             alt="Banner"
    //             src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
    //                 url: value.banner_gallery.path,
    //                 width: 90,
    //                 height: 35,
    //             })}`
    //             }
    //             preview={{
    //                 src: `${URL_S3}${value.banner_gallery.path}`
    //             }}
    //         />
    // },
    {
        dataIndex: "date_time_start",
        key: "date_time_start",
        title: "Fecha Inicio",
        sorter: true,
        render: (value) => moment(value).format('YYYY-MM-DD h:mm a'),
    },
    {
        dataIndex: "date_time_end",
        key: "date_time_end",
        title: "Fecha Fin",
        sorter: true,
        render: (value) => moment(value).format('YYYY-MM-DD h:mm a'),

    },
    {
        dataIndex: "city_id",
        key: "city_id",
        title: "Ciudad",
        render: (value) => _.find(cities, ({ id }) => value === id)?.name || value
    },
    {
        dataIndex: "status",
        title: "Estado",
        sorter: true,
        render: (value) => value === 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
];

const BannersSchedule = ({ banners, loadingBanners }) => {

    const bannerSchedule = getService('menu-banner-schedule');

    const [updateSource, setUpdateSource] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedBannerProgramming, setSelectedBannerProgramming] = useState();
    const [selectedCityId, setSelectedCityId] = useState();

    const [cities, loadingCities] = useCities();


    const handleSubmit = async (err, data, form) => {
        if (err) return message.error(err);

        if (data.date_time_start)
            data.date_time_start = moment(data.date_time_start).utc().format();

        if (data.date_time_end)
            data.date_time_end = moment(data.date_time_end).utc().format();

        if (!selectedBannerProgramming) {
            await bannerSchedule.create({
                ...data
            })
                .then(() => {
                    message.success("Programación Creada!");
                    setDrawerVisible(false);
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        } else {
            await bannerSchedule.patch(selectedBannerProgramming.id, { ...data })
                .then(() => {
                    message.success("Programación actualizada!");
                    setDrawerVisible(false);
                    setSelectedBannerProgramming();
                    setUpdateSource(!updateSource);
                })
                .catch(err => message.error(err.message));
        }
    };

    const onEdit = (source) => {
        setSelectedBannerProgramming({
            ...source,
            date_time_start: moment(source.date_time_start),
            date_time_end: moment(moment(source.date_time_end)),
        });
        setDrawerVisible(true)
    };

    const onRemove = async ({ id }) => {
        await bannerSchedule.remove(id)
            .then(() => {
                message.success("Programación Eliminada!");
                setUpdateSource(!updateSource);
            })
            .catch(err => message.error(err.message));
    };

    return (
        <>
            <Grid
                filterDefaultValues={{
                    city_id: selectedCityId,
                    $sort: {
                        id: -1
                    }
                }}
                columns={[
                    ...columns({ cities, banners }),
                    {
                        title: "Acciones",
                        dataIndex: 'id',
                        render: (id, record) => {
                            return (
                                <Row>
                                    <Button
                                        type="text"
                                        onClick={() => onEdit(record)}
                                        icon={<AiOutlineEdit />}
                                    />
                                    <AsyncButton
                                        type="link"
                                        onClick={() => onRemove({ id })}
                                        icon={<AiOutlineDelete />}
                                        confirmText="Desea eliminar?"
                                    >
                                    </AsyncButton>
                                </Row>
                            );
                        },
                    }
                ]
                }
                source="menu-banner-schedule"
                actions={{}}
                updateSource={updateSource}
                extra={
                    <>
                        <RoundedButton
                            icon={<AiOutlinePlus />}
                            type={"primary"}
                            onClick={() => setDrawerVisible(true)}
                        >
                            Agregar
                        </RoundedButton>
                    </>
                }
                title={
                    <Select
                        allowClear
                        placeholder='Ciudad'
                        loading={loadingCities}
                        onChange={(value) => setSelectedCityId(value)}
                        onClear={() => setSelectedCityId()}
                        style={{ width: '15rem' }}
                    >
                        {
                            _.map(cities, ({ id, name }, index) =>
                                <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            )
                        }
                    </Select>
                }
            />
            {
                drawerVisible
                &&
                <Drawer
                    title={
                        'Programar Banner en Apparta Menu'
                    }
                    placement="right"
                    visible={drawerVisible}
                    onClose={() => {
                        setDrawerVisible(false);
                        setSelectedBannerProgramming(undefined);
                    }}
                >
                    <SimpleForm
                        scrollToFirstError
                        allowNull={true}
                        initialValues={selectedBannerProgramming}
                        textAcceptButton={'Guardar'}
                        onSubmit={handleSubmit}
                    >
                        <Select
                            flex={1}
                            name='menu_banner_id'
                            label="Banner"
                            size='large'
                            validations={[{
                                required: true,
                                message: `Banner es requerido`,
                            }]}
                            loading={loadingBanners}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                _.map(banners, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <DatePicker
                            flex={1}
                            locale={locale}
                            showTime
                            size='large'
                            name='date_time_start'
                            label="Fecha inicio"
                            use12Hours={true}
                            // format={format}
                            secondStep={60}
                            validations={[{
                                required: true,
                                message: `Fecha Inicio es requerida`
                            }]}
                        />
                        <DatePicker
                            flex={1}
                            locale={locale}
                            showTime
                            size='large'
                            name='date_time_end'
                            label="Fecha fin"
                            use12Hours={true}
                            // format={format}
                            secondStep={60}
                            validations={[{
                                required: true,
                                message: `Fecha Fin es requerida`
                            }]}
                        />
                        <Select
                            flex={1}
                            name='city_id'
                            label="Ciudad"
                            size='large'
                            allowClear
                        >
                            {
                                _.map(cities, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            flex={1}
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[{
                                required: true,
                                message: `Estado es requerido`
                            }]}
                        >
                            {
                                _.map(STATUS, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </SimpleForm>
                </Drawer>
            }
        </>
    )
}

export default BannersSchedule;