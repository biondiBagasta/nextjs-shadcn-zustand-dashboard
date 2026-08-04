"use client"

import { Field } from "../ui/field"
import { Input } from "../ui/input"

interface InputNumberComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function InputNumberComponent(props: InputNumberComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Input id={ props.nameElement } 
      name={ props.nameElement } type="number"
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => props.onChangeControl(e.target.value)
      }></Input>
    </Field>
  )
}