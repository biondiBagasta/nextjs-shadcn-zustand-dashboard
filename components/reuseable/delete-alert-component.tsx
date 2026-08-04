import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dispatch, ReactElement, SetStateAction } from "react";
import { Spinner } from "../ui/spinner";

interface DeleteAlertComponentProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  onSubmit: () => void
  trigger: ReactElement
  isLoadingSubmit: boolean
}

export function DeleteAlertComponent(props: DeleteAlertComponentProps) {
  return (
    <AlertDialog open={ props.isOpen} onOpenChange={ props.setIsOpen }>
      <AlertDialogTrigger render={
        props.trigger
      } />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ props.title }</AlertDialogTitle>
          <AlertDialogDescription>
            { props.description }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction  className="cursor-pointer" onClick={ props.onSubmit }>
            {
              props.isLoadingSubmit ? <Spinner data-icon="inline-start"></Spinner> : <></>
            }
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
