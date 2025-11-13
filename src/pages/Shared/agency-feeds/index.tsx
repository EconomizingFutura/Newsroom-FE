import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { agencies } from "@/components/agency/agency-data";
import { AgencyCard } from "@/components/agency/agency-card";
import { cn } from "@/components/ui/utils";
import "./agency-feeds.css";

const AgencyFeedsPage: React.FC = () => {
  // Simple client-side filtering by name
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agencies;
    return agencies.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <main className="mx-auto w-full bg-[#F6FAF6] min-h-full  px-6 py-6 md:py-10">
      {/* Header */}
      <header className="mb-6 md:mb-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-[#101828] font-bold text-[24px]">
              Agency Feeds
            </h1>
            <p className="text-[#4A5565] h-10 items-center leading-5 tracking-wide font-normal text-[14px]">
              Launch trusted newsrooms in a new tab. No iframes, no blockers—
              just one-click access.{" "}
            </p>
          </div>

          <div className="flex items-center hidden gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggested
            </Button>
          </div>
        </div>
        <Card className="mt-4 border-border bg-[#ffffff] shadow-[0px_2px_10px_0px_#959DA533] p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-primary">
              Due to security policies, embedded sites may be blocked. Use the
              curated buttons below—each opens securely in a new window.
            </p>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agencies..."
                className="pl-9"
                aria-label="Search news agencies"
              />
            </div>
          </div>
        </Card>
      </header>

      {/* Grid */}
      <section
        aria-label="News agency list"
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
          "motion-safe:animate-fade-in-up"
        )}
      >
        {filtered.map((agency, i) => (
          <AgencyCard key={agency.id} agency={agency} index={i} />
        ))}
      </section>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        Tip: Cmd/Ctrl + Click opens in a background tab. All links use{" "}
        <code>rel="noopener noreferrer"</code> for safety.
      </div>
    </main>
  );
};

export default AgencyFeedsPage;
