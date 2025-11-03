import Image from "next/image"

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-background-lySw4mttUHKLS1g0XNQBRUQiEA2Aiy.jpg"
        alt="خلفية مكتب المحاماة"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-background/90 backdrop-blur-[2px]" />
    </div>
  )
}
