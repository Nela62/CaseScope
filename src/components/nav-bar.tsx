"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";

import Link from "next/link";
import { Button } from "./ui/button";
import { Book, BookOpen, BriefcaseBusiness, Menu, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNavBar } from "./navigation/mobile-nav-bar";

const navigation = [];

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div></div>
    </>
  );
};
