"use client"

import { maskitoTransform } from "@maskito/core"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { maskitoPercentOptions } from "@/lib/utils"

interface DiscountInputComponentProps {
  nameElement: string
  valueControl: string
  label: string
  onChangeControl: (val: string) => void
}

export default function DiscountInputComponent(props: DiscountInputComponentProps) {
  return (
    <Field>
      <label htmlFor={ props.nameElement }>{ props.label }</label>
      <Input id={ props.nameElement } 
      name={ props.nameElement }
      placeholder={ props.label } required value={
        props.valueControl
      } onChange={
        (e) => {
          const value = e.target.value

          if (value === "") {
            props.onChangeControl("")
            return
          }

          const formattedData = maskitoTransform(
            value,
            maskitoPercentOptions
          )

          props.onChangeControl(formattedData)
        }
      }></Input>
    </Field>
  )
}