"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import { useRef, useState } from "react";
import { Button, Flex, Menu } from "@chakra-ui/react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdCode,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdArrowDropDown,
} from "react-icons/md";

type Props = {
  //   content: string;
  onChange: (html: string) => void;
  onUploadChange?: (uploaded: string[]) => void;
};
export default function TipTapEditor({ onChange, onUploadChange }: Props) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      CodeBlock,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);

      const used = Array.from(
        html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)
      ).map((match) => match[1]);

      onUploadChange?.([...new Set([...uploadedImages, ...used])]);
    },
  });
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      editor?.chain().focus().setImage({ src: data.url }).run();
      const updated = [...uploadedImages, data.url];
      setUploadedImages(updated);
      onUploadChange?.(updated);
    }
  };
  return (
    <>
      <Flex direction={"column"} width={"full"} borderWidth={"1px"}>
        <Flex direction={"row"}>
          <Button
            variant={"ghost"}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Gambar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            hidden
          />
          <Button
            variant={"ghost"}
            colorScheme={editor?.isActive("bold") ? "blue" : undefined}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            Bold
          </Button>
          <Button
            variant={"ghost"}
            colorScheme={editor?.isActive("italic") ? "blue" : undefined}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            Italic
          </Button>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant={"ghost"} border={"none"}></Button>
            </Menu.Trigger>
          </Menu.Root>
        </Flex>
        <EditorContent editor={editor} className="h-full" />
      </Flex>
    </>
  );
}
