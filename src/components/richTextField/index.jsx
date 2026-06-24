import React, { useRef, useState } from 'react';
import { Button, Input, Popover, Tabs } from 'antd';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';
import { ALL_EMOJIS, EMOJI_GROUPS } from './emojis';
import { encodeUnicodeForStorage } from './encoding';

const { TabPane } = Tabs;

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

const EMOJI_FONT_FAMILY =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";

const EmojiButton = ({ emoji, onSelect }) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(emoji);
        }}
        style={emojiButtonStyle}
    >
        {emoji}
    </button>
);

const emojiGridProps = {
    onMouseDown: (e) => e.preventDefault(),
    style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 4,
        maxHeight: 220,
        overflowY: 'auto',
    },
};

const EmojiPicker = ({ onSelect }) => {
    const [search, setSearch] = useState('');

    const filteredGroups = EMOJI_GROUPS.map(({ label, emojis }) => ({
        label,
        emojis: emojis.filter((emoji) =>
            search ? emoji.includes(search) || label.toLowerCase().includes(search.toLowerCase()) : true,
        ),
    })).filter(({ emojis }) => emojis.length);

    return (
        <div style={{ width: 320 }}>
            <Input
                size="small"
                placeholder="Buscar emoji..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 8 }}
                allowClear
            />
            {search ? (
                <div {...emojiGridProps}>
                    {ALL_EMOJIS.filter((emoji) => emoji.includes(search)).map((emoji) => (
                        <EmojiButton key={emoji} emoji={emoji} onSelect={onSelect} />
                    ))}
                </div>
            ) : (
                <Tabs size="small" tabPosition="top">
                    {filteredGroups.map(({ label, emojis }) => (
                        <TabPane tab={label} key={label}>
                            <div {...emojiGridProps}>
                                {emojis.map((emoji) => (
                                    <EmojiButton
                                        key={`${label}-${emoji}`}
                                        emoji={emoji}
                                        onSelect={onSelect}
                                    />
                                ))}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            )}
        </div>
    );
};

const emojiButtonStyle = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: 1,
    padding: 4,
    borderRadius: 4,
};

const RichTextField = ({
    value,
    onChange,
    defaultValue,
    height = '200px',
    enableEmojis = false,
    setOptions,
    setDefaultStyle,
    ...props
}) => {
    const editorRef = useRef(null);
    const selectionRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const baseStyle = setDefaultStyle || '';
    const defaultStyle = `${baseStyle} font-family: ${EMOJI_FONT_FAMILY};`.trim();

    const notifyChange = (content) => {
        onChange?.(encodeUnicodeForStorage(content));
    };

    const syncEditorContent = () => {
        const editor = editorRef.current;
        if (editor) {
            notifyChange(editor.getContents(true));
        }
    };

    const saveSelectionRange = () => {
        const editor = editorRef.current;
        if (!editor?.core) return;

        const { core } = editor;
        const wysiwyg = core.context.element.wysiwyg;

        try {
            const range = core.getRange();
            if (wysiwyg.contains(range.startContainer)) {
                selectionRef.current = {
                    sc: range.startContainer,
                    so: range.startOffset,
                    ec: range.endContainer,
                    eo: range.endOffset,
                };
            }
        } catch {
            selectionRef.current = null;
        }
    };

    const restoreSelectionRange = () => {
        const editor = editorRef.current;
        if (!editor?.core) return;

        const saved = selectionRef.current;
        if (saved) {
            try {
                editor.core.setRange(saved.sc, saved.so, saved.ec, saved.eo);
                return;
            } catch {
                // nodos invalidos tras cambios en el DOM
            }
        }

        editor.core.focusEdge(null);
    };

    const insertEmoji = (emoji) => {
        const editor = editorRef.current;
        if (!editor?.insertHTML) {
            setEmojiOpen(false);
            return;
        }

        setEmojiOpen(false);

        requestAnimationFrame(() => {
            restoreSelectionRange();
            editor.core.focus();
            editor.insertHTML(
                `<span style="font-family:${EMOJI_FONT_FAMILY}">${emoji}</span>`,
                true,
                false,
            );
            syncEditorContent();
        });
    };

    const handleEmojiOpenChange = (open) => {
        if (open) {
            saveSelectionRange();
        }
        setEmojiOpen(open);
    };

    const handlePaste = (event, cleanData, maxCharCount) => {
        if (!maxCharCount) return false;

        const plainText = event.clipboardData?.getData('text/plain') || '';
        const textFromHtml = (cleanData || '').replace(/<[^>]*>/g, '').trim();

        if (plainText.trim() && !textFromHtml) {
            return plainText.replace(/\n/g, '<br>');
        }
    };

    return (
        <div className="rich-text-field-emoji" style={{ width: '100%' }}>
            {enableEmojis && (
                <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Popover
                        trigger="click"
                        visible={emojiOpen}
                        onVisibleChange={handleEmojiOpenChange}
                        placement="bottomLeft"
                        content={<EmojiPicker onSelect={insertEmoji} />}
                    >
                        <Button
                            type="default"
                            size="small"
                            disabled={!editorReady}
                            onMouseDown={saveSelectionRange}
                        >
                            😀 Insertar emoji
                        </Button>
                    </Popover>
                    <span style={{ fontSize: 12, color: '#888' }}>
                        También puedes pegar emojis con el teclado
                    </span>
                </div>
            )}
            <SunEditor
                height={height}
                defaultValue={defaultValue || value || ''}
                onChange={notifyChange}
                onPaste={enableEmojis ? handlePaste : undefined}
                onLoad={() => setEditorReady(true)}
                getSunEditorInstance={(instance) => {
                    editorRef.current = instance;
                }}
                setDefaultStyle={defaultStyle}
                setOptions={{
                    codeMirror: CodeMirror,
                    buttonList: defaultButtonList,
                    defaultStyle,
                    ...setOptions,
                }}
                {...props}
            />
            <style>{`
                .rich-text-field-emoji .sun-editor-editable {
                    font-family: ${EMOJI_FONT_FAMILY} !important;
                }
            `}</style>
        </div>
    );
};

export default RichTextField;
