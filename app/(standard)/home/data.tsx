import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
} from '@tabler/icons-react'

export const apps = [
  {
    name: 'Multiusuarios',
    logo: <IconBrandTelegram />,
    connected: false,
    desc: 'Permite colaboracao entre varios usuarios com diferentes niveis de acesso.',
  },
  {
    name: 'Modo Programador',
    logo: <IconBrandNotion />,
    connected: true,
    desc: 'Permite integracao com sistemas externos atravez de chamadas as nossas APIs e callbacks.',
  },
  {
    name: 'PagOnline',
    logo: <IconBrandFigma />,
    connected: true,
    desc: 'Permite que  clientes paguem usando Visa/MasterCard, SIMO e outros canais.',
  },

]
