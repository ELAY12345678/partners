import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';

const RichTextField = (props) => {
    return (
        <SunEditor
            height="200px"
            setOptions={{
                codeMirror: CodeMirror
            }}
            {...props}
        />
    );
}

export default RichTextField;