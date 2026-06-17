import { useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  Tag,
  LogOut,
  Plus,
  Share2,
  Video,
  AtSign,
  FileText,
  File,
  Link,
  Menu,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { useAuthStore } from "../../store/auth.store";
import { useContentStore } from "../../store/content.store";
import { useTagsStore } from "../../store/tags.store";
import { useUiStore } from "../../store/ui.store";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import type { ContentType } from "../../types/content.types";

import { AddContentModal } from "../../components/modals/AddContentModal";
import { EditContentModal } from "../../components/modals/EditContentModal";
import { DeleteConfirmModal } from "../../components/modals/DeleteConfirmModal";
import { ShareBrainModal } from "../../components/modals/ShareBrainModal";
import { AddTagModal } from "../../components/modals/AddTagModal";

const TYPE_NAV = [
  { type: "youtube" as ContentType, label: "YouTube", icon: Video, color: "text-red-500" },
  { type: "twitter" as ContentType, label: "Twitter", icon: AtSign, color: "text-blue-400" },
  { type: "article" as ContentType, label: "Articles", icon: FileText, color: "text-green-500" },
  { type: "document" as ContentType, label: "Documents", icon: File, color: "text-amber-500" },
  { type: "link" as ContentType, label: "Links", icon: Link, color: "text-violet-400" },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();
  const { filters, setFilter, resetFilters, fetchContent } = useContentStore();
  const { tags, isLoading: tagsLoading, deleteTag } = useTagsStore();
  const { openShareBrain, openAddTag } = useUiStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
    toast.success("Signed out successfully");
  };

  const handleTypeFilter = (type: ContentType) => {
    if (filters.type === type) {
      setFilter("type", "");
    } else {
      setFilter("type", type);
      setFilter("tag", "");
    }
    fetchContent();
    onClose?.();
  };

  const handleTagFilter = (tagId: string) => {
    if (filters.tag === tagId) {
      setFilter("tag", "");
    } else {
      setFilter("tag", tagId);
      setFilter("type", "");
    }
    fetchContent();
    onClose?.();
  };

  const handleAllContent = () => {
    resetFilters();
    fetchContent();
    onClose?.();
  };

  const handleDeleteTag = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteTag(id);
      if (filters.tag === id) {
        setFilter("tag", "");
        fetchContent();
      }
      toast.success("Tag deleted");
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Brainly</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        <button
          onClick={handleAllContent}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
            !filters.type && !filters.tag
              ? "bg-violet-600 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          All Content
        </button>

        <div className="mt-4 mb-1 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            By Type
          </span>
        </div>

        {TYPE_NAV.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => handleTypeFilter(type)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
              filters.type === type
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", color)} />
            {label}
          </button>
        ))}

        <div className="mt-4 mb-1 px-3 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Tags
          </span>
          <button
            onClick={openAddTag}
            className="text-slate-500 hover:text-violet-400 transition-colors"
            title="Add tag"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {tagsLoading ? (
          <div className="flex justify-center py-3">
            <Spinner size="sm" className="border-slate-600 border-t-violet-500" />
          </div>
        ) : tags.length === 0 ? (
          <p className="px-3 text-xs text-slate-600">No tags yet</p>
        ) : (
          tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => handleTagFilter(tag._id)}
              className={cn(
                "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors text-left",
                filters.tag === tag._id
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tag.name}</span>
              </span>
              <button
                onClick={(e) => handleDeleteTag(e, tag._id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all shrink-0"
                title="Delete tag"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          ))
        )}

        <NavLink
          to={ROUTES.TAGS}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mt-1",
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )
          }
          onClick={onClose}
        >
          <Tag className="h-4 w-4 shrink-0" />
          Manage Tags
        </NavLink>
      </nav>

      <div className="border-t border-slate-800 p-4 flex flex-col gap-3">
        <Button
          onClick={openShareBrain}
          variant="secondary"
          size="sm"
          className="w-full gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Share2 className="h-4 w-4" />
          Share Brain
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-semibold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-300 truncate max-w-25">
              {username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { isMobileSidebarOpen, closeMobileSidebar, toggleMobileSidebar } = useUiStore();
  const { fetchContent } = useContentStore();
  const { fetchTags } = useTagsStore();
  const { openAddContent } = useUiStore();

  useEffect(() => {
    fetchContent();
    fetchTags();
  }, [fetchContent, fetchTags]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col h-full shadow-xl">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-xl transition-transform duration-300 lg:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={closeMobileSidebar} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <button onClick={toggleMobileSidebar} className="text-slate-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            <span className="font-bold text-slate-900">Brainly</span>
          </div>
          <Button onClick={openAddContent} size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <AddContentModal />
      <EditContentModal />
      <DeleteConfirmModal />
      <ShareBrainModal />
      <AddTagModal />
    </div>
  );
}
