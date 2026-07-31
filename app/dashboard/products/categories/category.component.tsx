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

export default function CategoryComponent() {

  const [searchControl, setSearchControl] = useState("")

  const [nameControl, setNameControl] = useState("")

  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const [dataList, setDataList] = useState<CategoryData[]>([])

  const [selectedData, setSelectedData] = useState<CategoryData | null>(null)

  const subscriptionRef = useRef(new Subscription())

  const categoryService = useServiceStore((state) => state.categoryService)

  const [isLoadingSubmit, setIsloadingSubmit] = useState(false)

  const [isOpenedDialog, setIsOpenedDialog] = useState(false);

  useEffect(() => {
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

  // Bagian Create
  const createData = () => {
    const validity = checkFormValidity();

    if(validity == false) {
      toast.add({
        type: "error",
        title: "Perhatian",
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
            setIsOpenedDialog(false);

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

  // Bagian Delete

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Product Category</CardTitle>
          <CardAction>
            <FormDialogComponent isOpen={ isOpenedDialog } setIsOpen={ setIsOpenedDialog }
            title="Add Category" trigger={
              <Button variant={'default'} size={'lg'} className="cursor-pointer">
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
                        <Button variant={ 'outline' } size={ 'icon'}>
                          <SquarePen className="text-blue-500" />
                        </Button>
                        <Button variant={ 'outline' } size={ 'icon'}>
                          <Trash2 className="text-red-600" />
                        </Button>
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