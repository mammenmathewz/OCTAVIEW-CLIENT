// SidebarDash.tsx
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../ui/sideBar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Link, Outlet } from "react-router-dom";  // Import Outlet here
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export function SidebarDash() {
  const links = [
    {
      label: "Candidates",
      href: "/dash/candidates",  // Update href to match the route
      icon: (
        <IconBrandTabler className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Selected Candidates",
      href: "/dash/selected-candidates",  // Update href to match the route
      icon: (
        <IconUserBolt className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Scheduled Interviews",
      href: "/dash/scheduled-iterviews",  // Update href to match the route
      icon: (
        <IconUserBolt className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Jobs",
      href: "/dash/jobs",  // Update href to match the route
      icon: (
        <IconUserBolt className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/dash/settings",  // Update href to match the route
      icon: (
        <IconSettings className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 w-full max-w-full mx-auto border border-neutral-200 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div></div>
        </SidebarBody>
      </Sidebar>

      {/* This is where the content changes based on the sidebar link */}
      <div
  className={cn(
    "p-2 md:p-10 rounded-tl-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full h-full",
    "overflow-y-auto"
  )}
>
  <Outlet />
</div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to=""
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        Octaview
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to=""
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
