"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BookOpen, Target, Eye, Heart, Award, Clock, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">{t("about.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">{t("about.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("about.story.title")}
              </h2>
              <p className="text-lg text-muted-foreground">{t("about.story.subtitle")}</p>
            </div>

            <Card className="p-8 md:p-12">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-6">{t("about.story.p1")}</p>
                  <p className="mb-6">{t("about.story.p2")}</p>
                  <p>{t("about.story.p3")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.foundation.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("about.foundation.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("about.mission.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.mission.content")}</p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("about.vision.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.vision.content")}</p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{t("about.values.title")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("about.values.content")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.different.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("about.different.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.peer.title")}</h3>
                  <p className="text-muted-foreground">{t("about.peer.desc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.flexible.title")}</h3>
                  <p className="text-muted-foreground">{t("about.flexible.desc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.safe.title")}</h3>
                  <p className="text-muted-foreground">{t("about.safe.desc")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.expertise.title")}</h3>
                  <p className="text-muted-foreground">{t("about.expertise.desc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.results.title")}</h3>
                  <p className="text-muted-foreground">{t("about.results.desc")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t("about.growth.title")}</h3>
                  <p className="text-muted-foreground">{t("about.growth.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.leadership.title")}
            </h2>
            <p className="text-lg text-muted-foreground">{t("about.leadership.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-20 w-20 text-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="font-serif text-3xl font-bold mb-2">{t("ceo.name")}</h3>
                    <p className="text-primary font-medium text-lg mb-4">{t("ceo.position")}</p>
                    <div className="space-y-4 text-muted-foreground">
                      <p>{t("about.ceo.bio1")}</p>
                      <p>{t("about.ceo.bio2")}</p>
                      <p>{t("about.ceo.bio3")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t("about.impact.title")}</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">{t("about.impact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">{t("about.stats.students")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">{t("about.stats.sessions")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">{t("about.stats.subjects")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">{t("about.stats.satisfaction")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t("about.join.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t("about.join.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/register">{t("about.join.cta")}</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent" asChild>
              <Link href="/">{t("about.join.back")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
