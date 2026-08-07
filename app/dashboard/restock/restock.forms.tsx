
"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { RestockFormsControl } from "./page"
import { FieldGroup } from "@/components/ui/field"
import { SupplierData } from "@/interfaces/supplier"
import SelectFieldComponent from "@/components/reuseable/select-field-component"
import { DatePickerComponent } from "@/components/reuseable/date-picker-component"
import TextareaComponent from "@/components/reuseable/text-area-component"
import { ProductData } from "@/interfaces/product"
import { Minus, Plus } from "lucide-react"
import { useServiceStore } from "@/store/service.stroe"
import { Subscription, tap } from "rxjs"
import NoDataAlertComponent from "@/components/reuseable/no-data-alert-component"
import { SelectedRestockProductData } from "@/interfaces/restocks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { baseUrl } from "@/lib/axios"
import CurrencyInputComponent from "@/components/reuseable/currency-input-component"
import DiscountInputComponent from "@/components/reuseable/discount-input-component"
import { deformatToNumber, formatCurrency, formatPercent } from "@/lib/utils"
import SearchFieldComponent from "@/components/reuseable/search-field-component"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface RestockFormsProps {
	control: RestockFormsControl
	setControl: Dispatch<SetStateAction<RestockFormsControl>>
	supplierList: SupplierData[]
	selectedItemList: SelectedRestockProductData[]
	setSelectedItemList: Dispatch<SetStateAction<SelectedRestockProductData[]>>
}

