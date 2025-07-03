"use client"

import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoImage } from "@/components/logo-image"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

import { useState, useEffect } from 'react';
import { createLogin } from '@/services/api';
import { getToken } from '@/services/auth';
import { useRouter } from 'next/navigation';


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await createLogin({
        email,
        password,
      });

      setPassword("");
      setEmail("");
      setShowAlert(false)
      setLoading(false);
      router.replace('/');
    } catch (error) {
      console.log(error)
      setPassword("");
      setEmail("");
      setLoading(false);
      setShowAlert(true)
    }
  };
return (
    <div className="flex min-h-screen items-center justify-center">
      <div className={cn("flex flex-col gap-6 max-w-sm w-full", className)} {...props}>
        
        <div className="flex flex-col items-center text-center">
          <LogoImage />
        </div>

        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 ">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
                <div className="text-center text-sm">
                  Não tens uma conta?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {showAlert && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Não foi possível processar o seu Login.</AlertTitle>
            <AlertDescription>
              <p>Os problemas mais prováveis podem ser:</p>
              <ul className="list-inside list-disc text-sm">
                <li>E-mail ou senha incorreta.</li>
                <li>Falha na conexão à internet.</li>
                <li>Usuário sem conta criada.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          Ao continuar, concordas com os nossos <a href="#">Termos de Serviço</a>{" "}
          e <a href="#">Políticas de Privacidade</a>.
        </div>
      </div>
    </div>
  )
}
