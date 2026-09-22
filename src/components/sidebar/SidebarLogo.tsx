"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div className="px-2 pt-2 pb-2">
      <Link href="/" className="inline-block">
        <Image
          src="/images/navbar/Nav_logo.png"
          alt="LGPSM Logo"
          width={180}
          height={66}
          priority
          className="h-17 w-auto object-contain brightness-110"
        />
      </Link>
    </div>
  );
}
