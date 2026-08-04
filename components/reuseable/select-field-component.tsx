"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "../ui/field"

interface SelectFieldProps<T> {
  dataList: T[]
  nameElement: string
  valueControl: string | number
  label: string

  getLabel: (item: T) => string
  getValue: (item: T) => string | number

  onChangeControl: (val: string) => void
}

export default function SelectFieldComponent<T>(
  props: SelectFieldProps<T>
) {
  const items = props.dataList.map((item) => ({
    label: props.getLabel(item),
    value: String(props.getValue(item)),
  }))

  return (
    <Field>
      <label htmlFor={props.nameElement}>
        {props.label}
      </label>

      <Select
        items={items}
        value={
          props.valueControl === 0
            ? null
            : String(props.valueControl)
        }
        onValueChange={(value) => {
          if (value !== null) {
            props.onChangeControl(value)
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={`Select ${props.label}`}
          />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}