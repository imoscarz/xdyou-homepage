"use client";

import DocToc from "@/components/project/doc-toc";
import { CustomReactMarkdown } from "@/components/react-markdown";
import { Card, CardContent } from "@/components/ui/card";

type DocContentProps = {
  content: string;
  dict: {
    toc: string;
  };
};

export default function DocContent({ content, dict }: DocContentProps) {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <CustomReactMarkdown>{content}</CustomReactMarkdown>
          </CardContent>
        </Card>
      </div>

      <DocToc content={content} dict={dict} />
    </div>
  );
}
