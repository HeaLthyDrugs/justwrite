"use client";

import { useEffect, useRef } from "react";
import {
  PWA_APPLY_UPDATE_EVENT,
  PWA_UPDATE_READY_EVENT,
} from "@/lib/pwa";

export function ServiceWorkerRegister() {
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let hasRefreshed = false;

    const announceUpdate = (worker: ServiceWorker) => {
      waitingWorkerRef.current = worker;
      window.setTimeout(() => {
        window.dispatchEvent(new Event(PWA_UPDATE_READY_EVENT));
      }, 0);
    };

    const applyUpdate = () => {
      waitingWorkerRef.current?.postMessage({ type: "SKIP_WAITING" });
    };

    const handleControllerChange = () => {
      if (hasRefreshed) {
        return;
      }

      hasRefreshed = true;
      window.location.reload();
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (registration.waiting) {
          announceUpdate(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              announceUpdate(worker);
            }
          });
        });
      } catch {
        // Ignore registration failures to avoid breaking app usage.
      }
    };

    window.addEventListener(PWA_APPLY_UPDATE_EVENT, applyUpdate);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );
    void registerServiceWorker();

    return () => {
      window.removeEventListener(PWA_APPLY_UPDATE_EVENT, applyUpdate);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
    };
  }, []);

  return null;
}
