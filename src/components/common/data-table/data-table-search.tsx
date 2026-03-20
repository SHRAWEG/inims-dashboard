"use client";

import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DataTableSearch({
  value,
  onChange,
  onSearch,
  placeholder,
  className = "",
}: DataTableSearchProps) {
  const { t } = useTranslation("common");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-1 max-w-md group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary transition-colors" />
        <Input
          placeholder={placeholder || t("search")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-11 bg-white border-slate-200 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 shadow-sm transition-all text-sm font-medium"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Button
        onClick={() => onSearch(value)}
        className="h-11 px-6 font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg shadow-secondary/10 transition-all active:scale-[0.98]"
      >
        {t("search")}
      </Button>
    </div>
  );
}
