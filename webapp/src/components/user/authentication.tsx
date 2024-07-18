import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Path } from "@/constant"
import { useAccessStore } from "@/store"
import { Navigate, Route, Routes } from "react-router-dom"

function LoginForm() {
  const accessStore = useAccessStore()
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" onClick={()=>{
            accessStore.updateToken('666')
          }}>
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Authentication() {
  return (<div className="h-screen">
    <div className="flex items-center justify-center w-full h-full">
      <Routes>
        <Route path={Path.Base} element={<Navigate to={Path.SignIn} />} />
        <Route path={Path.SignIn} element={<LoginForm />} />
      </Routes>
    </div>
  </div>)
}
