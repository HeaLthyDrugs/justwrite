"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book01Icon,
  QrCodeIcon,
  Copy01Icon,
  Tick01Icon,
  RefreshIcon,
  Cancel01Icon,
  SecurityCheckIcon,
  SmartPhone01Icon,
  LaptopIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Link02Icon,
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

  const handleDisconnect = () => {
    if (confirm("Disconnect this device from Your Book? Local notes will remain on this device.")) {
      setStoredSyncCode(null);
      const newCode = generateSyncCode();
      setStoredSyncCode(newCode);
      setSyncCode(newCode);
      setLastSyncTime(null);
      setDevices([]);
      setStatusMessage({ type: "success", text: "Unlinked. Generated new Sync Code." });
    }
  };

  const currentDeviceId = getDeviceId();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-[540px] h-[460px] max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-7 flex flex-col justify-between">
          
          {/* Equal 3-Column Capsule Tabs */}
          <div>
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full">
              <button
                type="button"
                onClick={() => setActiveTab("book")}
                className={`py-2 px-3 text-xs font-medium rounded-full transition cursor-pointer flex items-center justify-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "book"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <HugeiconsIcon icon={Book01Icon} size={14} className="shrink-0" />
                <span className="truncate">Your Book</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("devices")}
                className={`py-2 px-3 text-xs font-medium rounded-full transition cursor-pointer flex items-center justify-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "devices"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <HugeiconsIcon icon={LaptopIcon} size={14} className="shrink-0" />
                <span className="truncate">Connected Devices ({devices.length || 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("link")}
                className={`py-2 px-3 text-xs font-medium rounded-full transition cursor-pointer flex items-center justify-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "link"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <HugeiconsIcon icon={Link02Icon} size={14} className="shrink-0" />
                <span className="truncate">Connect Book</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 my-4 overflow-y-auto pr-1 flex flex-col justify-between space-y-4">
            
            {/* TAB 1: Your Book */}
            {activeTab === "book" && (
              <div className="space-y-4 animate-in fade-in duration-150 flex-1 flex flex-col justify-between">
                {/* Sync Code Box */}
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      BOOK SYNC CODE
                    </span>
                    <span className="text-xs text-zinc-400">
                      {lastSyncTime ? `Synced ${new Date(lastSyncTime).toLocaleTimeString()}` : "Zero-Knowledge Encrypted"}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider select-all">
                      {syncCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={handleCopyCode}
                      className="w-full py-2.5 px-4 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                    >
                      <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} />
                      <span>{copied ? "Copied" : "Copy Code"}</span>
                    </button>
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="w-full py-2.5 px-4 text-xs font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full transition cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                    >
                      <HugeiconsIcon icon={QrCodeIcon} size={14} />
                      <span>Show QR Code</span>
                    </button>
                  </div>
                </div>

                {/* Auto-Sync Switch */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Realtime Auto-Sync
                      </span>
                      {autoSync && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Automatically sync changes in the background as you write notes
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoSyncToggle}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      autoSync ? "bg-amber-600" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        autoSync ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Connected Devices */}
            {activeTab === "devices" && (
              <div className="space-y-4 animate-in fade-in duration-150 flex-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Devices sharing Your Book
                  </span>
                  <button
                    onClick={() => performSync(syncCode)}
                    disabled={isSyncing}
                    className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <HugeiconsIcon icon={RefreshIcon} size={12} className={isSyncing ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {devices.length > 0 ? (
                    devices.map((dev) => (
                      <div
                        key={dev.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="p-2 rounded-xl bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 shrink-0">
                            <HugeiconsIcon
                              icon={dev.name.includes("Mobile") || dev.name.includes("iOS") || dev.name.includes("Android") ? SmartPhone01Icon : LaptopIcon}
                              size={16}
                            />
                          </div>
                          <div className="truncate space-y-0.5">
                            <div className="flex items-center space-x-2">
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
                              Last seen: {dev.lastSeen ? new Date(dev.lastSeen).toLocaleTimeString() : "Active"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
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
                      <div className="flex items-center space-x-3">
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
              <form onSubmit={handlePairDevice} className="space-y-4 animate-in fade-in duration-150 flex-1 flex flex-col justify-between">
                <div className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl space-y-3">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                    Enter Sync Code from another device
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. orbit-silver-maple-zenith"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full px-4 py-3 text-sm font-mono bg-white dark:bg-zinc-900 rounded-xl focus:outline-hidden text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSyncing || !inputCode.trim()}
                  className="w-full py-3 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-full shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <HugeiconsIcon icon={Link02Icon} size={16} />
                  <span>{isSyncing ? "Connecting Book..." : "Connect Book"}</span>
                </button>
              </form>
            )}

          </div>

          {/* Bottom Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3.5 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full transition cursor-pointer flex items-center space-x-1.5"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                <span>Unlink Book</span>
              </button>

              <button
                type="button"
                onClick={() => performSync(syncCode)}
                disabled={isSyncing}
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <HugeiconsIcon icon={RefreshIcon} size={14} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
              </button>
            </div>
          </div>

          {/* Status Toast Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs font-medium flex items-center space-x-2 ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              <HugeiconsIcon icon={SecurityCheckIcon} size={15} />
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

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
