import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { formatRelativeTime, type GitHubCommit } from "@/lib/github";

type DocLastEditProps = {
  lastCommit: GitHubCommit;
  slug: string;
  docsRepo: {
    owner: string;
    name: string;
    branch: string;
  };
  locale?: string;
};

/**
 * 文档最后编辑信息组件
 * 显示最后一次编辑的时间和编辑者信息
 */
export default function DocLastEdit({
  lastCommit,
  slug,
  docsRepo,
  locale = "zh-CN",
}: DocLastEditProps) {
  const author = lastCommit.author;
  const commitDate = lastCommit.commit.author.date;
  const relativeTime = formatRelativeTime(commitDate, locale);
  const githubUrl = `https://github.com/${docsRepo.owner}/${docsRepo.name}/blob/${docsRepo.branch}/contents/docs/${slug}.md`;

  return (
    <div className="text-muted-foreground flex items-center gap-3 text-sm">
      <span>最后更新：</span>

      {author ? (
        <Link
          href={author.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <Image
            src={author.avatar_url}
            alt={author.login}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="font-medium">{author.login}</span>
        </Link>
      ) : (
        <span className="font-medium">{lastCommit.commit.author.name}</span>
      )}

      <span>•</span>

      <Link
        href={lastCommit.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
        title={new Date(commitDate).toLocaleString(locale)}
      >
        {relativeTime}
      </Link>

      <span>•</span>

      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
      >
        <Icons.externalLink className="h-3 w-3" />
        <span>在Github上查看</span>
      </Link>
    </div>
  );
}
