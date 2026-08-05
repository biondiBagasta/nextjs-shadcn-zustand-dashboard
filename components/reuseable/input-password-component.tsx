"use client"

import { Field } from "../ui/field"
import { Input } from "../ui/input"

interface InputPasswordComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function InputPasswordComponent(props: InputPasswordComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Input id={ props.nameElement } type="password"
      name={ props.nameElement }
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => props.onChangeControl(e.target.value)
      }></Input>
    </Field>
  )
}