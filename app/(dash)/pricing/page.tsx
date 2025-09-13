"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
    text: string;
    url: string;
  };
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "Basic",
      description: "Para uso pessoal",
      monthlyPrice: "MZN 121",
      yearlyPrice: "MZN 1,000",
      features: [
        { text: "Ate 1 dispositivo" },
      ],
      button: {
        text: "Comprar",
        url: "https://wa.me/258868785722?text=Olá%20gostaria%20de%20saber%20mais%20informações",
      },
    },
    {
      id: "plus",
      name: "Plus",
      description: "Para pequenos negocios",
      monthlyPrice: "MZN 360",
      yearlyPrice: "MZN 3,900",
      features: [
        { text: "Ate 5 dispositivos" },
      ],
      button: {
        text: "Comprar",
        url: "https://shadcnblocks.com",
      },
    },
    {
      id: "pro",
      name: "Pro",
      description: "Para empresas",
      monthlyPrice: "MZN 650",
      yearlyPrice: "MZN 6,800",
      features: [
        { text: "Dispositivos ilimitados" },
      ],
      button: {
        text: "Comprar",
        url: "https://shadcnblocks.com",
      },
    },
  ];

  return (
    <section className="py-8">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
            Precos
          </h2>
          <p className="text-muted-foreground lg:text-xl">
            Escolha a melho oferta para ti
          </p>

          <div className="flex items-center gap-3 text-lg">
            Mensal
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Anual
          </div>

          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="flex w-80 flex-col justify-between text-left"
              >
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex items-end">
                    <span className="text-4xl font-semibold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {isYearly ? "/ano" : "/mes"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "pro" && (
                    <p className="mb-3 font-semibold">
                      Tudo no plus, e:
                    </p>
                  )}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <a href={plan.button.url} target="_blank">
                      {plan.button.text}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
