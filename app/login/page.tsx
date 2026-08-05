"use client"

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { useServiceStore } from "@/store/service.stroe";
import { useAuthenticatedStore } from "@/store/authenticated.store";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { showHttpErrorToast } from "@/lib/axios";
import { Spinner } from "@/components/ui/spinner";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const subscriptionRef = useRef(new Subscription())

  const authService = useServiceStore((state) => state.authService)

  const setAuthenticatedState = useAuthenticatedStore((state) => state.setUserState)

  const router = useRouter();

  useEffect(() => {
		const jwt = localStorage.getItem("jwt");

		subscriptionRef.current = new Subscription();

		if(jwt) {
			router.replace("/dashboard/main");
		}

		return () => {
			subscriptionRef.current.unsubscribe();
		}
	}, [router]);


  useEffect(() => {
    return () => {
      subscriptionRef.current.unsubscribe()
    }
  }, [])

  // useEffect(() => {
  // }, [router])

  const login = () => {

    const username = loginForm.username;
    const password = loginForm.password;

    if(!username || !password) {
      if(!username) {
        toast.add({
          title: "PERHATIAN",
          type: "error",
          description: "Username harus diisi."
        })
      }

      if(!password) {
        toast.add({
          title: "PERHATIAN",
          type: "error",
          description: "Password harus diisi."
        })
      }
    } else {
      setIsLoadingSubmit(true);

      const loginSubscription = authService.login(loginForm.username, loginForm.password).pipe(
        tap((data) => {
          
          window.localStorage.setItem("jwt", data.token)

          setIsLoadingSubmit(false);
          setAuthenticatedState(data);

          router.push("/dashboard/main")
        }),
        catchError((e: AxiosError) => {
          setIsLoadingSubmit(false);

          setLoginForm({
            username: "",
            password: ""
          })
          showHttpErrorToast(e);
          return EMPTY
        })
      ).subscribe();

      subscriptionRef.current.add(loginSubscription)
    }
  }

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center p-4">
      <Card className="w-full md:w-lg">
        <CardHeader>
          <Image alt="logo" src="next.svg" className="m-auto mb-10" width={ 128 } height={ 0 } />
          <CardTitle className="text-lg font-semibold">Login ke Sistem</CardTitle>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <Input id="username" 
                name="username"
                placeholder="Username" required value={
                  loginForm.username
                } onChange={
                  (e) => handleFormChange(e)
                }></Input>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <Input id="password" 
                name="password"
                type="password" placeholder="Password"
                required value={
                  loginForm.password
                } onChange={ handleFormChange }></Input>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full h-12 cursor-pointer" onClick={ login }>
            {
              isLoadingSubmit ? <Spinner data-icon="inline-start"></Spinner> : <></>
            }
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}