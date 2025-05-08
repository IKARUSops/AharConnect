
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{value}</h2>
              {trend && (
                <div
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
                  )}
                >
                  {trendValue && <span>{trendValue}</span>}
                </div>
              )}
            </div>
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
