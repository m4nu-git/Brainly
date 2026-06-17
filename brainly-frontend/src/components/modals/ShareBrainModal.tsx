import { useState } from "react";
import { toast } from "sonner";
import { Copy, Share2, X, CheckCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { brainService } from "../../services/api/brain.service";
import { useUiStore } from "../../store/ui.store";

export function ShareBrainModal() {
  const { isShareBrainOpen, closeShareBrain } = useUiStore();
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareHash ? `${window.location.origin}/brain/${shareHash}` : null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data } = await brainService.shareBrain({ share: true });
      if (data.hash) {
        setShareHash(data.hash);
        toast.success("Share link generated!");
      }
    } catch {
      toast.error("Failed to generate share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      await brainService.shareBrain({ share: false });
      setShareHash(null);
      toast.success("Share link revoked");
    } catch {
      toast.error("Failed to revoke share link");
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  const handleClose = () => {
    setShareHash(null);
    setCopied(false);
    closeShareBrain();
  };

  return (
    <Dialog open={isShareBrainOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 mb-2">
            <Share2 className="h-5 w-5 text-violet-600" />
          </div>
          <DialogTitle>Share Your Brain</DialogTitle>
          <DialogDescription>
            Generate a public link to share your entire second brain with anyone. They can view but not edit.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {!shareHash ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-sm text-slate-500 text-center">
                No active share link. Generate one to share your brain publicly.
              </p>
              <Button onClick={handleGenerate} loading={isGenerating} className="gap-2">
                <Share2 className="h-4 w-4" />
                Generate Share Link
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-700">Your share link</label>
              <div className="flex gap-2">
                <Input value={shareUrl ?? ""} readOnly className="bg-slate-50 text-slate-600 text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy} title="Copy link">
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Anyone with this link can view your entire brain.
              </p>
              <Button
                variant="danger-outline"
                size="sm"
                onClick={handleRevoke}
                loading={isRevoking}
                className="self-start gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Revoke Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
