"use client"

import PageTitleComponent from "@/components/template/page-title.component"
import SupplierComponent from "./supplier/supplier.component"
import { useEffect, useRef, useState } from "react"
import { SupplierData } from "@/interfaces/supplier"
import { SelectedRestockProductData, RestockItemsBodyData, RestocksData, RestockPaginate } from "@/interfaces/restocks"
import { catchError, EMPTY, Subscription, tap } from "rxjs"
import { useServiceStore } from "@/store/service.stroe"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { AxiosError } from "axios"
import { showHttpErrorToast } from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormDialogComponent from "@/components/reuseable/form-dialog.component"
import { Button } from "@/components/ui/button"
import { Plus, SquarePen, Trash2 } from "lucide-react"
import RestockForms from "./restock.forms"
import { DateRangePickerComponents } from "@/components/reuseable/date-range-picker-component"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import LoadingTableComponent from "@/components/reuseable/loading-table-component"
import { formatCurrency, formatDateLocal, formatPercent } from "@/lib/utils"
import { DeleteAlertComponent } from "@/components/reuseable/delete-alert-component"
import { toast } from "@/components/ui/toast"
import NoDataAlertComponent from "@/components/reuseable/no-data-alert-component"

export interface RestockFormsControl {
  supplier_id: number;
  restock_date: Date;
  note: string | undefined;
}

