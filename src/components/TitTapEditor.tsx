"use client";
import { useEditor, EditorContent } from "@tiptap/react";
// import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef, useState } from "react";
import { Button, Flex } from "@chakra-ui/react";
// import { useEffect } from "react";

type Props = {
  //   content: string;
  onChange: (html: string) => void;
  onUploadChange?: (uploaded: string[]) => void;
};
export default function TipTapEditor({ onChange, onUploadChange }: Props) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [StarterKit, Image],
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
        </Flex>
        <EditorContent editor={editor} className="h-full" />
      </Flex>
    </>
  );
}
