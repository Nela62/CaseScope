import { Book, BookOpen, BriefcaseBusiness } from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
  icon: React.ElementType;
};

export const navigationItems: NavigationItem[] = [
  {
    name: "Case Library",
    href: "/case-library",
    current: false,
    icon: Book,
  },
  {
    name: "Explore Cases",
    href: "/explore-cases",
    current: true,
    icon: BookOpen,
  },
  {
    name: "My Cases",
    href: "/my-cases",
    current: false,
    icon: BriefcaseBusiness,
  },
];
