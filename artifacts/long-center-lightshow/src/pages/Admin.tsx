import React, { useState, useEffect } from "react";
import { useListFantasyRsvps } from "@workspace/api-client-react";
import { Lock, Eye, EyeOff, ShieldAlert, Download, Trash2 } from "lucide-react";

const ADMIN_PASSWORD = "cyberowlcanaccess";

const ROBOT_LABELS: Record<string, string> = {
  s3xy: "S·3·X·Y",
  cybertruck: "Cybertruck",
  juniper: "Juniper",
};

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [input, setInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useListFantasyRsvps({ query: { enabled: authed } });

  useEffect(() => {
    if (authed) sessionStorage.setItem("admin_auth", "true");
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password.");
      setInput("");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  }

  function exportCSV() {
    if (!data?.rsvps) return;
    const rows = [
      ["Name", "Email", "Phone", "Robot", "Message", "Registered At"],
      ...data.rsvps.map((r) => [
        r.name,
        r.email,
        r.phone ?? "",
        ROBOT_LABELS[r.robot] ?? r.robot,
        r.message ?? "",
        new Date(r.createdAt).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "long-center-rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const [clearing, setClearing] = useState(false);

  async function clearAllRsvps() {
    if (!confirm("Delete ALL RSVPs? This cannot be undone.")) return;
    setClearing(true);
    try {
      const base = import.meta.env.BASE_URL ?? "/";
      await fetch(`${base}api/rsvps/all`, {
        method: "DELETE",
        headers: { "x-admin-password": ADMIN_PASSWORD },
      });
      await refetch();
    } finally {
      setClearing(false);
    }
  }

  const filtered = data?.rsvps?.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone ?? "").includes(q) ||
      r.robot.toLowerCase().includes(q)
    );
  }) ?? [];

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="border border-primary/30 rounded-2xl bg-black/80 backdrop-blur p-8 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold tracking-widest uppercase text-white">Admin Access</h1>
                <p className="text-white/40 text-xs font-mono mt-1 tracking-wider">LONG CENTER LIGHTSHOW</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs font-mono text-center">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm tracking-widest uppercase hover:bg-primary/20 hover:border-primary transition-all"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-bold tracking-widest uppercase text-white">Admin Panel</h1>
              <p className="text-white/30 text-xs font-mono">LONG CENTER // RSVP LIST</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-mono border border-white/10 rounded-lg text-white/40 hover:text-white hover:border-white/30 transition-all tracking-widest uppercase"
            >
              Refresh
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 text-xs font-mono border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition-all tracking-widest uppercase flex items-center gap-2"
            >
              <Download className="w-3 h-3" /> CSV
            </button>
            <button
              onClick={clearAllRsvps}
              disabled={clearing}
              className="px-4 py-2 text-xs font-mono border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-all tracking-widest uppercase flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" /> {clearing ? "Clearing…" : "Clear All"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-mono border border-white/10 rounded-lg text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all tracking-widest uppercase"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total RSVPs", value: data?.total ?? "—" },
            { label: "Cybertruck", value: data?.rsvps?.filter((r) => r.robot === "cybertruck").length ?? "—" },
            { label: "S·3·X·Y / Juniper", value: data?.rsvps?.filter((r) => r.robot !== "cybertruck").length ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="border border-white/5 rounded-xl bg-white/[0.02] p-4 text-center">
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, or robot..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-primary/40 transition-colors mb-4"
        />

        {/* Table */}
        <div className="border border-white/5 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-0 bg-white/[0.02] px-4 py-3 border-b border-white/5">
            {["Name", "Email", "Phone", "Robot", "Registered"].map((h) => (
              <p key={h} className="text-white/30 text-xs font-mono uppercase tracking-widest">{h}</p>
            ))}
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-white/20 font-mono text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-white/20 font-mono text-sm">No RSVPs found.</div>
          ) : (
            filtered.map((r, i) => (
              <div
                key={r.id}
                className={`grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-0 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <p className="text-white text-sm truncate pr-2">{r.name}</p>
                <p className="text-white/60 text-sm truncate pr-2 font-mono">{r.email}</p>
                <p className="text-white/40 text-sm truncate pr-2 font-mono">{r.phone ?? "—"}</p>
                <p className="text-primary text-xs font-mono uppercase truncate">{ROBOT_LABELS[r.robot] ?? r.robot}</p>
                <p className="text-white/30 text-xs font-mono">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-white/20 text-xs font-mono text-right mt-3">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
