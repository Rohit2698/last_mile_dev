export function HeroSection() {
  return (
    <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Streamline Your Cannabis Delivery
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
              Connect dispensaries, delivery partners, and drivers in one seamless platform.
              Create orders, manage deliveries, and track everything in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
