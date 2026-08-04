"use client"

import { ReactElement } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

interface DetailImageDialogComponentProps {
  imageUrl: string
  trigger: ReactElement
}

export default function DetailImageDialogComponent(props: DetailImageDialogComponentProps) {
  return (
    <Dialog>
      <DialogTrigger render={ props.trigger }>
      </DialogTrigger>

      <DialogContent
      showCloseButton={ false }
      className="w-auto max-w-none border-0 bg-transparent p-0 shadow-none">
        <img 
        className="h-128 max-w-max rounded-xl object-cover" 
        src={ props.imageUrl } />
      </DialogContent>
    </Dialog>
  )
}