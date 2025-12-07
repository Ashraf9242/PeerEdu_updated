"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Star, GraduationCap, Clock, Shield, Target, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <Link href="/register">{t("hero.cta.primary")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent" asChild>
                <Link href="/about">{t("hero.cta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{t("works.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("works.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{t("works.connect.title")}</h3>
                <p className="text-muted-foreground">{t("works.connect.desc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{t("works.learn.title")}</h3>
                <p className="text-muted-foreground">{t("works.learn.desc")}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{t("works.excel.title")}</h3>
                <p className="text-muted-foreground">{t("works.excel.desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{t("features.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("features.expert.title")}</h3>
                <p className="text-muted-foreground">{t("features.expert.desc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("features.flexible.title")}</h3>
                <p className="text-muted-foreground">{t("features.flexible.desc")}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("features.secure.title")}</h3>
                <p className="text-muted-foreground">{t("features.secure.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Message Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("message.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("message.content")}</p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("vision.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("vision.content")}</p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("mission.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("mission.content")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">{t("ceo.title")}</h2>
              <p className="text-lg text-muted-foreground">{t("ceo.subtitle")}</p>
            </div>

            <Card className="p-8 md:p-12">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-16 w-16 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="font-serif text-2xl font-bold mb-2">{t("ceo.name")}</h3>
                    <p className="text-primary font-medium mb-4">{t("ceo.position")}</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">{t("ceo.bio1")}</p>
                    <p className="text-muted-foreground leading-relaxed">{t("ceo.bio2")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link href="/register">{t("cta.student")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/register">{t("cta.tutor")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
