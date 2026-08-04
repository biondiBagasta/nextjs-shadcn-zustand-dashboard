"use client"

import { Dispatch, SetStateAction } from "react";
import { SupplierFormsControl } from "./supplier.component"
import { FieldGroup } from "@/components/ui/field";
import InputTextComponent from "@/components/reuseable/input-text-component";
import SwitchFieldComponent from "@/components/reuseable/switch-field-component";

interface SupplierFormsProps {
  control: SupplierFormsControl;
  setControl: Dispatch<SetStateAction<SupplierFormsControl>>
}

export default function SupplierForms(props: SupplierFormsProps) {
  const updateFormControl = (
    key: keyof typeof props.control,
    value: string | number | boolean
  ) => {
    props.setControl((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <FieldGroup>
      <InputTextComponent nameElement="name" valueControl={ props.control.name } onChangeControl={
        (val) => updateFormControl("name", val)
      } label="Name">
      </InputTextComponent>
      <InputTextComponent nameElement="address" valueControl={ props.control.address } onChangeControl={
        (val) => updateFormControl("address", val)
      } label="Address">
      </InputTextComponent>
      <InputTextComponent nameElement="phone_number" valueControl={ props.control.phone_number } onChangeControl={
        (val) => updateFormControl("phone_number", val)
      } label="Phone Number">
      </InputTextComponent>
      <SwitchFieldComponent nameElement="active" valueControl={ props.control.active }
      onChangeControl={ (val) => updateFormControl("active", val) } label="Active?" />
    </FieldGroup>
  )
}