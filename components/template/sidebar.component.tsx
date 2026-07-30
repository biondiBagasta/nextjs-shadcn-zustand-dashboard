"use client"

import Image from "next/image"
import SidebarMenuItemComponent from "./sidebar-menu-item.component"
import { ChartColumn, Tags } from "lucide-react"

interface SidebarProps {
  isOpenedSidebar: boolean
}

export default function SidebarComponent(props: SidebarProps) {
  return (
    <aside className={
      props.isOpenedSidebar ? 'sidebar' : 'sidebar close'
    }>
      <div className="mt-3">
        <div className="logo-details">
          <img alt="logo" src="/next.svg" className="logo-image" />
        </div>
      </div>

      <ul className="nav-links mt-5">
        <SidebarMenuItemComponent name="Dashboard" redirectRoute="main"
        icon={
          <ChartColumn size={24} />
        } />

        <SidebarMenuItemComponent name="Category" redirectRoute="category" icon={
          <Tags size={24} />
        }/>
      </ul>
    </aside>
  )
}