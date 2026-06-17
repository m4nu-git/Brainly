import { useEffect, useCallback, useRef } from "react";
import { Plus, Share2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

import { ContentCard } from "../components/cards/ContentCard";
import { ContentCardSkeleton } from "../components/cards/ContentCardSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useContentStore } from "../store/content.store";
import { useUiStore } from "../store/ui.store";

export function Dashboard() {
  const { items, filters, isLoading, error, hasMore, fetchContent, setFilter, resetFilters, nextPage, prevPage } =
    useContentStore();
  const { openAddContent, openShareBrain } = useUiStore();

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchContent();
  }, [filters.page, filters.type, filters.tag, fetchContent]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        setFilter("search", value);
        fetchContent();
      }, 400);
    },
    [setFilter, fetchContent]
  );

  const handleClearSearch = () => {
    setFilter("search", "");
    fetchContent();
    const input = document.getElementById("search-input") as HTMLInputElement;
    if (input) input.value = "";
  };

  const activeFilterLabel = () => {
    if (filters.type) return `Type: ${filters.type}`;
    if (filters.tag) return "Tag filtered";
    return null;
  };

  const filterLabel = activeFilterLabel();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 px-6 py-4 hidden lg:flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            id="search-input"
            placeholder="Search your brain..."
            className="pl-9 pr-8 bg-white"
            onChange={handleSearchChange}
          />
          {filters.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {filterLabel && (
            <div className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700 font-medium">
              {filterLabel}
              <button
                onClick={() => {
                  resetFilters();
                  fetchContent();
                }}
                className="hover:text-violet-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <Button variant="outline" onClick={openShareBrain} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Brain
          </Button>
          <Button onClick={openAddContent} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 lg:px-6 py-6">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-4 text-sm mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={filters.search || filters.type || filters.tag ? "No results found" : "No content yet"}
            description={
              filters.search || filters.type || filters.tag
                ? "Try adjusting your filters or search query."
                : "Start building your second brain by adding your first bookmark."
            }
            showAction={!filters.search && !filters.type && !filters.tag}
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && items.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={filters.page === 1}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-slate-500 font-medium">Page {filters.page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                nextPage();
                fetchContent();
              }}
              disabled={!hasMore}
              className="gap-1.5"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
