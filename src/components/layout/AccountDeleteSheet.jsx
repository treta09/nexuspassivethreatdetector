import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";

// Mobile action sheet for account self-service. Lets an authenticated user
// delete their own user record via the API, then clears the
// session and returns to login. Affects only the dashboard account — the
// detection pipeline is read-only and untouched.
/** @param {{ open: boolean, onClose: () => void }} props */
export default function AccountDeleteSheet({ open, onClose }) {
  const { user, logout } = useAuth();
  const [stage, setStage] = useState("sheet"); // sheet | confirm | deleting | error
  const [error, setError] = useState("");

  if (!open) return null;

  const handleDelete = async () => {
    setStage("deleting");
    setError("");
    try {
      await api.entities.User.delete(user.id);
      // Account removed — clear the session and bounce to login.
      logout(true);
    } catch (err) {
      console.error("[accountDelete]", err);
      setError(err instanceof Error ? err.message : "Deletion was blocked. Use the Users page in the app dashboard.");
      setStage("error");
    }
  };

  const close = () => {
    setStage("sheet");
    setError("");
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={close} />

      <div className="relative bg-card border-t border-border rounded-t-xl px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">Account</span>
          <button type="button" aria-label="Close" onClick={close} className="text-muted-foreground active:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {stage === "sheet" && (
          <>
            <div className="font-body text-[14px] text-foreground mb-1">{user?.email || "Signed in"}</div>
            <div className="font-mono text-[10px] text-muted-foreground mb-4 uppercase tracking-[0.05em]">
              Role: {user?.role || "—"}
            </div>
            <button
              type="button"
              onClick={() => setStage("confirm")}
              className="w-full flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em] py-3 bg-background border border-destructive/50 text-destructive rounded-lg active:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
            <button
              type="button"
              onClick={close}
              className="w-full mt-2 font-mono text-[12px] uppercase tracking-[0.05em] py-3 text-muted-foreground active:text-foreground"
            >
              Cancel
            </button>
          </>
        )}

        {stage === "confirm" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-mono text-[12px] uppercase tracking-[0.05em] font-bold">Confirm deletion</span>
            </div>
            <p className="font-body text-[13px] text-foreground leading-relaxed mb-4">
              This permanently removes your account from this threat monitor. You will be signed out immediately. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.05em] py-3 bg-destructive text-destructive-foreground font-bold rounded-lg active:opacity-90"
            >
              <Trash2 className="w-4 h-4" />
              Yes, delete my account
            </button>
            <button
              type="button"
              onClick={() => setStage("sheet")}
              className="w-full mt-2 font-mono text-[12px] uppercase tracking-[0.05em] py-3 text-muted-foreground active:text-foreground"
            >
              Back
            </button>
          </div>
        )}

        {stage === "deleting" && (
          <div className="py-6 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.05em]">Removing account…</span>
          </div>
        )}

        {stage === "error" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-mono text-[12px] uppercase tracking-[0.05em] font-bold">Deletion failed</span>
            </div>
            <p className="font-body text-[13px] text-foreground leading-relaxed mb-4">{error}</p>
            <button
              type="button"
              onClick={() => setStage("confirm")}
              className="w-full font-mono text-[12px] uppercase tracking-[0.05em] py-3 bg-background border border-border text-foreground rounded-lg active:opacity-80"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={close}
              className="w-full mt-2 font-mono text-[12px] uppercase tracking-[0.05em] py-3 text-muted-foreground active:text-foreground"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}