"use client";

import MarkdownEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";

export default function DocContent({ doc }: any) {
  const { theme } = useTheme();

  return (
    <div data-color-mode={theme === "dark" ? "dark" : "light"}>
      <MarkdownEditor.Markdown source={doc.content} />
    </div>
  );
}
