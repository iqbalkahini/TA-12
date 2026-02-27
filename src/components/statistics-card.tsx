'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface StatisticsCardProps {
  title: string
  value?: number
  description?: string
  icon: LucideIcon
  trend?: {
    value?: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export function StatisticsCard({
  title,
  value = 0,
  description,
  icon: Icon,
  trend,
  variant = 'default'
}: StatisticsCardProps) {
  // Helper function to ensure safe numeric display
  const safeNumber = (num?: number, fallback = 0): number => {
    return (num != null && !isNaN(num)) ? num : fallback
  }
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      case 'destructive':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'destructive':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  return (
    <Card className={`${getVariantStyles()} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-7 w-7 ${getIconStyles()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{safeNumber(value).toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <Badge
              variant={trend.isPositive ? 'success' : 'destructive'}
              className="text-xs"
            >
              {trend.isPositive ? '+' : ''}{safeNumber(trend.value)}%
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">
              dari bulan lalu
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
