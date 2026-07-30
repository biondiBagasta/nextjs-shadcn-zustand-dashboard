"use client"

import { usePathname, useRouter } from "next/navigation";
import React from "react"

interface SidebarMenuItemProps {
  icon: React.ReactNode;
  name: string;
  redirectRoute: string
}

export default function SidebarMenuItemComponent(props: SidebarMenuItemProps) {
  const router = useRouter()
  const pathName = usePathname()

  return (
    <li onClick={
      () => router.push("/dashboard/" + props.redirectRoute)
    } style={
      {
        cursor: 'pointer'
      }
    } className={
      pathName == `/dashboard/${props.redirectRoute}` ? 'menu-active mb-2' : 'mb-2'
    }>
      <a>
        { props.icon }
        <span className="link_name">{ props.name }</span>
      </a>
      <ul className="sub-menu blank">
        <li>
          <a className="link_name" onClick={
            () => router.push("/dashboard/" + props.redirectRoute)
          }>Master Customer</a>
        </li>
      </ul>
    </li>
  )
}