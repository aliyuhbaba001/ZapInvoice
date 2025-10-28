import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Download, Zap, Shield, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Create professional invoices in under 2 minutes"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your business data"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Multiple Formats",
      description: "Export as PDF, HTML, or print directly"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Real-time Preview",
      description: "See your invoice update as you type"
    }
  ];

  const benefits = [
    "Professional branded invoices",
    "Automated calculations",
    "Multiple currency support",
    "Instant export options",
    "Mobile responsive design",
    "No registration required"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ZapInvoice</h1>
              <p className="text-sm text-muted-foreground font-medium">Lightning Fast Invoicing</p>
            </div>
          </div>
          <Button onClick={() => navigate('/invoice')} className="gap-2">
            Create Invoice
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-6 animate-pulse">
            ⚡ Lightning Fast Invoice Generation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Create Stunning Invoices in
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse block">Seconds, Not Hours</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            Transform your billing with ZapInvoice - the fastest way to create professional, 
            branded invoices that get you paid faster. No setup required!
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate('/invoice')} className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold">
              ⚡ Create Invoice Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why ZapInvoice is Different</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Built for speed, designed for impact. Create invoices that impress clients and get paid faster.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Everything You Need, Nothing You Don't</h2>
              <p className="text-muted-foreground mb-8 font-medium">
                ZapInvoice gives you powerful features without the complexity. 
                Create professional invoices that make your business look amazing.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="space-y-4">
                  <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="h-6 bg-primary/30 rounded w-1/3 ml-auto"></div>
                  </div>
                </div>
              </Card>
              <div className="absolute -top-4 -right-4 h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Zap Your Way to Better Invoicing? ⚡
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg font-medium">
            Join thousands of businesses creating stunning invoices in seconds
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/invoice')}
            className="gap-2"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ZapInvoice</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} ZapInvoice. Lightning-fast professional invoicing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;