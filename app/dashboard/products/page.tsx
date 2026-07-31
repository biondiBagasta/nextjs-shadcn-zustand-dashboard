"use client"

import PageTitleComponent from "@/components/template/page-title.component"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import CategoryComponent from "./categories/category.component"

export default function ProductPage() {
  return (
    <div className="section">
      <PageTitleComponent title="Product" subtitle="Dashboard"></PageTitleComponent>

      <div className="mt-5">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Product</CardTitle>
                <CardAction>
                  <Button variant={'default'} size={'lg'}>
                    <Plus size={ 24 } />
                    Add Data
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-4">
            <CategoryComponent />
          </div>
        </div>
      </div>
    </div>
  )
}