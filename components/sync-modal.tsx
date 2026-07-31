"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book01Icon,
  QrCodeIcon,
  Copy01Icon,
  Tick01Icon,
  RefreshIcon,
  SecurityCheckIcon,
  SmartPhone01Icon,
  LaptopIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Link02Icon,
  Cancel01Icon,
  AlertDiamondIcon,
  UnlinkIcon,
} from "@hugeicons/core-free-icons";
import { QRModal } from "./qr-modal";
import {
  getStoredSyncCode,
  setStoredSyncCode,
  getStoredLastSyncTime,
  getAutoSyncEnabled,
  setAutoSyncEnabled,
  getDeviceId,
  performNotesSync,
  removeDeviceFromSync,
  DeviceInfo,
} from "@/lib/sync";
import { generateSyncCode } from "@/lib/crypto";
import { NotesSnapshot } from "@/lib/notes-storage";

// ─── Confirm Unlink Modal ────────────────────────────────────────────────────

interface ConfirmUnlinkModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmUnlinkModal: React.FC<ConfirmUnlinkModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <HugeiconsIcon
              icon={UnlinkIcon}
              size={32}
              className="text-rose-500"
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Unlink This Device?
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            This device will be disconnected from Your Book and a{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              new Sync Code
            </span>{" "}
            will be generated. Your local notes will remain safe on this device.
          </p>
        </div>

        {/* Warning callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/8 dark:bg-amber-500/10 border border-amber-500/20">
          <HugeiconsIcon
            icon={AlertDiamondIcon}
            size={15}
            className="text-amber-500 shrink-0 mt-0.5"
          />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-snug">
            Other devices will no longer sync with this device after unlinking.
            You can reconnect later using the new code.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 text-sm font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
          >
            Keep Linked
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-4 text-sm font-semibold rounded-full bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <HugeiconsIcon icon={UnlinkIcon} size={14} />
            Unlink
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sync Modal ──────────────────────────────────────────────────────────────

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: NotesSnapshot;
  onSnapshotUpdated: (newSnapshot: NotesSnapshot) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  snapshot,
  onSnapshotUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<"book" | "devices" | "link">("book");
  const [syncCode, setSyncCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      let code = getStoredSyncCode();
      if (!code) {
        code = generateSyncCode();
        setStoredSyncCode(code);
      }
      setSyncCode(code);
      setLastSyncTime(getStoredLastSyncTime());
      setAutoSync(getAutoSyncEnabled());
      setStatusMessage(null);

      void performSync(code);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const performSync = async (codeToUse: string) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setStatusMessage(null);

    const res = await performNotesSync(snapshot, codeToUse);
    setIsSyncing(false);

    if (res.success && res.mergedSnapshot) {
      onSnapshotUpdated(res.mergedSnapshot);
      setLastSyncTime(getStoredLastSyncTime());
      if (res.devices) {
        setDevices(res.devices);
      }
      return true;
    } else {
      setStatusMessage({ type: "error", text: res.error || "Sync failed" });
      return false;
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(syncCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleAutoSyncToggle = () => {
    const nextVal = !autoSync;
    setAutoSync(nextVal);
    setAutoSyncEnabled(nextVal);
  };

  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputCode.trim().toLowerCase();
    if (!cleaned) return;

    const ok = await performSync(cleaned);
    if (ok) {
      setStoredSyncCode(cleaned);
      setSyncCode(cleaned);
      setInputCode("");
      setActiveTab("book");
      setStatusMessage({ type: "success", text: "Successfully connected to Book!" });
    }
  };

  const handleRemoveDevice = async (deviceIdToRemove: string) => {
    if (!confirm("Are you sure you want to remove this device from Your Book?")) return;
    setIsSyncing(true);
    const res = await removeDeviceFromSync(deviceIdToRemove, snapshot, syncCode);
    setIsSyncing(false);
    if (res.success && res.devices) {
      setDevices(res.devices);
      setStatusMessage({ type: "success", text: "Device removed successfully." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to remove device." });
    }
  };

  const handleDisconnectConfirmed = () => {
    setUnlinkConfirmOpen(false);
    setStoredSyncCode(null);
    const newCode = generateSyncCode();
    setStoredSyncCode(newCode);
    setSyncCode(newCode);
    setLastSyncTime(null);
    setDevices([]);
    setStatusMessage({ type: "success", text: "Unlinked successfully. A new Sync Code has been generated." });
  };

  const currentDeviceId = getDeviceId();

  const tabs = [
    { id: "book" as const, label: "Your Book", icon: Book01Icon },
    { id: "devices" as const, label: `Devices (${devices.length || 1})`, icon: LaptopIcon },
    { id: "link" as const, label: "Connect", icon: Link02Icon },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal Panel */}
        <div className="relative w-full sm:w-[520px] max-h-[90dvh] sm:max-h-[none] sm:h-auto bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">

          {/* Drag handle on mobile */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>

          {/* Inner content */}
          <div className="flex flex-col p-5 sm:p-7 gap-4 overflow-y-auto">

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full shrink-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    className={`py-2 px-2 sm:px-3 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
                      isActive
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    <HugeiconsIcon icon={tab.icon} size={14} className="shrink-0" />
                    <span className="hidden sm:inline truncate">{tab.label}</span>
                    <span className="sm:hidden text-[10px] leading-none truncate max-w-[52px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">

              {/* TAB 1: Your Book */}
              {activeTab === "book" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                  {/* Sync Code Box */}
                  <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
                        Book Sync Code
                      </span>
                      <span className="text-[10px] sm:text-xs text-zinc-400 text-right">
                        {lastSyncTime
                          ? `Synced ${new Date(lastSyncTime).toLocaleTimeString()}`
                          : "Zero-Knowledge Encrypted"}
                      </span>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-base sm:text-xl font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider select-all break-all">
                        {syncCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleCopyCode}
                        className="w-full py-2.5 px-3 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} className="shrink-0" />
                        <span>{copied ? "Copied!" : "Copy Code"}</span>
                      </button>
                      <button
                        onClick={() => setQrModalOpen(true)}
                        className="w-full py-2.5 px-3 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <HugeiconsIcon icon={QrCodeIcon} size={14} className="shrink-0" />
                        <span>Show QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Auto-Sync Toggle */}
                  <div className="flex items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl sm:rounded-3xl">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          Realtime Auto-Sync
                        </span>
                        {autoSync && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                        Sync changes in the background as you write
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoSyncToggle}
                      aria-label={autoSync ? "Disable auto-sync" : "Enable auto-sync"}
                      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        autoSync ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          autoSync ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Connected Devices */}
              {activeTab === "devices" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Devices sharing Your Book
                    </span>
                    <button
                      onClick={() => performSync(syncCode)}
                      disabled={isSyncing}
                      className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      <HugeiconsIcon icon={RefreshIcon} size={12} className={isSyncing ? "animate-spin" : ""} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                    {devices.length > 0 ? (
                      devices.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs gap-2"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-xl bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                              <HugeiconsIcon
                                icon={
                                  dev.name.includes("Mobile") || dev.name.includes("iOS") || dev.name.includes("Android")
                                    ? SmartPhone01Icon
                                    : LaptopIcon
                                }
                                size={16}
                              />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="truncate font-semibold text-zinc-800 dark:text-zinc-200">
                                  {dev.name}
                                </span>
                                {dev.id === currentDeviceId && (
                                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold shrink-0">
                                    This Device
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400">
                                Last seen:{" "}
                                {dev.lastSeen ? new Date(dev.lastSeen).toLocaleTimeString() : "Active"}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {dev.id === currentDeviceId ? (
                              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-emerald-500" />
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveDevice(dev.id)}
                                className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition cursor-pointer"
                                title="Remove device from Book"
                              >
                                <HugeiconsIcon icon={Delete02Icon} size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300">
                            <HugeiconsIcon icon={LaptopIcon} size={16} />
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">This Device</span>
                            <p className="text-[11px] text-zinc-400">Active and synced</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-500 font-semibold">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Connect Book */}
              {activeTab === "link" && (
                <form onSubmit={handlePairDevice} className="flex flex-col gap-4 animate-in fade-in duration-150">
                  <div className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl sm:rounded-3xl space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                        Enter Sync Code from another device
                      </label>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        You can find your sync code under the &ldquo;Your Book&rdquo; tab on the other device.
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. orbit-silver-maple-zenith"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="w-full px-4 py-3 text-sm font-mono bg-white dark:bg-zinc-900 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 focus:ring-2 focus:ring-amber-500/40 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncing || !inputCode.trim()}
                    className="w-full py-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-full shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <HugeiconsIcon icon={isSyncing ? RefreshIcon : Link02Icon} size={15} className={isSyncing ? "animate-spin" : ""} />
                    <span>{isSyncing ? "Connecting Book..." : "Connect Book"}</span>
                  </button>
                </form>
              )}

            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-medium ${
                  statusMessage.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                <HugeiconsIcon
                  icon={statusMessage.type === "success" ? SecurityCheckIcon : AlertDiamondIcon}
                  size={14}
                  className="shrink-0"
                />
                <span className="flex-1">{statusMessage.text}</span>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="shrink-0 opacity-60 hover:opacity-100 transition cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={12} />
                </button>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUnlinkConfirmOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full transition cursor-pointer flex items-center gap-1.5"
                >
                  <HugeiconsIcon icon={UnlinkIcon} size={14} />
                  <span>Unlink Book</span>
                </button>

                <button
                  type="button"
                  onClick={() => performSync(syncCode)}
                  disabled={isSyncing}
                  className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={14} className={isSyncing ? "animate-spin" : ""} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Unlink Confirmation Modal */}
      <ConfirmUnlinkModal
        isOpen={unlinkConfirmOpen}
        onConfirm={handleDisconnectConfirmed}
        onCancel={() => setUnlinkConfirmOpen(false)}
      />

      {/* QR Modal */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Book Sync QR Code"
        subtitle="Scan with camera or mobile browser to pair Your Book instantly."
        value={syncCode}
      />
    </>
  );
};
