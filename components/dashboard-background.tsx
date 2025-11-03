import Image from "next/image"

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-background-lySw4mttUHKLS1g0XNQBRUQiEA2Aiy.jpg"
        alt="خلفية لوحة التحكم"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/95 to-primary/5 backdrop-blur-[1px]" />
    </div>
  )
}
