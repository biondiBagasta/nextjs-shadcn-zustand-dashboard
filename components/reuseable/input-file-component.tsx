"use client"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface InputFileComponentProps {
  nameElement: string
  valueControl: File | null
  label: string
  onChangeControl: (val: File) => void
  description: string
}

export function InputFileComponent(props: InputFileComponentProps) {
  return (
    <Field>
      <FieldLabel htmlFor={ props.nameElement }>{ props.label }</FieldLabel>
      <Input id={ props.nameElement } type="file" accept="image/*" onChange={
        (e) => {
          const fileData = e.target.files![0];
          props.onChangeControl(fileData);
        }
      } />
      <FieldDescription>{ props.description }</FieldDescription>
    </Field>
  )
}
