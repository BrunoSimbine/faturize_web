import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"


export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "Pendente",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Pago",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Cancelado",
    icon: CrossCircledIcon,
  },
]

