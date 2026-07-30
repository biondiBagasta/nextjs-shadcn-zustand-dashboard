"use client"

import React, { useEffect, useState } from "react";
import { useAuthenticatedStore } from "../store/authenticated.store";
import SidebarComponent from "@/components/template/sidebar.component";
import TopNavbarComponent from "@/components/template/top-navbar.component";

export default function DashboardLayout({
  children
}: { children: React.ReactNode }) {
  const [isOpenedSidebar, setIsOpenedSidebar] = useState(true)

  const userState = useAuthenticatedStore((state) => state.userState)
  const setUserState = useAuthenticatedStore((state) => state.setUserState)

  useEffect(() => {

  })

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