export default function RestockPage() {

  const [supplierList, setSupplierList] = useState<SupplierData[]>([])

  const [formControl, setFormControl] = useState<RestockFormsControl>({
    supplier_id: 0,
    restock_date: new Date(),
    note: undefined
  });

  const [restockItemsBodyDataList, setRestockItemsBodyList] = useState<RestockItemsBodyData[]>([])

  const restockService = useServiceStore((state) => state.restockService)

  const [selectedItemList, setSelectedItemList] = useState<SelectedRestockProductData[]>([])

  const currentDate = new Date()

  const [dateRangeFilterControl, setDateRangeFilterControl] = useState<DateRange | undefined>({
    from: addDays(currentDate, -1),
    to: currentDate
  });

  const [paginationData, setPaginationData] = useState<RestockPaginate | null>(null);
  const [selectedData, setSelectedData] = useState<RestocksData | null>(null)

  const [isLoadingTable, setIsLoadingTable] = useState(true)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [isOpenedCreateDialog, setIsOpenedCreateDialog] = useState(false);
  const [isOpenedEditDialog, setIsOpenedEditDialog] = useState(false);
  const [isOpenedDeleteDialog, setIsOpenedDeleteDialog] = useState(false);

  const subscriptionRef = useRef(new Subscription());

  const resetPaginate = () => {
    setDateRangeFilterControl({
      from: addDays(currentDate, -1),
      to: currentDate
    })
    setCurrentPage(1)
  }

  const updateFormAndSelectedData = (data: RestocksData) => {
    setFormControl({
      supplier_id: data.supplier_id,
      restock_date: data.restock_date,
      note: data.note!
    })
    setSelectedData(data);

    const selectedItemList: SelectedRestockProductData[] = data.edges.restock_items.map((d) => {
      const selectedItemData: SelectedRestockProductData = {
        product_id: d.product_id,
        product: d.product,
        quantity: d.quantity,
        purchase_price: formatCurrency(d.purchase_price),
        discount: formatPercent(d.discount),
        sub_total: formatCurrency(d.sub_total)
      }

      return selectedItemData
    });

    setSelectedItemList(selectedItemList)
  }

  const resetFormControlAndSelectedItems = () => {
    setFormControl({
      supplier_id: 0,
      restock_date: new Date(),
      note: undefined
    });

    setSelectedItemList([]);
  }

  const searchPaginate = () => {
    setIsLoadingTable(true);

    const searchSubscription = restockService.searchPaginate(currentPage, dateRangeFilterControl?.from ?? new Date(),
      dateRangeFilterControl?.to ?? new Date()
    ).pipe(
      tap(response => {
        setPaginationData(response);
        setIsLoadingTable(false);
      }),
      catchError((e: AxiosError) => {
        showHttpErrorToast(e);

        setIsLoadingTable(false);

        return EMPTY;
      })
    ).subscribe();

    subscriptionRef.current.add(searchSubscription)
  }

  useEffect(() => {
    subscriptionRef.current = new Subscription();

    searchPaginate();

    return () => {
      subscriptionRef.current.unsubscribe()
    }
  }, []);

  useEffect(() => {
    searchPaginate();
  }, [dateRangeFilterControl, currentPage]);



  const createData = () => {

  }

  const updateData = () => {

  }

  const deleteData = () => {
    setIsLoadingSubmit(true)

    const deleteSubscription = restockService.delete(selectedData!.id).pipe(
      tap(res => {
        setIsLoadingSubmit(false);
        if(res.success) {
          resetPaginate()
          resetFormControlAndSelectedItems()
          searchPaginate();

          setIsOpenedDeleteDialog(false);

          toast.add({
            type: "success",
            title: "UPDATE",
            description: res.message
          })
        } else {
          toast.add({
            type: "error",
            title: "ERROR",
            description: res.message
          })
        }
      }),
      catchError((e: AxiosError) => {
        setIsLoadingSubmit(false);
        showHttpErrorToast(e);

        return EMPTY;
      })      
    ).subscribe();

    subscriptionRef.current.add(deleteSubscription);
  }

  return (
    <>
      <div className="section">
        <PageTitleComponent title="Restock" subtitle="Dashboard" />

        <div className="mt-5">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Data Restock</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
                    <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
                      size="l"
                    title="Add Restock Data" trigger={
                      <Button variant={'default'} size={'lg'} className="cursor-pointer" onClick={
                        (_) => resetFormControlAndSelectedItems()
                      }>
                        <Plus size={ 24 } />
                        Add Data
                      </Button>
                    } form_content={
                      <RestockForms control={ formControl } setControl={ setFormControl } supplierList={ supplierList }
                      selectedItemList={ selectedItemList } setSelectedItemList={ setSelectedItemList } />
                    } isLoadingSubmit={ isLoadingSubmit } onSubmit={ createData } />

                    <div className="w-full md:w-sm">
                      <DateRangePickerComponents label="Search By Date" nameElement="search_range"
                      valueControl={ dateRangeFilterControl } onChangeControl={
                        (val) => setDateRangeFilterControl(val)
                      } />
                    </div>
                  </div>

                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Restock Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Discounttotal</TableHead>
                        <TableHead>Grandtotal</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        isLoadingTable ? <LoadingTableComponent /> : 
                        paginationData!.data.map((d, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              { d.restock_number }
                            </TableCell>
                            <TableCell>
                              { formatDateLocal(d.restock_date) }
                            </TableCell>
                            <TableCell>
                              { d.edges.supplier.name }
                            </TableCell>
                            <TableCell>
                              { formatCurrency(d.sub_total) }
                            </TableCell>
                            <TableCell>
                              { formatCurrency(d.discount_total) }
                            </TableCell>
                            <TableCell>
                              { formatCurrency(d.grand_total) }
                            </TableCell>
                            <TableCell>
                              { d.edges.user.full_name }
                            </TableCell>
                            <TableCell>
                              <TableCell>
                                <div className="flex flex-col md:flex-row gap-2">

                                  <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
                                  title="Edit Restock Data" trigger={
                                    <Button variant={'outline'} size={'lg'} className="cursor-pointer" onClick={
                                      (_) => updateFormAndSelectedData(d)
                                    }>
                                      <SquarePen className="text-blue-500" />
                                      Edit Restock Data
                                    </Button>
                                  } form_content={
                                    <RestockForms control={ formControl } setControl={ setFormControl } supplierList={ supplierList }
                                    selectedItemList={ selectedItemList } setSelectedItemList={ setSelectedItemList } />
                                  } isLoadingSubmit={ isLoadingSubmit } onSubmit={ updateData } />


                                  <DeleteAlertComponent
                                    isOpen={ isOpenedDeleteDialog } 
                                    setIsOpen={ setIsOpenedDeleteDialog }
                                    title="Delete Restock Data"
                                    description="Are you sure want to delete this Restock Data???" 
                                    isLoadingSubmit={ isLoadingSubmit }
                                    onSubmit={
                                      deleteData
                                    }
                                    trigger={
                                      <Button variant={ 'outline' } size={ 'icon' } className="cursor-pointer"
                                      onClick={ 
                                        (_) => updateFormAndSelectedData(d)
                                      }>
                                        <Trash2 className="text-red-600" />
                                      </Button>
                                    }
                                  />
                                  
                                </div>
                          </TableCell>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                  {
                  paginationData?.data.length == 0 ? 
                    <NoDataAlertComponent title="No Restock Data" description="No Restock Data was Found"></NoDataAlertComponent>
                    : <></>
                  }
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 md:col-span-5">
              <SupplierComponent setSupplierList={ setSupplierList } />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}