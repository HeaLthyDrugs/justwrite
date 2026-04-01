import { HugeiconsIcon } from "@hugeicons/react";
import {
  Folder01Icon,
  FolderAddIcon,
  FolderPinIcon,
  MoreHorizontalIcon,
  NoteAddIcon,
  NoteIcon,
  PanelRightCloseIcon,
  PinIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { IconButton } from "@/components/ui/icon-button";

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function NotesDrawer({ isOpen, onClose, className = "" }: NotesDrawerProps) {
  return (
    <aside
      className={`fixed right-6 top-1/2 z-30 w-[320px] -translate-y-1/2 rounded-[28px] border border-black/5 bg-white/10 p-5 shadow-[0_24px_60px_rgba(15,15,15,0.12)] backdrop-blur-[40px] transition-all duration-500 ease-in-out dark:border-white/10 dark:bg-zinc-900/30 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
          Notes
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Search notes" className="h-8 w-8 border-none bg-white/40 dark:bg-white/5">
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.6} />
          </IconButton>
          <IconButton label="New folder" className="h-8 w-8 border-none bg-white/40 dark:bg-white/5">
            <HugeiconsIcon icon={FolderAddIcon} size={16} strokeWidth={1.6} />
          </IconButton>
          <IconButton label="New note" className="h-8 w-8 border-none bg-white/40 dark:bg-white/5">
            <HugeiconsIcon icon={NoteAddIcon} size={16} strokeWidth={1.6} />
          </IconButton>
          <IconButton
            label="Close drawer"
            className="h-8 w-8 border-none bg-white/40 dark:bg-white/5"
            onClick={onClose}
          >
            <HugeiconsIcon
              icon={PanelRightCloseIcon}
              size={16}
              strokeWidth={1.6}
            />
          </IconButton>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Pinned
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                  <HugeiconsIcon
                    icon={Folder01Icon}
                    size={16}
                    strokeWidth={1.6}
                  />
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Drafts
                  </div>
                  <div className="text-xs text-zinc-500">3 notes</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="Unpin folder" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5">
                  <HugeiconsIcon
                    icon={FolderPinIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                </IconButton>
                <IconButton label="More" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                </IconButton>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                  <HugeiconsIcon
                    icon={NoteIcon}
                    size={16}
                    strokeWidth={1.6}
                  />
                </span>
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Meeting Flow
                  </div>
                  <div className="text-xs text-zinc-500">Updated 2m ago</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="Unpin note" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5">
                  <HugeiconsIcon
                    icon={PinIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                </IconButton>
                <IconButton label="More" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Folders
          </div>
          <div className="mt-3 space-y-2">
            {[
              { name: "Projects", count: "12 notes" },
              { name: "Ideas", count: "7 notes" },
              { name: "Personal", count: "5 notes" },
            ].map((folder) => (
              <div
                key={folder.name}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                    <HugeiconsIcon
                      icon={Folder01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      {folder.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {folder.count}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label="Pin folder" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                    <HugeiconsIcon
                      icon={FolderPinIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                  <IconButton label="More" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Recent Notes
          </div>
          <div className="mt-3 space-y-2">
            {[
              { name: "Calm UI Notes", meta: "Edited today" },
              { name: "Pitch Outline", meta: "Edited yesterday" },
            ].map((note) => (
              <div
                key={note.name}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-zinc-600 dark:bg-white/5 dark:text-zinc-200">
                    <HugeiconsIcon icon={NoteIcon} size={16} strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      {note.name}
                    </div>
                    <div className="text-xs text-zinc-500">{note.meta}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label="Pin note" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                    <HugeiconsIcon icon={PinIcon} size={14} strokeWidth={1.6} />
                  </IconButton>
                  <IconButton label="More" className="h-8 w-8 border-none bg-black/5 dark:bg-white/5 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      size={14}
                      strokeWidth={1.6}
                    />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
