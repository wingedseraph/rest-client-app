import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('Hello')

  return <p>{t('title')}</p>
}
