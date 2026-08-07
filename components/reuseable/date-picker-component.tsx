"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Field } from "../ui/field"

interface DatePickerComponentProps {
  nameElement: string
  valueControl: Date
  label: string
  onChangeControl: (val: Date) => void
}

export function DatePickerComponent(props: DatePickerComponentProps) {

  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" id="date-picker-simple" className="justify-start font-normal">
          <CalendarIcon />
          {props.valueControl ? format(props.valueControl, "PPP") : <span>Pick a date</span>}</Button>} />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.valueControl}
            onSelect={
              (val) => props.onChangeControl(val!)
            }
            defaultMonth={ props.valueControl }
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
