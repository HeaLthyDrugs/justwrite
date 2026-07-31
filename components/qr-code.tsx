"use client";

import React from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ value, size = 180, className = "" }) => {
  const encodedValue = encodeURIComponent(value);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedValue}&format=svg&margin=10`;

  return (
    <div
      className={`relative flex items-center justify-center p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs dark:border-neutral-800 ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg object-contain"
        loading="eager"
      />
    </div>
  );
};
