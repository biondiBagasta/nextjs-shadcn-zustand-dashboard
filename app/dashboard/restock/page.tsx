"use client"

import PageTitleComponent from "@/components/template/page-title.component"
import SupplierComponent from "./supplier/supplier.component"
import { useState } from "react"
import { SupplierData } from "@/interfaces/supplier"

export default function RestockPage() {

  const [supplierList, setSupplierList] = useState<SupplierData[]>([])

  return (
    <>
      <div className="section">
        <PageTitleComponent title="Restock" subtitle="Dashboard" />

        <div className="mt-5">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">

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