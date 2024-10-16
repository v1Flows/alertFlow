"use client";

import { useIsSSR } from "@react-aria/ssr";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";

export default function DocContent({ doc }: any) {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <div data-color-mode={theme === "light" || isSSR ? "white" : "dark"}>
      <MarkdownEditor.Markdown source={doc.content} />
    </div>
  );
}
