"use client"

import { Field } from "../ui/field"
import { Input } from "../ui/input"

interface InputTextComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function InputTextComponent(props: InputTextComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Input id={ props.nameElement } 
      name={ props.nameElement }
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => props.onChangeControl(e.target.value)
      }></Input>
    </Field>
  )
}