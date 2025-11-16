"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarItem from "../sidebar/SidebarItem";
import { useRouter } from "next/navigation";
import { IconWrapper } from "../ui/IconWrapper";
import { motion, AnimatePresence } from "framer-motion";

import {
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  SparklesIcon,
  StarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { useShowSidebar } from "@/store/useShowSidebar";
import { signOut, useSession } from "next-auth/react";
import { ProfilePic } from "./ProfilePic";
import { useSubscription } from "@/hooks/useSubscription";
import { OpensoxProBadge } from "../sheet/OpensoxProBadge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const SIDEBAR_ROUTES = [
  {
    path: "/dashboard/home",
    label: "Home",
    icon: <HomeIcon className="size-5" />,
  },
  {
    path: "/dashboard/projects",
    label: "OSS Projects",
    icon: <FolderIcon className="size-5" />,
  },
  {
    path: "/newsletters",
    label: "Newsletters",
    icon: <NewspaperIcon className="size-5" />,
  },
  {
    path: "/dashboard/sheet",
    label: "OSS Sheet",
    icon: <DocumentTextIcon className="size-5" />,
  },
];

export default function Sidebar({ overlay = false }: { overlay?: boolean }) {
  const { setShowSidebar, isCollapsed, toggleCollapsed } = useShowSidebar();
  const router = useRouter();
  const { isPaidUser } = useSubscription();

  const reqFeatureHandler = () => {
    window.open("https://github.com/apsinghdev/opensox/issues", "_blank");
  };

  const proClickHandler = () => {
    router.push(isPaidUser ? "/dashboard/pro/dashboard" : "/pricing");
  };

  const desktopWidth = isCollapsed ? 80 : 288;
  const mobileWidth = desktopWidth;

  return (
    <motion.div
      className={`h-screen flex flex-col bg-ox-sidebar border-r border-ox-header z-50 ${
        overlay ? "fixed left-0 top-0 bottom-0 xl:hidden" : ""
      }`}
      initial={overlay ? { x: -400, width: mobileWidth } : { width: desktopWidth }}
      animate={overlay ? { x: 0, width: mobileWidth } : { width: desktopWidth }}
      exit={overlay ? { x: -400, width: mobileWidth } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{ width: overlay ? mobileWidth : desktopWidth }}
    >
      {/* Mobile header */}
      <div className="flex justify-between items-center h-16 px-4 border-b border-ox-header xl:hidden bg-ox-sidebar">
        <Link
          href="/"
          className="text-xl font-semibold text-ox-white hover:text-ox-purple transition-colors"
        >
          Opensox AI
        </Link>
        <IconWrapper onClick={() => setShowSidebar(false)}>
          <XMarkIcon className="size-5 text-ox-purple" />
        </IconWrapper>
      </div>

      {/* Desktop header */}
      <div className="hidden xl:flex items-center justify-between px-4 py-4 border-b border-ox-header bg-ox-sidebar">
        {!isCollapsed && (
          <Link
            href="/"
            className="text-[#eaeaea] font-semibold tracking-wide text-xl hover:text-ox-purple transition-colors"
          >
            Opensox AI
          </Link>
        )}
        <IconWrapper
          onClick={toggleCollapsed}
          className={isCollapsed ? "w-full flex justify-center" : ""}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="size-5 text-ox-purple" />
          ) : (
            <ChevronLeftIcon className="size-5 text-ox-purple" />
          )}
        </IconWrapper>
      </div>

      {/* Sidebar body */}
      <div className="sidebar-body flex-grow flex-col overflow-y-auto px-3 py-4 space-y-1">
        {SIDEBAR_ROUTES.map((route) => (
          <Link href={route.path} key={route.path}>
            <SidebarItem itemName={route.label} icon={route.icon} collapsed={isCollapsed} />
          </Link>
        ))}

        <SidebarItem
          itemName="Request a feature"
          onclick={reqFeatureHandler}
          icon={<SparklesIcon className="size-5" />}
          collapsed={isCollapsed}
        />

        {!isCollapsed && !isPaidUser ? (
          <div
            className="w-full h-[44px] flex items-center rounded-md cursor-pointer px-2 gap-3 pl-3 hover:bg-[#292929] group"
            onClick={proClickHandler}
          >
            <span className="text-[#eaeaea] group-hover:text-white transition-colors">
              <StarIcon className="size-5" />
            </span>
            <div className="flex items-center gap-1">
              <h1 className="text-xs font-medium text-[#c8c8c8] group-hover:text-white transition-colors">
                Opensox Pro
              </h1>
              <OpensoxProBadge className="px-1.5 py-0.5 scale-75" />
            </div>
          </div>
        ) : (
          <SidebarItem
            itemName="Opensox Pro"
            onclick={proClickHandler}
            icon={<StarIcon className="size-5" />}
            collapsed={isCollapsed}
          />
        )}
      </div>

      <ProfileMenu isCollapsed={isCollapsed} />
    </motion.div>
  );
}

function ProfileMenu({ isCollapsed }: { isCollapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const fullName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || null;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && !(e.target as HTMLElement).closest(".profile-menu-container")) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="px-3 py-4 border-t border-ox-header bg-ox-sidebar relative profile-menu-container">
      <div
        className={`group flex items-center rounded-md bg-ox-profile-card border border-ox-header p-2 cursor-pointer ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <ProfilePic imageUrl={userImage} />
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#eaeaea] font-semibold">{fullName}</span>
              <span className="text-[10px] text-zinc-400">{userEmail}</span>
            </div>
            <ChevronLeftIcon
              className={`size-4 text-zinc-400 transition-transform ${
                open ? "rotate-90" : "-rotate-90"
              }`}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-3 right-3 mb-2 bg-ox-profile-card border border-ox-header rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-ox-header">
              <div className="flex items-center gap-3">
                <ProfilePic imageUrl={userImage} />
                <div className="flex flex-col">
                  <span className="text-sm text-white font-semibold">{fullName}</span>
                  <span className="text-xs text-zinc-400">{userEmail}</span>
                </div>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  router.push("/dashboard/account");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#eaeaea] hover:bg-ox-sidebar transition-colors"
              >
                <Cog6ToothIcon className="size-4" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#eaeaea] hover:bg-ox-sidebar transition-colors"
              >
                <ArrowRightOnRectangleIcon className="size-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}