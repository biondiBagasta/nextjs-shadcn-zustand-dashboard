import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { FieldGroup } from "../ui/field";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface FormDialogComponentProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  trigger: ReactElement;
  form_content: React.ReactNode;
  isLoadingSubmit: boolean;
  onSubmit: () => void;
}

export default function FormDialogComponent(props: FormDialogComponentProps) {
  return (
    <Dialog open={ props.isOpen } onOpenChange={ props.setIsOpen } >
      <form>
        <DialogTrigger render={
          props.trigger
        } />
        <DialogContent className="sm:max-w-sm md:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>{ props.title }</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            { props.form_content }
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            }/>
            <Button type="submit" onClick={ props.onSubmit } className="cursor-pointer">
              {
                props.isLoadingSubmit ? <Spinner data-icon="inline-start"></Spinner> : <></>
              }
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}