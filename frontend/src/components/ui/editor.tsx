'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './button';
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface EditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    isInternalMode?: boolean;
}

export function Editor({ value, onChange, placeholder, isInternalMode }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Write a reply...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose max-w-none w-full outline-none min-h-[120px] p-4 text-sm ${isInternalMode ? 'text-yellow-600 dark:text-yellow-500' : 'text-[#F0ECE6]'}`,
            },
        },
    });

    // Handle external value changes (like when switching tickets or clearing)
    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className={`border rounded-lg overflow-hidden flex flex-col ${isInternalMode ? 'border-yellow-600 bg-yellow-500/10' : 'border-[#64290C] bg-[#1f1209]'}`}>
            <div className={`flex items-center gap-1 border-b p-2 ${isInternalMode ? 'border-yellow-600/50 bg-yellow-500/20' : 'border-[#64290C] bg-[#190F0B]'}`}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-[#64290C] text-[#F0ECE6]' : 'text-[#8a7060]'}`}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-[#64290C] text-[#F0ECE6]' : 'text-[#8a7060]'}`}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-[1px] h-4 bg-[#64290C] mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-[#64290C] text-[#F0ECE6]' : 'text-[#8a7060]'}`}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-[#64290C] text-[#F0ECE6]' : 'text-[#8a7060]'}`}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-[#64290C] text-[#F0ECE6]' : 'text-[#8a7060]'}`}
                >
                    <Quote className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
