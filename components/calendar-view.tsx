"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAppointments } from "@/lib/appointments-context"

interface CalendarViewProps {
  onDateSelect: (date: string) => void
  selectedDate: string
}

export function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { appointments } = useAppointments()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const hasAppointments = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.some((apt) => apt.date === dateStr && apt.status === "scheduled")
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isSelected = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return selectedDate === dateStr
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    onDateSelect(dateStr)
  }

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ]

  const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={cn(
          "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200",
          "hover:bg-accent hover:scale-105",
          isToday(day) && "bg-secondary/20 border-2 border-secondary font-bold",
          isSelected(day) && "bg-secondary text-secondary-foreground shadow-md scale-105",
          !isToday(day) && !isSelected(day) && "hover:bg-muted",
        )}
      >
        <span className="text-sm">{day}</span>
        {hasAppointments(day) && <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full" />}
      </button>,
    )
  }

  return (
    <Card className="p-6 border-primary/20 bg-card/90 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold text-primary">
          {monthNames[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{days}</div>
    </Card>
  )
}
