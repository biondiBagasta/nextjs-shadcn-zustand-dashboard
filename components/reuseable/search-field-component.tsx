"use client"

import { Search } from "lucide-react"
import { Field } from "../ui/field"
import { Input } from "../ui/input"

interface SearchFieldComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function SearchFieldComponent(props: SearchFieldComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input id={ props.nameElement } 
        className="pl-10"
        name={ props.nameElement }
        placeholder={ props.label } required value={
          props.valueControl
        } onChange={
          (e) => props.onChangeControl(e.target.value)
        }></Input>
      </div>
    </Field>
  )
}