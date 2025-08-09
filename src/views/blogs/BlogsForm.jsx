import React, { useEffect, useRef } from 'react';
import { SimpleForm } from '../../components/com/form/SimpleForm';
import { useNavigate } from "react-router-dom";
import { Input, Layout, message, Row, Select, Form, Col, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

import SunEditor from 'suneditor-react'
import plugins from 'suneditor/src/plugins'
import CodeMirror from 'codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/lib/codemirror.css'
import 'suneditor/dist/css/suneditor.min.css'
import _ from 'lodash';

import { onUploadFileVersionHurgot } from '../../utils/FileUploader'
import { useBlog } from './lib/useBlog';
import { FileUploader } from '../../components/com/form/';
import { getService } from '../../services';
import GalleryUploader from '../../components/com/gallery/GalleryUploader';


const STATUS = [
    {
        id: "published",
        name: "Publicado",
    },
    {
        id: "draft",
        name: "Borrador",
    },
    {
        id: "deleted",
        name: "Inactivo",
    },
];


const revatidateStaticBlogInWebSite = ({ slug }) => {

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`https://www.apparta.co/api/revalidate-static-blog?blogSlug=${slug}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => message.error('error', error?.message));

}

const BlogEditor = (props) => {

    const { value, onChange } = props;
    const editor = useRef();

    const getSunEditorInstance = (sunEditor) => {
        editor.current = sunEditor
    }

    function onImageUploadBefore() {
        return (files, _info, uploadHandler) => {
            (async () => {
                await onUploadFileVersionHurgot(
                    files,
                    _.merge(
                        {},
                        props?.fileName ? { name: props?.fileName } : {},
                        props?.filePath ? { path: props?.filePath } : {},
                        props?.fileMatch ? { validate: { match: props?.fileMatch } } : {},
                        props?.fileMaxSize
                            ? { validate: { maxSize: props?.fileMaxSize } }
                            : {},
                        { onProgress: () => { } }
                    )
                ).subscribe({
                    next: async (files) => {
                        const res = {
                            result: [
                                {
                                    url: `https://d110hltguvwo1i.cloudfront.net/${window.imageSharkOriginSize({ url: files?.[0]?.fileKey })}`,
                                    name: "thumbnail",
                                },
                            ],
                        };

                        uploadHandler(res);
                    },
                    error: (error) => {
                        // setProgress(0);
                        uploadHandler();
                        message.error(error?.message || 'Upps! intenta nuevamente');
                    },
                })

            })();

            // called here for stop double image
            uploadHandler();
        };
    }

    return (

        <SunEditor
            flex={1}
            name="content"
            label="Cuerpo del blog"
            defaultValue={value}
            getSunEditorInstance={getSunEditorInstance}
            onImageUploadBefore={onImageUploadBefore()}
            height="500px"
            setOptions={{
                // plugins: [font] set plugins, all plugins are set by default
                // Other option
                plugins: plugins,
                codeMirror: CodeMirror,
                mode: 'classic',
                //katex: katex,
                buttonList: [
                    ['undo', 'redo'],
                    [
                        ':p-More Paragraph-default.more_paragraph',
                        'fontSize',
                        'font',
                        'formatBlock',
                        'paragraphStyle',
                        'blockquote',
                    ],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['fullScreen', 'showBlocks', 'codeView', 'preview'],
                    //['-right', ':r-More Rich-default.more_plus', 'table', 'math', 'imageGallery'],
                    ['-right', 'image', 'video', 'audio', 'link'],
                ],
            }}
            onChange={(content) => {
                onChange(content)
            }}
        />
    )
}

