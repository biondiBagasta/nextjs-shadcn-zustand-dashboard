"use client"

import { Dispatch, SetStateAction } from "react";
import { ProductFormsControl } from "./page"
import { FieldGroup } from "@/components/ui/field";
import InputTextComponent from "@/components/reuseable/input-text-component";
import SelectFieldComponent from "@/components/reuseable/select-field-component";
import { CategoryData } from "@/interfaces/category";
import TipTapEditorComponent from "@/components/reuseable/tip-tap-editor-component";
import CurrencyInputComponent from "@/components/reuseable/currency-input-component";
import InputNumberComponent from "@/components/reuseable/input-number-component";
import DiscountInputComponent from "@/components/reuseable/discount-input-component";
import { InputFileComponent } from "@/components/reuseable/input-file-component";

interface ProductFormsProps {
  control: ProductFormsControl;
  setControl: Dispatch<SetStateAction<ProductFormsControl>>
  categoryList: CategoryData[]
  imageFileControl: File | null
  setImageFileControl: Dispatch<SetStateAction<File | null>>
}

export default function ProductsForms(props: ProductFormsProps) {
  const updateFormControl = (
    key: keyof typeof props.control,
    value: string | number
  ) => {
    props.setControl((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-6">
        <FieldGroup>
          <InputTextComponent nameElement="code" valueControl={ props.control.code } onChangeControl={
            (val) => updateFormControl("code", val)
          } label="Code">
          </InputTextComponent>

          <InputTextComponent nameElement="name" valueControl={ props.control.name } onChangeControl={
            (val) => updateFormControl("name", val)
          } label="Name">
          </InputTextComponent>

          <SelectFieldComponent
          dataList={ props.categoryList }
          nameElement="category" label="Category" valueControl={ props.control.category_id }
          getLabel={ (item) => item.name } getValue={ (item) => item.id }
          onChangeControl={ (val) => {
            if(val != null) {
              updateFormControl("category_id", Number(val))
            }
          }}
          ></SelectFieldComponent>

          <TipTapEditorComponent value={ props.control.description } onChange={
            (val) => updateFormControl("description", val)
          } />
        </FieldGroup>
      </div>

      <div className="col-span-12 md:col-span-6">
        <FieldGroup>
          <CurrencyInputComponent nameElement="purchase_price" valueControl={ props.control.purchase_price } onChangeControl={
            (val) => updateFormControl("purchase_price", val)
          } label="Purchase Price">
          </CurrencyInputComponent>

          <CurrencyInputComponent nameElement="selling_price" valueControl={ props.control.selling_price } onChangeControl={
            (val) => updateFormControl("selling_price", val)
          } label="Selling Price">
          </CurrencyInputComponent>
          
          <InputNumberComponent nameElement="stock" valueControl={ props.control.stock } onChangeControl={
            (val) => updateFormControl("stock", val)
          } label="Stock">
          </InputNumberComponent>

          <DiscountInputComponent nameElement="discount" valueControl={ props.control.discount } onChangeControl={
            (val) => updateFormControl("discount", val)
          } label="Discount">
          </DiscountInputComponent>

          <InputFileComponent nameElement="product_image" valueControl={ props.imageFileControl } onChangeControl={
            (val) => props.setImageFileControl(val)
          } label="Product Image" description="Select Product Image">
          </InputFileComponent>
        </FieldGroup>
      </div>
    </div>
  )
}