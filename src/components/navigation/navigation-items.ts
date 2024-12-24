import { Book, BookOpen, BriefcaseBusiness } from "lucide-react";

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const navigationItems: NavigationItem[] = [
  {
    name: "Case Library",
    href: "/case-library",
    icon: Book,
  },
  {
    name: "Explore Cases",
    href: "/explore-cases",
    icon: BookOpen,
  },
  {
    name: "My Cases",
    href: "/my-cases",
    icon: BriefcaseBusiness,
  },
];
