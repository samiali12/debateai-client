"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Chat", path: "" },
  { label: "Analytics", path: "/analytics" },
  { label: "Consensus", path: "/consensus" },
];

interface DebateSubNavProps {
  id: number;
}

export default function DebateSubNav({ id }: DebateSubNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-3 px-4 py-2 border-b bg-white/10 backdrop-blur-sm m-2 rounded-xl">
      {tabs.map((t) => {
        const active =
          pathname.endsWith(t.path) || pathname.endsWith(`/${t.path}`);

        return (
          <Button
            key={t.path}
            onClick={() => router.push(`/debates/${id}${t.path ? t.path : ""}`)}
            variant={active ? "default" : "outline"}
            className={`rounded-xl ${
              active ? "" : "bg-white/20 backdrop-blur"
            }`}
          >
            {t.label}
          </Button>
        );
      })}
    </div>
  );
}
