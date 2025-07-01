// components/TiptapEditor.tsx
"use client";

import { Button, HStack, Input } from "@chakra-ui/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import { useRef } from "react";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Bold,
      Italic,
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) editor?.chain().focus().setImage({ src: data.url }).run();
  };

  return (
    <>
      <HStack mb={2} gap={2}>
        <Button onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          UL
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          OL
        </Button>
        <Button onClick={() => fileInputRef.current?.click()}>Upload</Button>
        <Input
          type="file"
          accept="image/*"
          display="none"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }}
        />
      </HStack>
      <EditorContent
        editor={editor}
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
        }}
      />
    </>
  );
}
