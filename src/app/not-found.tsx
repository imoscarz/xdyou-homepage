import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          页面未找到
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          抱歉，您访问的页面不存在。可能已被移动、删除，或您输入了错误的地址。
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/">
              返回首页
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/news">
              查看新闻
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
