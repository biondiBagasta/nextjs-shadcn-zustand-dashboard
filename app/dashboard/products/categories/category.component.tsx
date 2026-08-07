"use client"

import { CategoryData } from "@/interfaces/category";
import { showHttpErrorToast } from "@/lib/axios";
import { useServiceStore } from "@/store/service.stroe";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import InputTextComponent from "@/components/reuseable/input-text-component";
import { toast } from "@/components/ui/toast";
import FormDialogComponent from "@/components/reuseable/form-dialog.component";
import { DeleteAlertComponent } from "@/components/reuseable/delete-alert-component";
import LoadingTableComponent from "@/components/reuseable/loading-table-component";
import NoDataAlertComponent from "@/components/reuseable/no-data-alert-component";

interface CategoryComponentProps {
  setCategoryListDispatch: Dispatch<SetStateAction<CategoryData[]>>
}

export default function CategoryComponent(props: CategoryComponentProps) {

  const [nameControl, setNameControl] = useState("")

  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [dataList, setDataList] = useState<CategoryData[]>([])

  const [selectedData, setSelectedData] = useState<CategoryData | null>(null)

  const subscriptionRef = useRef(new Subscription())

  const categoryService = useServiceStore((state) => state.categoryService)

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
        props.setCategoryListDispatch(data);
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

  const updateFormAndSelectedData = (data: CategoryData) => {
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
      setIsLoadingSubmit(true);
      const name = nameControl;
      const createSubscription = categoryService.create({
        name
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
      const name = nameControl;

      const updateSubscription = categoryService.update(selectedData!.id, {
        name
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

    const deleteSubscription = categoryService.delete(selectedData!.id).pipe(
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
          <CardTitle>Data Product Category</CardTitle>
          <CardAction>
            <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
              size="n"
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
                <LoadingTableComponent /> :
                dataList.map((d, index) => (
                  <TableRow key={index}>
                    <TableCell>{ d.name }</TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row gap-2">

                        <FormDialogComponent isOpen={ isOpenedEditDialog } 
                          size="n"
                        setIsOpen={ setIsOpenedEditDialog }
                        title="Edit Category" trigger={
                          <Button variant={ 'outline' } size={ 'icon' } onClick={
                            (_) => updateFormAndSelectedData(d)
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
                        isLoadingSubmit={ isLoadingSubmit }
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
            title="No Category Data" 
            description="No Category Data was Found"></NoDataAlertComponent>
            : <></>
          }
        </CardContent>
      </Card>


    </>
  )
}