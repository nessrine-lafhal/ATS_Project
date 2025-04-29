import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string | number
    isPositive: boolean
  }
  className?: string
  iconClassName?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className, iconClassName }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <div className="flex items-center mt-1">
                <span className={cn("text-xs font-medium", trend.isPositive ? "text-success-600" : "text-danger-600")}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}
                </span>
                {description && <p className="text-xs text-muted-foreground ml-1">{description}</p>}
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-2 bg-primary-100 text-primary-600",
                iconClassName,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
