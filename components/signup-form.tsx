"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoImage } from "@/components/logo-image"


import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Loader2 } from "lucide-react"

import { useState, useEffect } from 'react';
import { createUser } from '@/services/api';
import { getToken } from '@/services/auth';
import { useRouter } from 'next/navigation';

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');

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
      if(password == password1) {

        const login = await createUser({
          name,
          surname,
          email,
          password,
        });

        setName("");
        setSurname("");
        setEmail("");
        setPassword("");
        setPassword1("");
        console.log(login);
        router.replace('/');
      }

    setLoading(false);

      
    } catch (error) {
      setName("");
      setSurname("");
      setEmail("");
      setPassword("");
      setPassword1("")
      setShowAlert(true)
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <LogoImage />
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John" 
            required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="surname">Apelido</Label>
          <Input
            id="surname" 
            type="text" 
            value={surname}
            onChange={e => setSurname(e.target.value)}
            placeholder="Doe" 
            required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@email.com" 
            required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password2">Repetir Senha</Label>
          </div>
          <Input 
            id="password1" 
            type="password" 
            value={password1}
            onChange={e => setPassword1(e.target.value)}
            required />
        </div>
        <Button className="mt-2" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aguarde
            </>
          ) : (
            'Cadastrar'
          )}
        </Button>   
      </div>

      {showAlert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Não foi possível criar uma conta.</AlertTitle>
          <AlertDescription>
            <p>O seu e-mail ja esta sendo usado.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center text-sm">
        Ja tem uma conta?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>

    </form>
  )
}
