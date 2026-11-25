"use client";

import { useParams } from "next/navigation";
import { NoticeDetail } from "@/components/site/NoticePages";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <NoticeDetail kind="missing" id={id} />;
}
