'use client';

import './wysiwyg-editor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { Bold, Italic, Underline, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState, useCallback, useEffect } from 'react';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function WysiwygEditor({ content, onChange, placeholder, className }: WysiwygEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading, code, and other features we don't want
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        listItem: false,
        orderedList: false,
        bulletList: false,
      }),
      UnderlineExtension,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[120px] px-3 py-2 border border-input rounded-md ${
          className || ''
        }`,
        'data-placeholder': placeholder || 'Start typing...',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const openLinkDialog = useCallback(() => {
    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
    const selectedText = editor?.state.doc.textBetween(from, to, ' ');
    const existingLink = editor?.getAttributes('link');

    setLinkText(selectedText || '');
    setLinkUrl((existingLink && existingLink.href) || '');
    setLinkDialogOpen(true);
  }, [editor]);
  const setLink = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;

    if (linkUrl) {
      // If text is selected or provided, replace/insert it
      if (linkText && (from !== to || linkText)) {
        editor
          .chain()
          .focus()
          .insertContentAt({ from, to }, `<a href="${linkUrl}">${linkText}</a>`)
          .run();
      } else {
        // Just set link on selected text
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
    } else {
      // Remove link
      editor.chain().focus().unsetLink().run();
    }

    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [editor, linkUrl, linkText]);

  if (!editor) {
    return <div className='min-h-[120px] border border-input rounded-md animate-pulse bg-muted' />;
  }

  return (
    <div className='w-full'>
      {/* Toolbar */}
      <div className='flex items-center gap-1 p-2 border border-b-0 border-input rounded-t-md bg-muted/50'>
        <Button
          type='button'
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size='sm'
          onClick={toggleBold}
          className='h-8 w-8 p-0'
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size='sm'
          onClick={toggleItalic}
          className='h-8 w-8 p-0'
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size='sm'
          onClick={toggleUnderline}
          className='h-8 w-8 p-0'
        >
          <Underline className='h-4 w-4' />
        </Button>
        <div className='h-6 w-px bg-border mx-1' />
        <Button
          type='button'
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size='sm'
          onClick={openLinkDialog}
          className='h-8 w-8 p-0'
        >
          <LinkIcon className='h-4 w-4' />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className='border-t-0 rounded-t-none' />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='link-text'>Link Text</Label>
              <Input
                id='link-text'
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder='Enter link text'
              />
            </div>
            <div>
              <Label htmlFor='link-url'>URL</Label>
              <Input
                id='link-url'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder='https://example.com'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={setLink}>{linkUrl ? 'Add Link' : 'Remove Link'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
