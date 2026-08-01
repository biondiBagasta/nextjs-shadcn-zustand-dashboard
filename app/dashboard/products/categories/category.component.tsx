"use client"

import { CategoryData } from "@/interfaces/category";
import { showHttpErrorToast } from "@/lib/axios";
import { useServiceStore } from "@/store/service.stroe";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react"
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InputTextComponent from "@/components/reuseable/input-text-component";
import { toast } from "@/components/ui/toast";
import FormDialogComponent from "@/components/reuseable/form-dialog.component";
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteAlertComponent } from "@/components/reuseable/delete-alert-component";

export default function CategoryComponent() {

  const [searchControl, setSearchControl] = useState("")

  const [nameControl, setNameControl] = useState("")

  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const [dataList, setDataList] = useState<CategoryData[]>([])

  const [selectedData, setSelectedData] = useState<CategoryData | null>(null)

  const subscriptionRef = useRef(new Subscription())

  const categoryService = useServiceStore((state) => state.categoryService)

  const [isLoadingSubmit, setIsloadingSubmit] = useState(false)

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

  const checkFormValidity = () => {
    if(nameControl) {
      return true
    } else {
      return false
    }
  }

  const resetFormControl = () => {
    setNameControl("")
  }

  const initialize = () => {
    setIsLoadingTable(true);

    const initializeSubscription = categoryService.findMany().pipe(
      tap(data => {
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

  const updateSelectedData = (data: CategoryData) => {
    setNameControl(data.name)
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
      setIsloadingSubmit(true);
      const name = nameControl;
      const createSubscription = categoryService.create({
        name
      }).pipe(
        tap(data => {
          if(data.success) {
            initialize()
            resetFormControl();
            
            setIsloadingSubmit(false);
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
          setIsloadingSubmit(false);

          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(createSubscription)
    }
  }

  // Bagian Update
  const updateData = () => {
    setIsloadingSubmit(true);

    const formValidity = checkFormValidity();

    if(formValidity == false) {
      toast.add({
        type: "error",
        title: "PERHATIAN",
        description: "Form harus dilengkapi terlebih dahulu!!!"
      })
    } else {
      setIsloadingSubmit(true);
      const name = nameControl;

      const updateSubscription = categoryService.update(selectedData!.id, {
        name
      }).pipe(
        tap((data) => {
          if(data.success) {
            initialize()
            resetFormControl();
            
            setIsloadingSubmit(false);
            setIsOpenedEditDialog(false);

            toast.add({
              type: "success",
              title: "EDIT",
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
          setIsloadingSubmit(false);

          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(updateSubscription);
    }
  }

  // Bagian Delete
  const deleteData = () => {
    setIsloadingSubmit(true);

    const deleteSubscription = categoryService.delete(selectedData!.id).pipe(
      tap((response) => {
        initialize();
        setIsOpenedDeleteDialog(false);
        setIsloadingSubmit(false);

        toast.add({
          type: "success",
          title: "DELETE",
          description: response.message
        })
      }),
      catchError((e: AxiosError) => {
        setIsOpenedDeleteDialog(false);
        setIsloadingSubmit(false);
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
          <CardTitle>Data Product Category</CardTitle>
          <CardAction>
            <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
            title="Add Category" trigger={
              <Button variant={'default'} size={'lg'} className="cursor-pointer" onClick={
                (_) => resetFormControl()
              }>
                <Plus size={ 24 } />
                Add Data
              </Button>
            } form_content={
              <>
                <InputTextComponent nameElement="name" valueControl={ nameControl } onChangeControl={
                  (val) => setNameControl(val)
                } label="Name">
                </InputTextComponent>
              </>
            } isLoadingSubmit={ isLoadingSubmit } onSubmit={ createData } />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoadingTable ?
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                )) :
                dataList.map((d, index) => (
                  <TableRow key={index}>
                    <TableCell>{ d.name }</TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row gap-2">

                        <FormDialogComponent isOpen={ isOpenedEditDialog } 
                        setIsOpen={ setIsOpenedEditDialog }
                        title="Edit Category" trigger={
                          <Button variant={ 'outline' } size={ 'icon' } onClick={
                            (_) => updateSelectedData(d)
                          }
                          className="cursor-pointer">
                            <SquarePen className="text-blue-500" />
                          </Button>
                        } form_content={
                          <>
                            <InputTextComponent nameElement="name" valueControl={ nameControl } onChangeControl={
                              (val) => setNameControl(val)
                            } label="Name">
                            </InputTextComponent>
                          </>
                        } isLoadingSubmit={ isLoadingSubmit } onSubmit={ updateData } />


                        <DeleteAlertComponent 
                          isOpen={ isOpenedDeleteDialog } 
                          setIsOpen={ setIsOpenedDeleteDialog }
                          title="Delete Category Data"
                          description="Are you sure want to delete this Category Data???" 
                          onSubmit={
                            deleteData
                          }
                          trigger={
                            <Button variant={ 'outline' } size={ 'icon' } className="cursor-pointer"
                            onClick={ 
                              (_) => updateSelectedData(d)
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
            <>
              <Alert className="mt-3">
                <InfoIcon />
                <AlertTitle>No Data</AlertTitle>
                <AlertDescription>
                  No Category Data...
                </AlertDescription>
              </Alert>
            </> 
            : <></>
          }
        </CardContent>
      </Card>


    </>
  )
}