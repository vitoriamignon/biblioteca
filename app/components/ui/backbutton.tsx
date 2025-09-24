'use client'

import { useRouter } from 'next/navigation'
import { Button } from './button'
import styles from './backbutton.module.css'

export function BackButton() {
  const router = useRouter()

  return (
    <div className={styles.containerVoltar}>
      <Button variant="outline" onClick={() => router.back()}>
        Voltar
      </Button>
    </div>
  )
}