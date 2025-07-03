'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function LogoImage() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Garante que só renderiza após montar no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Retorna um placeholder neutro, evita mismatch no SSR
    return <img style={{ height: '30px', width: 'auto' }} src="https://minio.privaxnet.com/faturize/logo_light.png" alt="Logo" />
  }

  const imageSrc =
    theme === 'dark' || resolvedTheme === 'dark'
      ? <img style={{ height: '30px', width: 'auto' }} src="https://minio.privaxnet.com/faturize/logo_dark.png" alt="Logo Dark" />
      : <img style={{ height: '30px', width: 'auto' }} src="https://minio.privaxnet.com/faturize/logo_light.png" alt="Logo Light" />

  return imageSrc
}
