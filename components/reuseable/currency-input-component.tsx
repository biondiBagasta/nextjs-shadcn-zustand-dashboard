"use client"

import { maskitoTransform } from "@maskito/core"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { maskitoCurrencyOptions } from "@/lib/utils"

interface CurrencyInputComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function CurrencyInputComponent(props: CurrencyInputComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Input id={ props.nameElement } 
      name={ props.nameElement }
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => {
          const formattedData = maskitoTransform(e.target.value, maskitoCurrencyOptions);
          props.onChangeControl(formattedData)
        }
      }></Input>
    </Field>
  )
}