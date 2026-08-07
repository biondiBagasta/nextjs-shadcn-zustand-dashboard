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
  size: "n" | "l"
}

export default function FormDialogComponent(props: FormDialogComponentProps) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <form>
        <DialogTrigger render={props.trigger} />

        <DialogContent
          className={
            props.size === "l"
              ? "sm:max-w-full md:max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
              : "sm:max-w-full md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          }
        >
          <DialogHeader className="shrink-0">
            <DialogTitle>{props.title}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <FieldGroup>
              {props.form_content}
            </FieldGroup>
          </div>

          <DialogFooter className="shrink-0">
            <DialogClose
              render={
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              }
            />

            <Button
              type="submit"
              onClick={props.onSubmit}
              className="cursor-pointer"
            >
              {props.isLoadingSubmit ? (
                <Spinner data-icon="inline-start" />
              ) : null}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}