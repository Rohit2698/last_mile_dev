import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Truck, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoleCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
}

export function RoleCards() {
  const roles: RoleCard[] = [
    {
      id: "dispensary",
      title: "Dispensary",
      description: "Create and manage orders for your customers",
      icon: <Building2 className="h-10 w-10" />,
      features: [
        "Create new orders",
        "Track order status",
        "Manage inventory",
        "View delivery history",
      ],
      color: "text-blue-500",
    },
    {
      id: "delivery-partner",
      title: "Delivery Partner",
      description: "Accept orders and coordinate deliveries",
      icon: <Truck className="h-10 w-10" />,
      features: [
        "View available orders",
        "Accept order requests",
        "Assign drivers",
        "Monitor delivery progress",
      ],
      color: "text-green-500",
    },
    {
      id: "driver",
      title: "Driver",
      description: "Deliver orders efficiently to customers",
      icon: <User className="h-10 w-10" />,
      features: [
        "View assigned deliveries",
        "Update delivery status",
        "Navigate to destinations",
        "Confirm successful deliveries",
      ],
      color: "text-purple-500",
    },
  ]

  return (
    <section id="roles" className="w-full flex justify-center py-12 md:py-24 lg:py-32">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.id}
              id={role.id}
              className="flex flex-col transition-all hover:shadow-lg hover:scale-105"
            >
              <CardHeader>
                <div className={`mb-4 ${role.color}`}>{role.icon}</div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardContent className="pt-0">
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
