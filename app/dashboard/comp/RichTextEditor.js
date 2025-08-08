"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function RichTextEditor({ onChange, initialValue }) {
  return (
    <Editor
      apiKey="d8n8zno16rc0vaxqava3ayv2hemlt6gioxe3rkf924zt26lm"
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: false,
        placeholder: "Buraya yazabilirsiniz...",
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
          "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
          "insertdatetime", "media", "table", "code", "help", "wordcount"
        ],
        toolbar:
          "undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code",
        branding: false,
        content_style:
          "body { background-color: #f4f4f4; color: #000; font-family:Helvetica,Arial,sans-serif; font-size:14px }"
      }}

      onEditorChange={(value) => {
        if (onChange) {
          onChange(value); 
        }
      }}
    />
  );
}