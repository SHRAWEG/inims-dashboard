import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface MasterCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function MasterCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color, 
  bg 
}: MasterCardProps) {
  return (
    <Link href={href}>
      <Card className="group hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className={`p-2.5 rounded-xl ${bg} ${color} transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-secondary transition-colors">
              {title}
            </CardTitle>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary transition-colors" />
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
