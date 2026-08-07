"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerComponentProps {
  nameElement: string
  valueControl: DateRange | undefined
  label: string
  onChangeControl: (val: DateRange | undefined) => void
}

export function DateRangePickerComponents(props: DateRangePickerComponentProps) {

  return (
    <Field>
      <FieldLabel htmlFor="date-picker-range">{ props.label }</FieldLabel>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" id="date-picker-range" className="justify-start px-2.5 font-normal">
          <CalendarIcon data-icon="inline-start" />{
            props.valueControl?.from ? (
            props.valueControl?.to ? (
              <>
                {format(props.valueControl?.from, "LLL dd, y")} -{" "}
                {format(props.valueControl?.to, "LLL dd, y")}
              </>
            ) : (
              format(props.valueControl?.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}</Button>} />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={props.valueControl?.from}
            selected={ props.valueControl }
            onSelect={
              (val) => props.onChangeControl(val)
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