const ImageInput = (props) => {

    const { value, onChange, } = props;

    return (
        <Col flex={1}>
            {
                value && (
                    <GalleryUploader
                        height={200}
                        refresh={(e, response) => {
                            onChange(null);
                        }}
                        size="large"
                        record={{ image: value }}
                        defaultImage={value}
                        source="image"
                        withCropper={true}
                        setterVisibleCropper={() => { }}
                        reference="establishments"
                        path={`ppartaWeb/static/blogs/`}
                    />
                )
            }
            <FileUploader
                preview={false}
                path={`AppartaWeb/static/blogs/`}
                name='banner_path'
                source='banner_path'
                style={{ borderRadius: '0.5rem' }}
                onFinish={(url, file) =>
                    onChange(url)
                }
            />
        </Col>
    )
}

const BlogsForm = (props) => {
    const navigate = useNavigate();
    const { id } = props;
    const blogsService = getService("blog-posts");

    const { isLoading, blogData } = useBlog(id);

    const [form] = Form.useForm();
    const status = Form.useWatch('status', form);

    const handleSubmit = async (errors, data, form) => {
        try {
            const formatData = {
                ...data,
                keywords: data?.keywords?.length ? data?.keywords?.join(', ') : undefined,
            };
            if (id) {
                const updatedBlog = await blogsService.patch(id, { ...formatData });
                message.success("Blog actualizado exitosamente!");
                revatidateStaticBlogInWebSite({  slug: updatedBlog?.slug });
            } else {
                const newBlog = await blogsService.create({ ...formatData });
                message.success("Blog creado exitosamente!")
                revatidateStaticBlogInWebSite({ slug: newBlog?.slug });
                navigate(`/dashboard/management/blogs/${newBlog?.id}`);
            }

        } catch (error) {
            message.error(error?.message)
        }

    };

    useEffect(() => {
        if (blogData) {
            form.setFieldsValue({
                ...blogData,
                keywords: blogData?.keywords?.trim().length ? _.split(blogData?.keywords, ', ') : []
            })
        }
    }, [blogData])


    return (
        <Layout.Content style={{ height: '100%', overflow: 'auto', padding: '2rem' }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to='/dashboard/management/blogs'>Blogs Apparta</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{blogData?.title}</Breadcrumb.Item>
            </Breadcrumb>
            <Row style={{ padding: '2rem', background: 'white', borderRadius: '0.5rem', marginTop: '20px' }}>
                <SimpleForm
                    allowNull
                    form={form}
                    onSubmit={handleSubmit}
                    textAcceptButton={id ? "ACTUALIZAR" : "CREAR"}
                >
                    {/* <Input
                        size="large"
                        flex={0.5}
                        placeholder="Nuevo blog"
                        label="Slug"
                        name="slug"
                    /> */}

                    <Input
                        size="large"
                        flex={0.5}
                        placeholder="Nuevo blog"
                        label="Titulo"
                        name="title"
                        validations={[
                            {
                                required: true,
                                message: `Nombre es requerido`
                            }
                        ]}
                    />

                    <Select
                        flex={0.5}
                        name='status'
                        label="Estado"
                        size='large'
                        validations={[
                            {
                                required: true,
                                message: `Estado es requerido`
                            }
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
                        flex={1}
                        mode="tags"
                        size='large'
                        label="Palabras claves"
                        name='keywords'
                        validations={[
                            {
                                required: status === 'published',
                                message: `Palabras claves son requerido`
                            }
                        ]}
                    />

                    <ImageInput
                        size="large"
                        flex={1}
                        placeholder="Nuevo blog"
                        label="Portada"
                        name="image"
                        validations={[
                            {
                                required: status === 'published',
                                message: `Portada es requerido`
                            }
                        ]}
                    />
                    <Input.TextArea
                        autoSize
                        flex={1}
                        size="large"
                        placeholder="Descripción"
                        label="Descripción"
                        name="description"
                        validations={[
                            {
                                required: status === 'published',
                                message: `Descripción es requerido`
                            }
                        ]}
                    />

                    {
                        !isLoading && (
                            <BlogEditor
                                flex={1}
                                name="content"
                                validations={[
                                    {
                                        required: status === 'published',
                                        message: `El contenido es requerido`
                                    }
                                ]}
                            />
                        )
                    }
                </SimpleForm>
            </Row>
        </Layout.Content>
    )
}

export default BlogsForm;