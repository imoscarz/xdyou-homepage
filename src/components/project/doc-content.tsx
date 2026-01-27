"use client";

import DocToc from "@/components/project/doc-toc";
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
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </CardContent>
        </Card>
      </div>

      <DocToc content={content} dict={dict} />
    </div>
  );
}
