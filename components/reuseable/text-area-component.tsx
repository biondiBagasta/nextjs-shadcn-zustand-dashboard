"use client"

import { Field } from "../ui/field"
import { Textarea } from "@/components/ui/textarea"

interface TextareaComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function TextareaComponent(props: TextareaComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Textarea id={ props.nameElement } 
      name={ props.nameElement }
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => props.onChangeControl(e.target.value)
      }></Textarea>
    </Field>
  )
}