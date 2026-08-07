"use client"

import PageTitleComponent from "@/components/template/page-title.component"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, SquarePen, Trash2 } from "lucide-react"
import CategoryComponent from "./categories/category.component"
import { useEffect, useRef, useState } from "react"
import { catchError, EMPTY, map, of, Subscription, switchMap, tap } from "rxjs"
import { CategoryData } from "@/interfaces/category"
import { ProductData, ProductPaginate } from "@/interfaces/product"
import { useServiceStore } from "@/store/service.stroe"
import { AxiosError } from "axios"
import { baseUrl, showHttpErrorToast } from "@/lib/axios"
import { toast } from "@/components/ui/toast"
import { FileResponse } from "@/interfaces/file-response"
import FormDialogComponent from "@/components/reuseable/form-dialog.component"
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table"
import { DeleteAlertComponent } from "@/components/reuseable/delete-alert-component"
import NoDataAlertComponent from "@/components/reuseable/no-data-alert-component"
import SearchFieldComponent from "@/components/reuseable/search-field-component"
import { PaginationComponent } from "@/components/reuseable/pagination-component"
import DetailImageDialogComponent from "@/components/reuseable/detail-image-dialog-component"
import ProductsForm from "./products.forms"
import LoadingTableComponent from "@/components/reuseable/loading-table-component"
import { deformatToNumber, formatCurrency, formatPercent } from "@/lib/utils"

export interface ProductFormsControl {
  code: string;
  name: string;
  description: string;
  purchase_price: string;
  selling_price: string;
  stock: string;
  discount: string;
  category_id: number
}

