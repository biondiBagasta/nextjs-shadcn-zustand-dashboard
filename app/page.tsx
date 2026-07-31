"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if(jwt) {
    router.replace("/dashboard/main");
    } else {
    router.replace("/login");
    }
  })

  return <></>
}
