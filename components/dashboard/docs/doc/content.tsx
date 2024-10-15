"use client";

import { useIsSSR } from "@react-aria/ssr";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useTheme } from "next-themes";

export default function DocContent({ doc }: any) {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  function getWrapperElement(): { "data-color-mode"?: "dark" | "light" } {
    if (isSSR) {
      return {};
    }

    return {
      "data-color-mode": theme === "dark" ? "dark" : "light",
    };
  }

  return (
    <div>
      <div className="bg-white"> </div>
      <MarkdownEditor.Markdown
        source={doc.content}
        wrapperElement={getWrapperElement()}
      />
    </div>
  );
}
