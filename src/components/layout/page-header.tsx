/**
 * 页面头部组件
 * 提供统一的页面标题和描述布局
 */

import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY } from "@/data";

interface PageHeaderProps {
  title: string;
  description?: string;
  delay?: number;
  children?: React.ReactNode;
}

/**
 * 标准页面头部
 * 包含标题、描述和可选的额外内容
 */
export function PageHeader({
  title,
  description,
  delay = BLUR_FADE_DELAY,
  children,
}: PageHeaderProps) {
  return (
    <section className="space-y-4">
      <BlurFade delay={delay}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </BlurFade>
    </section>
  );
}

/**
 * 带额外操作的页面头部
 * 标题和描述在左侧，额外内容在右侧
 */
export function PageHeaderWithActions({
  title,
  description,
  delay = BLUR_FADE_DELAY,
  actions,
}: PageHeaderProps & { actions?: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <BlurFade delay={delay}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </BlurFade>
    </section>
  );
}
