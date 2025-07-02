"use client";
import dynamic from "next/dynamic";

const TinyEditorClient = dynamic(() => import("./TinyEditorClient"), {
  ssr: false,
});

export default TinyEditorClient;
