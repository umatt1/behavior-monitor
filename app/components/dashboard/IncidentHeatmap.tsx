'use client'

import { useState, useMemo } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { startOfYear, endOfYear, format, subYears } from 'date-fns'
import { Incident } from '@/app/types'

interface IncidentHeatmapProps {
  incidents: Incident[]
}

interface HeatmapValue {
  date: Date
  count: number
  severity: number
}

export function IncidentHeatmap({ incidents }: IncidentHeatmapProps) {
  const [hoveredValue, setHoveredValue] = useState<HeatmapValue | null>(null)

  const { startDate, endDate, values } = useMemo(() => {
    const now = new Date()
    const start = startOfYear(subYears(now, 1))
    const end = endOfYear(now)

    // Create a map of dates to incident counts and average severity
    const dateMap = new Map<string, { count: number; totalSeverity: number }>()
    
    incidents.forEach(incident => {
      const date = new Date(incident.date).toISOString().split('T')[0]
      const existing = dateMap.get(date) || { count: 0, totalSeverity: 0 }
      dateMap.set(date, {
        count: existing.count + 1,
        totalSeverity: existing.totalSeverity + incident.severity
      })
    })

    // Convert the map to the format needed by the heatmap
    const heatmapValues: HeatmapValue[] = Array.from(dateMap.entries()).map(([date, data]) => ({
      date: new Date(date),
      count: data.count,
      severity: Math.round(data.totalSeverity / data.count)
    }))

    return {
      startDate: start,
      endDate: end,
      values: heatmapValues
    }
  }, [incidents])

  const getTooltipDataText = (value: HeatmapValue) => {
    if (!value || !value.count) return 'No incidents'
    return `${value.count} incident${value.count !== 1 ? 's' : ''} (avg severity: ${value.severity.toFixed(1)})`
  }

  const getTitleForValue = (value: HeatmapValue) => {
    if (!value || !value.count) return ''
    return `${format(value.date, 'MMM d, yyyy')}: ${getTooltipDataText(value)}`
  }

  const getClassForValue = (value: HeatmapValue) => {
    if (!value || !value.count) return 'color-empty'
    
    // Calculate color based on both count and severity
    const intensity = Math.min(value.count * value.severity / 5, 4)
    return `color-scale-${Math.ceil(intensity)}`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Incident Activity</h2>
      </div>

      <style jsx global>{`
        .react-calendar-heatmap {
          font-size: 8px;
        }
        .react-calendar-heatmap text {
          font-size: 6px;
          fill: #aaa;
        }
        .react-calendar-heatmap rect {
          height: 9px;
          width: 9px;
          rx: 2;
        }
        .react-calendar-heatmap .color-empty {
          fill: #f5f5f5;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #ffedd5;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #fed7aa;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #fb923c;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #ea580c;
        }
      `}</style>

      <div className="relative">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={getClassForValue}
          titleForValue={getTitleForValue}
          tooltipDataAttrs={(value: HeatmapValue) => ({
            'data-tooltip': getTooltipDataText(value)
          })}
          showWeekdayLabels
          gutterSize={2}
          onMouseOver={(event, value) => setHoveredValue(value)}
          onMouseLeave={() => setHoveredValue(null)}
        />
        
        {hoveredValue && (
          <div className="absolute bottom-0 left-0 bg-gray-800 text-white px-2 py-1 rounded text-sm">
            {getTitleForValue(hoveredValue)}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-4 text-sm text-gray-500">
        <span className="mr-2">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-[#f5f5f5]" />
          <div className="w-3 h-3 bg-[#ffedd5]" />
          <div className="w-3 h-3 bg-[#fed7aa]" />
          <div className="w-3 h-3 bg-[#fb923c]" />
          <div className="w-3 h-3 bg-[#ea580c]" />
        </div>
        <span className="ml-2">More</span>
      </div>
    </div>
  )
}
