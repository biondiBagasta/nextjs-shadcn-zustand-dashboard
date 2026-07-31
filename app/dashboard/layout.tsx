"use client"

import React, { useEffect, useRef, useState } from "react";
import { useAuthenticatedStore } from "@/store/authenticated.store";
import SidebarComponent from "@/components/template/sidebar.component";
import TopNavbarComponent from "@/components/template/top-navbar.component";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/store/service.stroe";
import { AxiosError } from "axios";
import { showHttpErrorToast } from "@/lib/axios";

export default function DashboardLayout({
  children
}: { children: React.ReactNode }) {
  const [isOpenedSidebar, setIsOpenedSidebar] = useState(true)

  const router = useRouter()

  const userState = useAuthenticatedStore((state) => state.userState)
  const setUserState = useAuthenticatedStore((state) => state.setUserState)

  const subscriptionRef = useRef(new Subscription())

  const authService = useServiceStore((state) => state.authService)

  const checkAuthenticated = () => {
    const jwt = window.localStorage.getItem("jwt")

    if(!jwt) {
      router.replace("/login")
    } else {
      const authenticatedSubscription = authService.authenticated().pipe(
        tap(data => {
          localStorage.setItem("jwt", data.password)
          setUserState(data)
        }),
        catchError((e: AxiosError) => {
          if(e.status == 401) {
            showHttpErrorToast(e);
            localStorage.removeItem("jwt")

            router.replace("/login");
          } else {
            showHttpErrorToast(e);
          }

          return EMPTY
        })
      ).subscribe();

      subscriptionRef.current.add(authenticatedSubscription)
    }
  }

  useEffect(() => {
    checkAuthenticated();

    return () => {
      subscriptionRef.current.unsubscribe();
    }
  }, [])

  return (
    <div className="layout">
      <SidebarComponent isOpenedSidebar={ isOpenedSidebar}  />

      <main className="home-section">
        <TopNavbarComponent isOpenedSidebar={ isOpenedSidebar } onClickSidebarIcon={
          () => {
            setIsOpenedSidebar(!isOpenedSidebar)
          }
        } user={ userState } />

        <div className="p-3">
          { children }
        </div>
      </main>
    </div>
  )
}