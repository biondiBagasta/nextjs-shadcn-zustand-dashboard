"use client"

import { Field } from "../ui/field"
import { Switch } from "../ui/switch"

interface SwitchFieldComponentProps {
  nameElement: string
  valueControl: boolean
  label: string
  onChangeControl: (val: boolean) => void
}

export default function SwitchFieldComponent(props: SwitchFieldComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Switch id={ props.nameElement } 
      name={ props.nameElement }
      required checked={
        props.valueControl
      } onCheckedChange={
        (checked) => props.onChangeControl(checked)
      }></Switch>
    </Field>
  )
}