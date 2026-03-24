import { 
  Briefcase, 
  FileType2, 
  MapPin, 
  Calendar, 
  Users2, 
  Users, 
  Activity 
} from "lucide-react";

export interface MasterItem {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bg: string;
  permission: string; // Added permission requirement
}

export const MASTER_ITEMS: MasterItem[] = [
  {
    title: "sectors",
    description: "sectors.description",
    href: "/masters/sectors",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
    permission: "sectors:view",
  },
  {
    title: "types",
    description: "types.description",
    href: "/masters/types",
    icon: FileType2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    permission: "types:view",
  },
  {
    title: "administrativeLevels",
    description: "administrativeLevels.description",
    href: "/masters/administrative-levels",
    icon: MapPin,
    color: "text-red-600",
    bg: "bg-red-50",
    permission: "administrative-levels:view",
  },
  {
    title: "frequencies",
    description: "frequencies.description",
    href: "/masters/frequencies",
    icon: Calendar,
    color: "text-green-600",
    bg: "bg-green-50",
    permission: "frequencies:view",
  },
  {
    title: "genders",
    description: "genders.description",
    href: "/masters/genders",
    icon: Users2,
    color: "text-pink-600",
    bg: "bg-pink-50",
    permission: "genders:view",
  },
  {
    title: "ageGroups",
    description: "ageGroups.description",
    href: "/masters/age-groups",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50",
    permission: "age-groups:view",
  },
  {
    title: "msnpIndicators",
    description: "msnpIndicators.description",
    href: "/masters/msnp-indicators",
    icon: Activity,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    permission: "msnp-indicators:view",
  },
];
