"use client"
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the PhaserComponent with SSR disabled
const PhaserComponent = dynamic(() => import("../components/phaser"), {
  ssr: false, // Disable SSR for this component
});

export default function Home() {
  return (
    <div>
      <h1>Welcome to My Phaser + Next.js App!</h1>
      <PhaserComponent />
    </div>
  );
}