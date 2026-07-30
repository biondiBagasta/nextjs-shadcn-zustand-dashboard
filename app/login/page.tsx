"use client"

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
                <Input id="username" placeholder="Username" required value={
                  loginForm.username
                } onChange={
                  (e) => handleFormChange(e)
                }></Input>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" placeholder="Password"
                required value={
                  loginForm.password
                } onChange={ handleFormChange }></Input>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full h-12">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}