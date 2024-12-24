"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNavBar } from "./mobile-nav-bar";
import { navigationItems } from "./navigation-items";

export const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // TODO: Add support for /my-cases/case-id

  return (
    <>
      <MobileNavBar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        navigation={navigationItems}
      />

      {/* Static sidebar for desktop */}
      <div className="hidden  lg:flex lg:w-56 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center py-10">
            <img
              alt="Casescope"
              src="/casescope-logo.png"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          item.href === pathname
                            ? "bg-gray-50 text-sky-800"
                            : "text-gray-700 hover:bg-gray-50 hover:text-sky-800",
                          "group flex items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={cn(
                            item.href === pathname
                              ? "text-sky-800"
                              : "text-gray-400 group-hover:text-sky-800",
                            "size-5 shrink-0"
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="-mx-6 mt-auto">
                <Link
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <img
                    alt=""
                    src="/demo-avatar.jpg"
                    className="size-8 rounded-full bg-gray-50"
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Aisha Carter</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-gray-900">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src="/demo-avatar.jpg"
            className="size-8 rounded-full bg-gray-50"
          />
        </a>
      </div>
    </>
  );
};
