import { Badge, Button, Col, Divider, Image, Input, InputNumber, message, Row, Select, Skeleton, Space, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import DragAndDropUploader from "../../../components/com/DragAndDropUploader";
import { ColorField } from '../../../components/com/fields';
import { FileUploader, SimpleForm } from '../../../components/com/form/';
import GalleryUploader from '../../../components/com/gallery/GalleryUploader';
import { Box } from '../../../components/Styles';
import { S3_PATH_IMAGE_HANDLER, URL_S3 } from '../../../constants';
import { getService } from '../../../services';
import { useAmenities } from '../hooks';


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
const COMERCIAL_CATEGORY = [
    {
        id: "CORPORATE",
        name: "Corporativa"
    },
    {
        id: "AAA",
        name: "AAA"
    },
    {
        id: "AA",
        name: "AA"
    },
    {
        id: "A",
        name: "A"
    }
];
const APPATA_MANU = [
    {
        id: "establishmentCategories",
        name: "categorías propias"
    },
    {
        id: "appartaCategories",
        name: "categorías de apparta"
    },
];

const PAY_COMMISSIONS_FOR = [
    {
        id: 'reservation_num_persons',
        name: 'Comensal'
    },
    {
        id: 'reservation',
        name: 'Reserva'
    },
]

const formatData = (data) => {

    if (data?.special_amenities && typeof data.special_amenities === 'string')
        data.special_amenities = _.map(JSON.parse(data.special_amenities || '[]'), (item) => item?.id)

    if (data?.kitchen_type && typeof data.kitchen_type === 'string')
        data.kitchen_type = _.map(JSON.parse(data.kitchen_type || '[]'), ({ description }) => description)

    if (data?.environment_type && typeof data.environment_type === 'string')
        data.environment_type = _.map(JSON.parse(data.environment_type || '[]'), ({ description }) => description)

    if (data?.recommended_dishes && typeof data.recommended_dishes === 'string')
        data.recommended_dishes = _.map(JSON.parse(data.recommended_dishes || '[]'), ({ description }) => description)

    return data;
};

const Profile = ({ establishmentData, setEstablishmentData }) => {

    const establishmentService = getService("establishments");
    const [amenities, loadingAmenities] = useAmenities();
    const [establishmentWebBanners, setEstablishmentWebBanners] = useState([]);

    const handleUploadFinish = (field, url, file, _id) => {
        establishmentService.patch(_id, {
            [field]: String(url),
        })
            .then((response) => {
                setEstablishmentData({
                    ...response
                });
            })
            .catch((err) => message.error(err.message));
    };

    const handleSubmit = async (err, data, form) => {
        const tempData = establishmentData;

        if (data.special_amenities)
            data.special_amenities = JSON.stringify(_.map(data.special_amenities, (value) => _.find(amenities, ({ id }) => id === value)));
        if (data.kitchen_type)
            data.kitchen_type = JSON.stringify(_.map(data.kitchen_type, (value, index) => ({ id: index, description: value })));
        if (data.environment_type)
            data.environment_type = JSON.stringify(_.map(data.environment_type, (value, index) => ({ id: index, description: value })));
        if (data.recommended_dishes)
            data.recommended_dishes = JSON.stringify(_.map(data.recommended_dishes, (value, index) => ({ id: index, description: value })));

        setEstablishmentData();
        if (err) return message.error(err);
        if (establishmentData.id) {
            await establishmentService.patch(establishmentData.id, data)
                .then((response) => {
                    message.success("Restaurante actualizado!");
                    setEstablishmentData(response);
                })
                .catch(err => {
                    message.error(err.message);
                    setEstablishmentData(tempData);
                });
        }
    };

    const handleSubmitEstablishmentWebBanners = async (files) => {
        const data = {};
        _.forEach(files, ({ fileKey }, index) => Object.assign(data, { [`path_image_${index + 1}`]: fileKey }))
        if (establishmentData.id) {
            await establishmentService.patch(establishmentData.id, data)
                .then((response) => {
                    message.success("Fotos publicadas con exito!");
                    const tempBanners = _.map([1, 2, 3, 4, 5], (value) => ({ path: response?.[`path_image_${value}`] || null }))
                    setEstablishmentWebBanners(tempBanners)
                })
                .catch(err => {
                    message.error(err.message || 'Upp! intenta nuevamente');
                });
        }

    }

    useEffect(() => {
        if (establishmentData?.id) {
            const tempBanners = _.map([1, 2, 3, 4, 5], (value) => ({ path: establishmentData?.[`path_image_${value}`] || null }))
            setEstablishmentWebBanners(tempBanners)
        }
    }, [establishmentData])


    if (establishmentData)
        return (
            <div >
                <Box>
                    <Image.PreviewGroup>
                        <Space size='large'>
                            <Col>
                                <Badge.Ribbon text='Logo' color="purple" placement='start'>
                                    <Image
                                        alt="logo"
                                        width={200}
                                        height={200}
                                        style={{
                                            borderRadius: '50%',
                                        }}
                                        src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                            url: establishmentData.logo_path,
                                            width: 200,
                                            height: 200,
                                        })}`
                                        }
                                        preview={{
                                            src: `${URL_S3}${establishmentData.logo_path}`
                                        }}
                                        fallback="data:image/png;base64,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"
                                    />
                                </Badge.Ribbon>
                                <FileUploader
                                    preview={false}
                                    path={`establishment/${establishmentData.id}/logo_path/`}
                                    name='logo_path'
                                    source='logo_path'
                                    style={{ borderRadius: '0.5rem' }}
                                    title='Logo'
                                    onFinish={(url, file) =>
                                        handleUploadFinish("logo_path", url, file, establishmentData?.id || 1)
                                    }
                                />
                            </Col>
                            <Badge.Ribbon text='Logo cuadraro' color="purple" placement='start'>
                                <Col>
                                    <GalleryUploader
                                        width={200}
                                        height={200}
                                        refresh={(e, response) => {
                                            setEstablishmentData({
                                                ...response
                                            });
                                        }}
                                        size="large"
                                        record={establishmentData}
                                        defaultImage={establishmentData?.logo_squares_path}
                                        source="logo_squares_path"
                                        withCropper={true}
                                        setterVisibleCropper={() => { }}
                                        reference="establishments"
                                        _id={establishmentData?.id}
                                        path={`establishment/${establishmentData.id}/logo_squares/`}
                                    />
                                    {/* <Image
                                        alt="logo_squares"
                                        width={200}
                                        height={200}
                                        src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                            url: establishmentData.logo_squares_path,
                                            width: 200,
                                            height: 200,
                                        })}`
                                        }
                                        preview={{
                                            src: `${URL_S3}${establishmentData.logo_squares_path}`
                                        }}
                                        fallback="data:image/png;base64,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"
                                    /> */}
                                    <FileUploader
                                        preview={false}
                                        path={`establishment/${establishmentData.id}/logo_squares/`}
                                        name='logo_squares_path'
                                        source='logo_squares_path'
                                        style={{ borderRadius: '0.5rem' }}
                                        title='Logo Cuadrado'
                                        onFinish={(url, file) =>
                                            handleUploadFinish("logo_squares_path", url, file, establishmentData.id)
                                        }
                                    />
                                </Col>
                            </Badge.Ribbon>
                            <Badge.Ribbon text='Portada' color="purple" placement='start'>
                                <Col>
                                    <Image
                                        alt="cover"
                                        width={500}
                                        height={200}
                                        src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                            url: establishmentData.cover_path,
                                            width: 500,
                                            height: 200,
                                        })}`
                                        }
                                        preview={{
                                            src: `${URL_S3}${establishmentData.cover_path}`
                                        }}
                                        fallback="data:image/png;base64,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"
                                    />
                                    <FileUploader
                                        preview={false}
                                        path={`establishment/${establishmentData.id}/cover_path/`}
                                        name='cover_path'
                                        source='cover_path'
                                        style={{ borderRadius: '0.5rem' }}
                                        title='Portada'
                                        onFinish={(url, file) =>
                                            handleUploadFinish("cover_path", url, file, establishmentData.id)
                                        }
                                    />
                                </Col>
                            </Badge.Ribbon>
                            <Badge.Ribbon text='Fondo linkTree' color="purple" placement='start'>
                                <Col>
                                    <GalleryUploader
                                        width={200}
                                        height={200}
                                        refresh={(e, response) => {
                                            setEstablishmentData({
                                                ...response
                                            });
                                        }}
                                        size="large"
                                        record={establishmentData}
                                        defaultImage={establishmentData.apparta_menu_linktree_background}
                                        source="apparta_menu_linktree_background"
                                        withCropper={true}
                                        setterVisibleCropper={() => { }}
                                        reference="establishments"
                                        _id={establishmentData?.id}
                                        path={`apparta_menu_linktree_background/${+establishmentData?.id}/`}
                                    />
                                    <FileUploader
                                        preview={false}
                                        path={`establishment/${establishmentData.id}/apparta_menu_linktree_background/`}
                                        name='apparta_menu_linktree_background'
                                        source='apparta_menu_linktree_background'
                                        style={{ borderRadius: '0.5rem' }}
                                        title='Fondo'
                                        allowTypes={[
                                            "image/jpg",
                                            "image/png",
                                            "image/jpeg",
                                            'image/gif']}
                                        onFinish={(url, file) =>
                                            handleUploadFinish("apparta_menu_linktree_background", url, file, establishmentData.id)
                                        }
                                    />
                                </Col>
                            </Badge.Ribbon>
                        </Space>
                    </Image.PreviewGroup>
                    <Divider />
                    <SimpleForm
                        textAcceptButton='Guardar'
                        initialValues={formatData(establishmentData)}
                        noAcceptButtonBlock={true}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            flex={0.5}
                            name='name'
                            label="Nombre"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Nombre es requerido',
                                },
                            ]}
                        />
                        <Select
                            flex={0.25}
                            name='status'
                            label="Estado"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado es requerido',
                                },
                            ]}
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
                        <Select
                            flex={0.25}
                            name='apparta_web_status'
                            label="Apparta web status"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado es requerido',
                                },
                            ]}
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
                        <Select
                            flex={0.25}
                            name='table_management_status'
                            label="TMP status"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado TMP es requerido',
                                },
                            ]}
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
                        <Select
                            flex={0.25}
                            name='mozrest_integration_status'
                            label="Estado integración mozrest"
                            size='large'
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
                        <Select
                            flex={0.25}
                            name='pay_commissions_for'
                            label="Cobro de comisiones por"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Tipo de cobro de comisiones es requerido',
                                },
                            ]}
                        >
                            {
                                _.map(PAY_COMMISSIONS_FOR, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <InputNumber
                            flex={0.25}
                            size='large'
                            label='Minutos mínimos antes de reservar'
                            name='minutes_before_make_reservation'
                            min={15}
                        />
                        <InputNumber
                            flex={0.33}
                            size='large'
                            label='Rating: Del 1 al 5'
                            name='total_rating_score'
                        />
                        <InputNumber
                            flex={0.33}
                            size='large'
                            label='Rating: Numero de personas'
                            name='total_rating_quantity'
                        />
                        <Select
                            flex={0.2}
                            size='large'
                            name='commercial_category'
                            label="Categoría comercial"
                        >
                            {
                                _.map(COMERCIAL_CATEGORY, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <InputNumber
                            flex={0.4}
                            min={1}
                            max={5}
                            size='large'
                            label='Rango de costos (1-5)'
                            name='level_expensive'
                        />
                        <Select
                            flex={0.4}
                            size='large'
                            name='apparta_menu_categories_source'
                            label="Categorías apparta menu"
                        >
                            {
                                _.map(APPATA_MANU, ({ id, name }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {name}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Input
                            flex={0.33}
                            name='sn_facebook'
                            label="FaceBook"
                            size='large'
                        />
                        <Input
                            flex={0.33}
                            name='sn_instagram'
                            label="Instagram"
                            size='large'
                        />
                        <Input
                            flex={0.33}
                            name='sn_tiktok'
                            label="TikTok"
                            size='large'
                        />
                        <Select
                            flex={1}
                            mode="tags"
                            size='large'
                            label="Tipo de cocina"
                            name='kitchen_type'
                        />
                        <Select
                            flex={1}
                            mode="tags"
                            size='large'
                            label="Tipo ambiente"
                            name='environment_type'
                        />
                        <Select
                            flex={1}
                            mode="tags"
                            size='large'
                            label="Platos recomendados"
                            name='recommended_dishes'
                        >
                        </Select>
                        <Select
                            flex={1}
                            mode="multiple"
                            size='large'
                            label="Características espaciales"
                            name='special_amenities'
                            loading={loadingAmenities}
                        >
                            {
                                _.map(amenities, ({ id, description }, index) =>
                                    <Select.Option
                                        key={index}
                                        value={id}
                                    >
                                        {description}
                                    </Select.Option>
                                )
                            }
                        </Select>
                        <Select
                            flex={0.5}
                            name='apparta_menu_linktree_status'
                            label="Estado menu linkTree"
                            size='large'
                            validations={[
                                {
                                    required: true,
                                    message: 'Estado es requerido',
                                },
                            ]}
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
                        <Input
                            flex={0.5}
                            name='apparta_menu_linktree_description'
                            label="Descripción LinkTree"
                            size='large'
                        />

                        {
                            establishmentData?.mozrest_company_integration_response ? (
                                <div flex={1}>
                                    <Typography.Title level={5}>
                                        Link integración mozrest
                                    </Typography.Title>
                                    <Typography.Paragraph copyable>
                                        {
                                            JSON.parse(establishmentData?.mozrest_company_integration_response || {})?.fbInstallLink
                                        }
                                    </Typography.Paragraph>
                                </div>
                            ) : null
                        }

                        <div flex={1}>
                            <Typography.Title level={4}>
                                Antesala web
                            </Typography.Title>
                        </div>

                        <Input
                            flex={0.5}
                            name='lp_main_tittle'
                            label="Titulo"
                            size='large'
                        />
                        <Input
                            flex={0.5}
                            name='lp_main_description'
                            label="Descripción"
                            size='large'
                        />
                        {/* lp_main_status */}
                        <Select
                            flex={1}
                            name='lp_main_status'
                            label="Estado"
                            size='large'
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
                        <ColorField
                            flex={0.5}
                            name="lp_main_background_color"
                            label="Color de fondo"
                            placeholder="lp_main_background_color"
                            initial={establishmentData?.lp_main_background_color || '#7b7b7b'}
                            presetColors={['#fff']}
                        />
                        <ColorField
                            flex={0.5}
                            name="lp_main_text_color"
                            label="Color de texto"
                            placeholder="lp_main_text_color"
                            initial={establishmentData?.lp_main_text_color || '#000000'}
                            presetColors={['#fff']}
                        />
                        <ColorField
                            flex={0.5}
                            name="lp_main_buttons_background_color"
                            label="Color fonde de botones"
                            placeholder="lp_main_buttons_background_color"
                            initial={establishmentData?.lp_main_buttons_background_color || '#9289c2'}
                            presetColors={['#fff']}
                        />
                        <ColorField
                            flex={0.5}
                            name="lp_main_buttons_text_color"
                            label="Color texto de botones"
                            placeholder="lp_main_buttons_text_color"
                            initial={establishmentData?.lp_main_buttons_text_color || '#9289c2'}
                            presetColors={['#fff']}
                        />
                    </SimpleForm >
                </Box>

                <Box style={{ marginTop: '4rem' }}>
                    <Image.PreviewGroup>
                        <Space size='large'>
                            {
                                _.map(establishmentWebBanners, (image, index) =>
                                    image?.fileKey || image?.path ?
                                        (
                                            <Col>
                                                <Image
                                                    alt="logo"
                                                    width={200}
                                                    height={200}
                                                    style={{
                                                        objectFit: 'cover'
                                                    }}
                                                    src={`${S3_PATH_IMAGE_HANDLER}/${window.imageShark({
                                                        url: image?.fileKey || image?.path,
                                                        height: 200,
                                                    })}`
                                                    }
                                                    preview={{
                                                        src: `${URL_S3}${image?.fileKey || image?.path}`
                                                    }}
                                                    fallback="data:image/png;base64,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"
                                                />
                                                {
                                                    !image?.fileKey && (
                                                        <FileUploader
                                                            preview={false}
                                                            path={`establishment/${establishmentData.id}/logo_path/`}
                                                            name={`path_image_${index + 1}`}
                                                            source={`path_image_${index + 1}`}
                                                            style={{ borderRadius: '0.5rem' }}
                                                            title={`Imagen ${index + 1}`}
                                                            onFinish={(url, file) =>
                                                                handleUploadFinish(`path_image_${index + 1}`, url, file, establishmentData?.id)
                                                            }
                                                        />
                                                    )
                                                }
                                            </Col>
                                        ) : null
                                )
                            }

                        </Space>
                    </Image.PreviewGroup>
                    <Row style={{ width: '100%', height: 'auto', marginTop: '4rem' }}>
                        <Col span={24}>
                            <DragAndDropUploader
                                record={''}
                                onFinish={(files) => {
                                    setEstablishmentWebBanners(_.map(files, ({ fileKey }) => ({ fileKey })))
                                }}
                                maxFiles={5}
                                path={''}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Row justify="center" style={{ marginTop: '2rem' }} >
                            <Col span={24} >
                                <Button
                                    disabled={establishmentWebBanners?.length === 0 || !_.some(establishmentWebBanners, (({ fileKey }) => fileKey))}
                                    // loading={ !== 0}
                                    type="primary" style={{ borderRadius: '5px' }}
                                    onClick={() => {
                                        handleSubmitEstablishmentWebBanners(establishmentWebBanners)
                                    }}
                                >
                                    Publicar fotos
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Box>
            </div>
        );
    else
        return (
            <Box>
                <Space size='large'>
                    <Col>
                        <Skeleton.Image active={true} style={{ width: 200, height: 200, borderRadius: '50%', }} />
                    </Col>
                    <Col>
                        <Skeleton.Image active={true} style={{ width: 200, height: 200 }} />
                    </Col>
                    <Col>
                        <Skeleton.Image active={true} style={{ width: 500, height: 200 }} />
                    </Col>
                </Space>
                <Divider />
                <Space direction='vertical' style={{ width: '100%' }} size='large'>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                        <Col span={12}>
                            <Skeleton.Input active={true} size='large' block />
                        </Col>
                    </Row>
                </Space>
            </Box>
        )
}

export default Profile;