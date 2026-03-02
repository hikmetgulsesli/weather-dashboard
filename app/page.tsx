import { Cloud, Sun, Wind, Droplets, Thermometer, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Cloud className="h-4 w-4" />
              Real-time Weather Data
            </div>
            <h1 
              className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Weather Dashboard
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Get accurate weather forecasts, current conditions, and interactive maps 
              for any location worldwide.
            </p>
            
            {/* Search placeholder */}
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Search for a city... (coming soon)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 
              className="mb-4 text-3xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Features
            </h2>
            <p className="text-muted-foreground">Everything you need to track weather conditions</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Thermometer className="h-6 w-6 text-primary" />
                </div>
                <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Current Weather</CardTitle>
                <CardDescription>
                  Real-time temperature, humidity, and conditions for any location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View detailed current conditions including temperature, feels-like, 
                  humidity, wind speed, and visibility.
                </p>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Sun className="h-6 w-6 text-accent" />
                </div>
                <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>5-Day Forecast</CardTitle>
                <CardDescription>
                  Extended forecast with daily highs, lows, and conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plan ahead with accurate 5-day weather predictions including 
                  temperature trends and precipitation chances.
                </p>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Wind className="h-6 w-6 text-success" />
                </div>
                <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Wind & Pressure</CardTitle>
                <CardDescription>
                  Detailed wind speed, direction, and atmospheric pressure data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor wind conditions with speed, gusts, and directional 
                  indicators plus barometric pressure readings.
                </p>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <Droplets className="h-6 w-6 text-info" />
                </div>
                <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Precipitation</CardTitle>
                <CardDescription>
                  Rain, snow, and precipitation probability tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay informed about precipitation chances, rainfall amounts, 
                  and snow accumulation forecasts.
                </p>
              </CardContent>
            </Card>

            <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 lg:col-span-2">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Interactive Maps</CardTitle>
                <CardDescription>
                  Visual weather maps with radar, temperature, and precipitation layers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore weather patterns with interactive maps featuring multiple layers 
                  including temperature, precipitation radar, cloud cover, and wind patterns. 
                  Zoom and pan to explore any region worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
                Weather Dashboard
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
