"use client"

import { Dispatch, SetStateAction } from "react";
import { UserFormsControl } from "./page"
import { FieldGroup } from "@/components/ui/field";
import InputTextComponent from "@/components/reuseable/input-text-component";
import InputPasswordComponent from "@/components/reuseable/input-password-component";
import SwitchFieldComponent from "@/components/reuseable/switch-field-component";
import SelectFieldComponent from "@/components/reuseable/select-field-component";

interface UserFormsProps {
  control: UserFormsControl;
  setControl: Dispatch<SetStateAction<UserFormsControl>>
}

export default function UserForms(props: UserFormsProps) {
  const updateFormControl = (
    key: keyof typeof props.control,
    value: string | number | boolean
  ) => {
    props.setControl((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const roleList = [
    "STAFF",
    "MANAGER",
    "SUPER ADMIN"
  ];

  return (
    <FieldGroup>
      <InputTextComponent nameElement="username" valueControl={ props.control.username } onChangeControl={
        (val) => updateFormControl("username", val)
      } label="Username">
      </InputTextComponent>
      <InputPasswordComponent nameElement="password" valueControl={ props.control.password } onChangeControl={
        (val) => updateFormControl("password", val)
      } label="Password">
      </InputPasswordComponent>
      <InputTextComponent nameElement="full_name" valueControl={ props.control.full_name } onChangeControl={
        (val) => updateFormControl("full_name", val)
      } label="Full Name">
      </InputTextComponent>
      <InputTextComponent nameElement="address" valueControl={ props.control.address } onChangeControl={
        (val) => updateFormControl("address", val)
      } label="Address">
      </InputTextComponent>
      <InputTextComponent nameElement="phone_number" valueControl={ props.control.phone_number } onChangeControl={
        (val) => updateFormControl("phone_number", val)
      } label="Phone Number">
      </InputTextComponent>
      <SelectFieldComponent 
      dataList={ roleList }
      nameElement="role" valueControl={ props.control.role } label="Role"
      getLabel={ (item) => item } getValue={ (item) => item } onChangeControl={
        (val) => updateFormControl("role", val)
      } />
      <SwitchFieldComponent nameElement="active" valueControl={ props.control.active }
      onChangeControl={ (val) => updateFormControl("active", val) } label="Active?" />
    </FieldGroup>
  )
}