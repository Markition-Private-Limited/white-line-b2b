import React from "react";
import { cn } from "@/utils/cn";

export interface StatCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  iconWrapperClass?: string;
  cardClass?: string;
  subtitle?: React.ReactNode;
  subtitleClass?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  iconWrapperClass,
  cardClass,
  subtitle,
  subtitleClass,
  onClick
}: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "card-base p-0 flex flex-col justify-between h-[100px] min-h-[100px] w-full flex-1 min-w-[165px] shrink-0", 
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        cardClass
      )}
    >
      <div className={cn("flex flex-col flex-1 px-4 justify-between", subtitle ? "pt-2 pb-1" : "py-3")}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-fs-12 font-normal text-text-secondary leading-tight truncate">{title}</span>
          {icon && (
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-none", iconWrapperClass)}>
              {icon}
            </div>
          )}
        </div>
        <div className="text-fs-20 font-semibold text-text-primary tracking-tight mt-0.5 leading-[20px] font-poppins">{value}</div>
      </div>
      {subtitle && (
        <div className={cn("h-[31px] flex items-center px-4 w-full text-fs-10", subtitleClass)}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export interface StatsRowProps {
  stats?: StatCardProps[];
  children?: React.ReactNode;
  className?: string;
}

export function StatsRow({ stats, children, className }: StatsRowProps) {
  return (
    <div className={cn("flex flex-nowrap overflow-x-auto gap-2.5 scrollbar-hide w-full shrink-0 min-h-[100px]", className)}>
      {children}
      {stats?.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