export default function ProductPage() {

  const [formControl, setFormControl] = useState<ProductFormsControl>({
    code: "",
    name: "",
    description: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    discount: "",
    category_id: 0,
  });
  const [searchControl, setSearchControl] = useState("");
	const [debounceSearch, setDebounceSearch] = useState(searchControl);
  
  const [imageFileControl, setImageFileControl] = useState<File | null>(null)

  const subscriptionRef = useRef(new Subscription())

  const [categoryList, setCategoryList] = useState<CategoryData[]>([])

  const [paginationData, setPaginationData] = useState<ProductPaginate | null>(null)
  const [selectedData, setSelectedData] = useState<ProductData | null>(null)

  const productService = useServiceStore((state) => state.productService);
  const fileService = useServiceStore((state) => state.filesService)
  
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [isOpenedCreateDialog, setIsOpenedCreateDialog] = useState(false);
  const [isOpenedEditDialog, setIsOpenedEditDialog] = useState(false);
  const [isOpenedDeleteDialog, setIsOpenedDeleteDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const resetFormControl = () => {
    setImageFileControl(null)
    setFormControl({
      code: "",
      name: "",
      description: "",
      purchase_price: "",
      selling_price: "",
      stock: "",
      discount: "",
      category_id: 0,
    })
  }


  const resetPaginate = () => {
    setSearchControl("")
    setCurrentPage(1)
  }

  const searchPaginate = () => {
    setIsLoadingTable(true);

    const searchSubscription = productService.searchPaginate(currentPage, searchControl).pipe(
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
    searchPaginate();
  }, [debounceSearch, currentPage]);

  const checkFormValidity = () => {
    const isValid = !Object.values(formControl).some(
      (value) => value === "" || value === 0
    );

    return isValid;
  }

  const updateFormAndSelectedData = (data: ProductData) => {
    setFormControl({
      code: data.code,
      name: data.name,
      description: data.description,
      purchase_price: formatCurrency(data.purchase_price),
      selling_price: formatCurrency(data.selling_price),
      stock: data.stock.toString(),
      discount: formatPercent(data.discount),
      category_id: data.category_id,
    })
    setSelectedData(data);
  }

  const createData = () => {
    if(checkFormValidity() && imageFileControl != null) {
      setIsLoadingSubmit(true);

      const formData = new FormData();

  		formData.append("product_image", imageFileControl!);
      
      const purchase_price = deformatToNumber(formControl.purchase_price);
  		const selling_price = deformatToNumber(formControl.selling_price);
  		const discount = deformatToNumber(formControl.discount);

      const createSubscription = fileService.uploadProductImage(formData).pipe(
        switchMap((fileResponse) => {
          return productService.create({
            code: formControl.code,
            name: formControl.name,
            description: formControl.description,
            purchase_price: purchase_price,
            selling_price: selling_price,
            stock: Number(formControl.stock),
            discount: discount,
            category_id: formControl.category_id,
            image: fileResponse.file_name
          }).pipe(
            tap((res) => {
              setIsLoadingSubmit(false);
              if(res.success) {
                resetPaginate()
                resetFormControl()
                searchPaginate();

                setIsOpenedCreateDialog(false);

                toast.add({
                  type: "success",
                  title: "CREATE",
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
          )
        }),
        catchError((e: AxiosError) => {
          setIsLoadingSubmit(false);
          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(createSubscription)
    } else {
      toast.add({
        title: "PERHATIAN",
        type: "error",
        description: "Form Harus Dilengkapi Terlebih Dahulu."
      })
    }
  }

  const updateData = () => {
    if(checkFormValidity()) {
      setIsLoadingSubmit(true);

      const formData = new FormData();

  		if(imageFileControl != null) {
        formData.append("product_image", imageFileControl!);
      }

      const uploadFileObs = imageFileControl != null ? fileService.deleteProductImage(selectedData!.image).pipe(
        switchMap(
          (_) => fileService.uploadProductImage(formData).pipe(
            map((res) => res)
          )
        )
      ) : of<FileResponse>({
        file_name: selectedData!.image,
        file_extension: ""
      })
      
      const purchase_price = deformatToNumber(formControl.purchase_price);
  		const selling_price = deformatToNumber(formControl.selling_price);
  		const discount = deformatToNumber(formControl.discount);

      const updateSubscription = uploadFileObs.pipe(
        switchMap((fileResponse) => {
          return productService.update(
            selectedData!.id,
            {
            code: formControl.code,
            name: formControl.name,
            description: formControl.description,
            purchase_price: purchase_price,
            selling_price: selling_price,
            stock: Number(formControl.stock),
            discount: discount,
            category_id: formControl.category_id,
            image: fileResponse.file_name
          }).pipe(
            tap((res) => {
              setIsLoadingSubmit(false);
              if(res.success) {
                resetPaginate()
                resetFormControl()
                searchPaginate();

                setIsOpenedEditDialog(false);

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
          )
        }),
        catchError((e: AxiosError) => {
          setIsLoadingSubmit(false);
          showHttpErrorToast(e);

          return EMPTY;
        })
      ).subscribe();

      subscriptionRef.current.add(updateSubscription)
    } else {
      toast.add({
        title: "PERHATIAN",
        type: "error",
        description: "Form Harus Dilengkapi Terlebih Dahulu."
      })
    }
  }

  const deleteData = () => {
    setIsLoadingSubmit(true);

    const deleteSubscription = fileService.deleteProductImage(selectedData!.image).pipe(
      switchMap((_) => {
        return productService.delete(selectedData!.id).pipe(
          tap(res => {
              setIsLoadingSubmit(false);
              if(res.success) {
                resetPaginate()
                resetFormControl()
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
        )
      })
    ).subscribe();

    subscriptionRef.current.add(deleteSubscription)
  }

  return (
    <div className="section">
      <PageTitleComponent title="Product" subtitle="Dashboard"></PageTitleComponent>

      <div className="mt-5">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
                  <FormDialogComponent isOpen={ isOpenedCreateDialog } setIsOpen={ setIsOpenedCreateDialog }
                    size="l"
                  title="Add Product" trigger={
                    <Button variant={'default'} size={'lg'} className="cursor-pointer" onClick={
                      (_) => resetFormControl()
                    }>
                      <Plus size={ 24 } />
                      Add Data
                    </Button>
                  } form_content={
                    <ProductsForm control={ formControl } setControl={ setFormControl } categoryList={ categoryList }
                    imageFileControl={ imageFileControl } setImageFileControl={ setImageFileControl } />
                  } isLoadingSubmit={ isLoadingSubmit } onSubmit={ createData } />

                  <div className="w-full md:w-sm">
                    <SearchFieldComponent nameElement="search-product" valueControl={ searchControl } onChangeControl={
                        (val) => setSearchControl(val)
                      } label="Cari Data Produk">
                    </SearchFieldComponent>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      isLoadingTable ?
                      <LoadingTableComponent /> :
                      paginationData!.data.map((d, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <DetailImageDialogComponent trigger={
                              <button type="button" className="cursor-pointer">
                                <img 
                                className="min-w-24 h-24 shrink-0 rounded-xl object-cover" 
                                src={ `${baseUrl}/files/product/image/${d.image}` }
                                />
                              </button>
                            } imageUrl={`${baseUrl}/files/product/image/${d.image}`} />
                          </TableCell>
                          <TableCell className="text-sm font-semibold">{ d.code }</TableCell>
                          <TableCell>{ d.name }</TableCell>
                          <TableCell>{ d.edges.category.name }</TableCell>
                          <TableCell dangerouslySetInnerHTML={{ __html: d.description }}></TableCell>
                          <TableCell>{ formatCurrency(d.purchase_price) }</TableCell>
                          <TableCell>{ formatCurrency(d.selling_price) }</TableCell>
                          <TableCell>{ d.discount }%</TableCell>
                          <TableCell>{ d.stock }</TableCell>
                          <TableCell>
                            <div className="flex flex-col md:flex-row gap-2">

                              <FormDialogComponent isOpen={ isOpenedEditDialog } 
                                size="l"
                              setIsOpen={ setIsOpenedEditDialog }
                              title="Edit Product" trigger={
                                <Button variant={ 'outline' } size={ 'icon' } onClick={
                                  (_) => updateFormAndSelectedData(d)
                                }
                                className="cursor-pointer">
                                  <SquarePen className="text-blue-500" />
                                </Button>
                              } form_content={
                                <ProductsForm control={ formControl } setControl={ setFormControl } categoryList={ categoryList }
                                imageFileControl={ imageFileControl } setImageFileControl={ setImageFileControl } />
                              } isLoadingSubmit={ isLoadingSubmit } onSubmit={ updateData } />


                              <DeleteAlertComponent
                                isOpen={ isOpenedDeleteDialog } 
                                setIsOpen={ setIsOpenedDeleteDialog }
                                title="Delete Product Data"
                                description="Are you sure want to delete this Product Data???" 
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
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                {
                  paginationData?.data.length == 0 ? 
                  <NoDataAlertComponent title="No Product Data" description="No Product Data was Found"></NoDataAlertComponent>
                  : <></>
                }
              </CardContent>
              <CardFooter>
                {
                  paginationData != null ? 
                  <PaginationComponent
                    data={ paginationData.paginate } onChangePage={
                      (val) => {
                        setCurrentPage(val);
                      }
                    }
                  /> : <></>
                }
              </CardFooter>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-4">
            <CategoryComponent setCategoryListDispatch={ setCategoryList } />
          </div>
        </div>
      </div>
    </div>
  )
}