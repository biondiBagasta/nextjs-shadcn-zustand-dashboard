"use client"

import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface NoDataAlertComponentProps {
  title: string;
  description: string;
}

export default function NoDataAlertComponent(props: NoDataAlertComponentProps) {
  return (
    <Alert className="mt-3">
      <InfoIcon />
      <AlertTitle>{ props.title }</AlertTitle>
      <AlertDescription>
        { props.description }
      </AlertDescription>
    </Alert>
  )
}