export default function RestockForms(props: RestockFormsProps) {
  const updateFormControl = (
    key: keyof typeof props.control,
    value: string | number | boolean | Date
  ) => {
    props.setControl((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const productService = useServiceStore((state) => state.productService)

  const [productList, setProductList] = useState<ProductData[]>([]);

  const subscriptionRef = useRef(new Subscription());

  const [searchControl, setSearchControl] = useState("");
  const [debounceSearch, setDebounceSearch] = useState(searchControl);

  const searchProduct = () => {
    const initializeSubscription = productService.searchPaginateLimitFive(1, searchControl).pipe(
      tap(data => {
        setProductList(data.data)
      })
    ).subscribe();

    subscriptionRef.current.add(initializeSubscription);
  }

  useEffect(() => {
    subscriptionRef.current = new Subscription();

    searchProduct();

    return () => {
      subscriptionRef.current.unsubscribe();
    }
  }, []);

  // Debounce Effect
  useEffect(() => {
    // Set a timeout to update debounced value after 500ms
    const handler = setTimeout(() => {
      setDebounceSearch(searchControl);
    }, 500);

    // Cleanup the timeout if `query` changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchControl]);

  useEffect(() => {
    searchProduct();
  }, [debounceSearch]);

  const calculateSubtotalAndUpdateSelectedItems = (index: number) => {
    const currentData = props.selectedItemList;

    const discount = deformatToNumber(currentData[index].discount);
    console.log(discount)
    const purchase_price = deformatToNumber(currentData[index].purchase_price);
    const qty = currentData[index].quantity;

    const discountedPrice = purchase_price * (discount / 100)
    const totalPrice = purchase_price - discountedPrice

    const sub_total = totalPrice * qty

    console.log(sub_total)

    const formattedSubtotal = formatCurrency(sub_total)

    currentData[index].sub_total = formattedSubtotal

    props.setSelectedItemList([...currentData])
  }

  const updatePurchasePrice = (index: number, value: string) => {
  	const currentData = props.selectedItemList;

  	currentData[index].purchase_price = value;

  	calculateSubtotalAndUpdateSelectedItems(index)
  }

  const updateDiscount = (index: number, value: string) => {
  	const currentData = props.selectedItemList;

  	currentData[index].discount = value;

  	calculateSubtotalAndUpdateSelectedItems(index);
  }

  const decrementQty = (index: number) => {
    const currentData = props.selectedItemList;

    const currentQty = currentData[index].quantity;

    if(currentQty > 1) {
      currentData[index].quantity = currentQty - 1;

      calculateSubtotalAndUpdateSelectedItems(index)
    } else {
      currentData.splice(index, 1)

      props.setSelectedItemList([...currentData])
    }
  }

  const incrementQty = (index: number) => {
    const currentData = props.selectedItemList;

    const currentQty = currentData[index].quantity;

    currentData[index].quantity = currentQty + 1;

    calculateSubtotalAndUpdateSelectedItems(index)
  }


  const checkIfProductIsAlreadySelected = (productId: number): boolean => {
    const currentSelectedData = props.selectedItemList

    const findIndex = currentSelectedData.findIndex((d) => d.product_id == productId)

    if(findIndex == -1) {
      return false;
    } else {
      return true;
    }
  }

  const selectProductItem = (product: ProductData) => {

    const currentSelectedItems = props.selectedItemList

    const findIndex = currentSelectedItems.findIndex(d => d.product_id == product.id)

    if(findIndex == -1) {
      const newSelectedItems: SelectedRestockProductData = {
        product_id: product.id,
        product: product,
        quantity: 1,
        purchase_price: formatCurrency(product.purchase_price),
        discount: formatPercent(0),
        sub_total: formatCurrency(product.purchase_price)
      }

      currentSelectedItems.push(newSelectedItems)

      props.setSelectedItemList([...currentSelectedItems])
    }
  }


  return (
  	<FieldGroup>
      	<SelectFieldComponent
          dataList={ props.supplierList }
          nameElement="supplier" label="Supplier" valueControl={ props.control.supplier_id }
          getLabel={ (item) => item.name } getValue={ (item) => item.id }
          onChangeControl={ (val) => {
            if(val != null) {
              updateFormControl("supplier_id", Number(val))
            }
          }}
      	/>

      	<DatePickerComponent nameElement="restock_date" valueControl={ props.control.restock_date }
      	onChangeControl={ 
      		(val) => {
      			if(val) {
      				updateFormControl("restock_date", val)
      			}
      		}
      	} label="Restock Date" />

      	<TextareaComponent nameElement="note" valueControl={ props.control.note! } label="Note"
      	onChangeControl={
      		(val) => updateFormControl("note", val)
      	} />

        <div className="grid grid-cols-12 gap-8 mt-4">

          <div className="col-span-12">
            <div className="text-base font-semibold mb-3">
              Select Product Item
            </div>
            <div className="w-full">
              <SearchFieldComponent label="Search Product" nameElement="search_product" valueControl={ searchControl }
                onChangeControl={
                  (val) => {
                    setSearchControl(val)
                  }
              } />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Selected</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  productList.map((d, index) => (
                    <TableRow key={ index }>
                      <TableCell>
                        <Checkbox className={ 'cursor-pointer' } checked={ 
                          checkIfProductIsAlreadySelected(d.id)
                        } onCheckedChange={
                          (_) => selectProductItem(d)
                        } />
                      </TableCell>
                      <TableCell>
                        <img 
                          className="max-w-12 shrink-0 rounded-xl object-cover" 
                        src={ `${baseUrl}/files/product/image/${d.image}` }
                        />
                      </TableCell>
                      <TableCell>
                        { d.name }
                      </TableCell>
                      <TableCell>
                        { d.edges.category.name }
                      </TableCell>
                      <TableCell>
                        { formatCurrency(d.purchase_price) }
                      </TableCell>
                      <TableCell>
                        { d.stock }
                      </TableCell>
                    </TableRow>
                  ))
                  
                }
              </TableBody>
            </Table>
            {
              productList.length == 0 ?
              <NoDataAlertComponent title="INFORMATION" description="No Product Data was Found!!!" /> :
              <></>
            }
          </div>

          <div className="col-span-12">

            <div className="text-base font-semibold mb-3">
              Selected Restock Item
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  props.selectedItemList.map((d, index) => (
                    <TableRow key={ index }>
                      <TableCell>
                        <img 
                          className="max-w-12 shrink-0 rounded-xl object-cover" 
                          src={ `${baseUrl}/files/product/image/${d.product.image}` }
                        />
                      </TableCell>
                      <TableCell className="max-w-[200px] whitespace-normal break-words">
                        { d.product.name }
                      </TableCell>
                      <TableCell>
                        { d.product.edges.category.name }
                      </TableCell>
                      <TableCell>
                        <CurrencyInputComponent nameElement="purchase_price" label="Purchase Price"
                        valueControl={ d.purchase_price }
                        onChangeControl={
                          (val) => {
                            updatePurchasePrice(index, val)
                          }
                        } />
                      </TableCell>
                      <TableCell>
                        <DiscountInputComponent nameElement="discount" label="Discount"
                          valueControl={ d.discount } onChangeControl={
                            (val) => {
                              updateDiscount(index, val)
                            }
                          } />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center gap-3">
                          <Button variant="outline" size="icon" aria-label="Decrement" onClick={
                            (e) => {
                              e.preventDefault();
                              decrementQty(index)
                            }
                          }>
                            <Minus className="text-red-600" />
                          </Button>
                          <div className="text-base font-semibold">
                            { d.quantity }
                          </div>
                          <Button variant="outline" size="icon" aria-label="Increment" onClick={
                            (e) => {
                              e.preventDefault();
                              incrementQty(index)
                            }
                          }>
                            <Plus className="text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-base font-semibold">
                          { d.sub_total }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            {
              props.selectedItemList.length == 0 ? <NoDataAlertComponent
              title="NO DATA" description="No Product Data was Selected." /> : <></>
            }
          </div>

          
        </div>

   	</FieldGroup>
  )
}