"use client"
import Link from "next/link"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { isBefore, startOfDay } from "date-fns"
import { createOrder } from '@/services/api';
import { useRouter } from 'next/navigation';

const mozContactRegex = /^(?:82|83|84|85|86|87)\d{7}$/

const formSchema = z.object({
  amount: z
    .string(),
  contact: z
    .string()
    .optional()
    .refine((value) => !value || mozContactRegex.test(value), {
      message: "Número inválido. Deve ser um contacto moçambicano válido.",
    }),
  description: z
    .string()
    .max(25, { message: "A descrição deve ter no máximo 25 caracteres." })
    .optional(),
})

type Payload = {
  amount: number;
  client?: string;
  description?: string;
  expires?: string;
};


export default function AddOrderPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: "",
      amount: "", // ou 0 se quiser deixar desativado até o usuário digitar
      description: "",
    },
  })
const timeRef = React.useRef<HTMLInputElement>(null)

async function onSubmit(data: z.infer<typeof formSchema>) {
  const time = timeRef.current?.value || "23:59:00";

  let expires: string | undefined = undefined;

  if (enabledValidity && date) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);
    combinedDate.setSeconds(seconds);

    expires = combinedDate.getTime().toString(); // Convertendo para string
  }

  const payload: Payload = {
    amount: Number(data.amount),
    ...(data.contact && { client: "+258" + data.contact }),
    ...(data.description?.trim() && { description: data.description.trim() }),
    ...(expires && { expires }), // expires já é uma string
  };

  const order = await createOrder(payload);
  router.replace('/orders/detail/' + order.id);
}



  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [enabledValidity, setEnabledValidity] = React.useState(false)

  return (
    <div className="p-2 mt-4 md:px-3">
      <Breadcrumb className="pb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/orders">Pagamentos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Adicionar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="border-b pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gerar Pagamento</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg mb-2 font-medium">Fatura</h3>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            {/* Prefixo +258 */}
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground select-none pointer-events-none">
                              MZN
                            </span>

                            {/* Campo de input */}
                            <Input
                              {...field}
                              type="number"
                              placeholder="100"
                              className="pl-12 h-10 text-sm"
                            />                          
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descricao (Opcional)</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Textarea
                              placeholder="Type your message here."
                              maxLength={25}
                              {...field}
                            />                          
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>  
            </div>
            <div>
              <h3 className="text-lg mb-2 font-medium">Notificacoes</h3>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contacto (Opcional)</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            {/* Prefixo +258 */}
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground select-none pointer-events-none">
                              +258
                            </span>

                            {/* Campo de input */}
                            <Input
                              {...field}
                              type="tel"
                              id="phone"
                              placeholder="84xxxxxxx"
                              className="pl-14 h-10 text-sm"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-2 font-medium">Validade</h3>
              <div className="grid gap-3">     
                <div className="grid gap-3">
                  <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-accent/50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-accent/50">
                    <Checkbox
                      id="toggle-2"
                      checked={enabledValidity}
                      onCheckedChange={(checked) => setEnabledValidity(!!checked)}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        Habilitar validade
                      </p>
                      <p className="text-muted-foreground text-sm">
                        As suas ordens de pagamento podem expirar.
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="grid gap-3">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3 w-full">
                      <Label htmlFor="date-picker" className="px-1">
                        Date
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="justify-between font-normal"
                            disabled={!enabledValidity}
                          >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="time-picker" className="px-1">
                        Time
                      </Label>
                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        defaultValue="23:59:00"
                        disabled={!enabledValidity}
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <Button type="submit" className="w-full my-4">Gerar</Button>
            </div>

          </div>
        </form>
      </Form>
    </div>
  )
}
