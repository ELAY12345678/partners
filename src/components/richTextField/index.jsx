import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';

const defaultButtonList = [
    ['undo', 'redo'],
    ['formatBlock', 'fontSize'],
    ['bold', 'underline', 'italic', 'strike'],
    ['fontColor', 'hiliteColor'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'list', 'lineHeight'],
    ['link'],
    ['codeView', 'preview', 'fullScreen'],
];

const RichTextField = ({
    value,
    onChange,
    defaultValue,
    height = '200px',
    setOptions,
    ...props
}) => {
    return (
        <SunEditor
            height={height}
            defaultValue={defaultValue || value || ''}
            onChange={(content) => onChange?.(content)}
            setOptions={{
                codeMirror: CodeMirror,
                buttonList: defaultButtonList,
                ...setOptions,
            }}
            {...props}
        />
    );
};

export default RichTextField;
