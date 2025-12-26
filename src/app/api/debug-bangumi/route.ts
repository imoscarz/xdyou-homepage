import { NextResponse } from "next/server";

import { getBangumiCollections } from "@/lib/bangumi";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const collections = await getBangumiCollections(
      env.bangumiUsername,
      3 // watching
    );

    const debug = collections.slice(0, 3).map(c => ({
      id: c.subject.id,
      name: c.subject.name,
      name_cn: c.subject.name_cn,
      collectionTags: c.tags,
      subjectTags: c.subject.tags,
      subjectTagsLength: c.subject.tags?.length || 0,
      hasSubjectTags: !!c.subject.tags,
    }));

    return NextResponse.json({
      total: collections.length,
      samples: debug,
      envMaxTags: env.bangumiMaxTags,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
