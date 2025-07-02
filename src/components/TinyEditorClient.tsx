"use client";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditorClient({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Editor
      apiKey="b91fiejabhuvspq4vrw3j0chvds7dfax72i01ewvbdis6zda"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        width: "100%",
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic underline | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help | image media link",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        automatic_uploads: true,
        images_reuse_filename: false,
        // @ts-ignore: TinyMCE v7 expects 4 args, types still assume v6
        images_upload_url: "/api/upload",
      }}
    />
  );
}
