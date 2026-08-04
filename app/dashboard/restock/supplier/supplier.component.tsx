"use client"

import FormDialogComponent from "@/components/reuseable/form-dialog.component";
import NoDataAlertComponent from "@/components/reuseable/no-data-alert-component";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { SupplierData } from "@/interfaces/supplier"
import { showHttpErrorToast } from "@/lib/axios";
import { useServiceStore } from "@/store/service.stroe";
import { AxiosError } from "axios";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import SupplierForms from "./supplier.forms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingTableComponent from "@/components/reuseable/loading-table-component";
import { Badge } from "@/components/ui/badge";
import { DeleteAlertComponent } from "@/components/reuseable/delete-alert-component";

interface SupplierComponentProps {
  setSupplierList: Dispatch<SetStateAction<SupplierData[]>>
}

export interface SupplierFormsControl {
  name: string;
  address: string;
  phone_number: string;
  active: boolean;
}

export default function SupplierComponent(props: SupplierComponentProps) {
  const [formControl, setFormControl] = useState<SupplierFormsControl>({
    name: "",
    address: "",
    phone_number: "",
    active: true
  });

  const checkFormValidity = () => {
    const isValid = !Object.values(formControl).some(
      (value) => value === "" || value === 0
    );

    return isValid;
  }

  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [dataList, setDataList] = useState<SupplierData[]>([])

  const [selectedData, setSelectedData] = useState<SupplierData | null>(null)

  const subscriptionRef = useRef(new Subscription())

  const supplierService = useServiceStore((state) => state.supplierService)

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const [isOpenedCreateDialog, setIsOpenedCreateDialog] = useState(false);
  const [isOpenedEditDialog, setIsOpenedEditDialog] = useState(false);
  const [isOpenedDeleteDialog, setIsOpenedDeleteDialog] = useState(false);

  useEffect(() => {
    subscriptionRef.current = new Subscription(); // Buat Subscription Baru
    initialize();
    return () => {
      subscriptionRef.current.unsubscribe();
    }
  }, [])

  const resetFormControl = () => {
    setFormControl({
      name: "",
      address: "",
      phone_number: "",
      active: true
    })
  }

  const initialize = () => {
    setIsLoadingTable(true);

    const initializeSubscription = supplierService.findMany().pipe(
      tap(data => {
        props.setSupplierList(data);
        setDataList(data);
        setIsLoadingTable(false);
      }),
      catchError((e: AxiosError) => {
        showHttpErrorToast(e);

        setIsLoadingTable(false);

        return EMPTY;
      })
    ).subscribe();

    subscriptionRef.current.add(initializeSubscription);
  }

  const updateFormAndSelectedData = (data: SupplierData) => {
    setFormControl({
      name: data.name,
      address: data.address,
      phone_number: data.phone_number,
      active: data.active == 1 ? true : false
    })
    setSelectedData(data);
  }

  // Bagian Create

  const createData = () => {
    const formValidity = checkFormValidity();

    if(formValidity == false) {
      toast.add({
        type: "error",
        title: "PERHATIAN",
        description: "Form harus dilengkapi terlebih dahulu!!!"
      })
    } else {
      setIsLoadingSubmit(true)
      const createSubscription = supplierService.create({
        name: formControl.name,
        address: formControl.address,
        phone_number: formControl.phone_number,
        active: formControl.active == true ? 1 : 0
      }).pipe(
        tap(data => {
          setIsLoadingSubmit(false);
          if(data.success) {
            initialize()
            resetFormControl();
            setIsOpenedCreateDialog(false);

            toast.add({
              type: "success",
              title: "CREATE",
              description: data.message
            })
          } else {
            toast.add({
              type: "error",
              title: "ERROR",
              description: data.message
            })
          }
        }),
        catchError((e: AxiosError) => {
          setIsLoadingSubmit(false);

          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(createSubscription)
    }
  }

  // Bagian Update
  const updateData = () => {
    setIsLoadingSubmit(true);

    const formValidity = checkFormValidity();

    if(formValidity == false) {
      toast.add({
        type: "error",
        title: "PERHATIAN",
        description: "Form harus dilengkapi terlebih dahulu!!!"
      })
    } else {
      setIsLoadingSubmit(true);
      const updateSubscription = supplierService.update(selectedData!.id, {
        name: formControl.name,
        address: formControl.address,
        phone_number: formControl.phone_number,
        active: formControl.active == true ? 1 : 0
      }).pipe(
        tap((data) => {
          setIsLoadingSubmit(false);
          if(data.success) {
            initialize()
            resetFormControl();
          
            setIsOpenedEditDialog(false);

            toast.add({
              type: "success",
              title: "UPDATE",
              description: data.message
            })
          } else {
            toast.add({
              type: "error",
              title: "ERROR",
              description: data.message
            })
          }
        }),
        catchError((e: AxiosError) => {
          setIsLoadingSubmit(false);

          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(updateSubscription);
    }
  }

  // Bagian Delete
  const deleteData = () => {
    setIsLoadingSubmit(true);

    const deleteSubscription = supplierService.delete(selectedData!.id).pipe(
      tap((response) => {
        initialize();
        setIsOpenedDeleteDialog(false);
        setIsLoadingSubmit(false);

        toast.add({
          type: "success",
          title: "DELETE",
          description: response.message
        })
      }),
      catchError((e: AxiosError) => {
        setIsOpenedDeleteDialog(false);
        setIsLoadingSubmit(false);
        showHttpErrorToast(e);

        return EMPTY;
      })
    ).subscribe();

    subscriptionRef.current.add(deleteSubscription)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Supplier</CardTitle>
          <CardAction>
            <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
            title="Add Supplier" trigger={
              <Button variant={'default'} size={'lg'} className="cursor-pointer" onClick={
                (_) => resetFormControl()
              }>
                <Plus size={ 24 } />
                Add Data
              </Button>
            } form_content={
              <SupplierForms control={ formControl } setControl={ setFormControl } />
            } isLoadingSubmit={ isLoadingSubmit } onSubmit={ createData } />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoadingTable ?
                <LoadingTableComponent /> :
                dataList.map((d, index) => (
                  <TableRow key={index}>
                    <TableCell>{ d.name }</TableCell>
                    <TableCell>{ d.address }</TableCell>
                    <TableCell>{ d.phone_number }</TableCell>
                    <TableCell>
                      {
                        d.active == 1 ? 
                        <>
                          <Badge variant={ 'default' }>Active</Badge>
                        </> : 
                        <>
                          <Badge variant={ 'destructive' }>Inactive</Badge>
                        </>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row gap-2">

                        <FormDialogComponent isOpen={ isOpenedEditDialog } 
                        setIsOpen={ setIsOpenedEditDialog }
                        title="Edit Category" trigger={
                          <Button variant={ 'outline' } size={ 'icon' } onClick={
                            (_) => updateFormAndSelectedData(d)
                          }
                          className="cursor-pointer">
                            <SquarePen className="text-blue-500" />
                          </Button>
                        } form_content={
                          <SupplierForms control={ formControl }
                          setControl={ setFormControl } />
                        } isLoadingSubmit={ isLoadingSubmit } onSubmit={ updateData } />


                        <DeleteAlertComponent 
                        isLoadingSubmit={ isLoadingSubmit }
                          isOpen={ isOpenedDeleteDialog } 
                          setIsOpen={ setIsOpenedDeleteDialog }
                          title="Delete Supplier Data"
                          description="Are you sure want to delete this Supplier Data???" 
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
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          {
            dataList.length == 0 ? 
            <NoDataAlertComponent 
            title="No Supplier Data" description="No Supplier Data was Found"></NoDataAlertComponent>
            : <></>
          }
        </CardContent>
      </Card>
    </>
  )
}