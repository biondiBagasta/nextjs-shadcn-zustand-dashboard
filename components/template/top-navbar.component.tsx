"use client"

import { User } from "@/interfaces/user"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface TopNavbarProps {
  isOpenedSidebar: boolean
  onClickSidebarIcon: () => void
  user: User
}

export default function TopNavbarComponent(props: TopNavbarProps) {
  const [showUserDropdown, setUserDropdown] = useState(false);

  const router = useRouter();

  const logout = () => {
		localStorage.removeItem("rust-jwt");
		router.replace("/login");
	}

  return (
    <div className="top-navbar">
      <div className="bx-menu mt-2" onClick={
        () => props.onClickSidebarIcon()
      }>
        <Menu size={ 24 } className="text-black" />

      </div>

      <div>
        <div className="header-user mt-2 cursor-pointer" onClick={
          () => setUserDropdown(!showUserDropdown)
        }>
          <div className="flex-1 min-w-0 text-base text-black truncate">
              {
                Object.keys(props.user).length > 0 ?
                (
                  <>
                    { props.user.full_name} 
                  </>
                ) : (<></>)
              }
          </div>
          <Avatar>
            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
            <AvatarFallback>
              BB
            </AvatarFallback>
          </Avatar>
        </div>

        {
          showUserDropdown ? (
            <div className="dropdown-user">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
                <AvatarFallback>
                  BB
                </AvatarFallback>
              </Avatar>
              
              <div className="text-base font-semibold">
                {
                  Object.keys(props.user).length > 0 ?
                  (
                    <>
                      { props.user.full_name} 
                    </>
                  ) : (<></>)
                }
              </div>

              <div className="dropdown-button mt-2">
                <Button className="w-full cursor-pointer">Profile</Button>
                <Button className="w-full cursor-pointer" variant={'destructive'} onClick={
                  () => logout()
                }>
                  Logout
                </Button>
              </div>
            </div>
          ) : (<></>)
        }
      </div>
    </div>
  )
}