'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Plane
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      subtitle: 'Call us 24/7',
      value: '+1-415-854-2675',
      href: 'tel:+14158542675'
    },
    {
      icon: Mail,
      title: 'Email',
      subtitle: 'Send us a message',
      value: 'support@priorityflyers.com',
      href: 'mailto:support@priorityflyers.com'
    },
    {
      icon: MapPin,
      title: 'Address',
      subtitle: 'Visit our office',
      value: '5419 Palm Ave apt 11\nSacramento, CA 95841 USA',
      href: 'https://maps.google.com/?q=5419+Palm+Ave+apt+11+Sacramento+CA+95841'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      subtitle: 'We are available',
      value: '24/7 Support Available',
      href: null
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Back to Home
            </span>
          </Link>

          {/* Title Section */}
          <div className="space-y-4">
            <h1
              className="text-5xl md:text-6xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Contact Us
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-2xl"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Have questions about private jet charters? Our team is here to help you 24/7.
              Reach out and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form Card */}
            <Card className="p-6 md:p-8 rounded-[24px] border-0 bg-card">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3
                    className="text-2xl font-medium text-foreground"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className="text-muted-foreground max-w-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Thank you for reaching out. Our team will contact you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="mt-4 rounded-full px-6"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2
                      className="text-2xl font-medium text-foreground mb-2"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      Send us a Message
                    </h2>
                    <p
                      className="text-muted-foreground text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Fill out the form below and we&apos;ll respond promptly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12 rounded-xl bg-background"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-12 rounded-xl bg-background"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 rounded-xl bg-background"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="subject"
                          className="text-sm font-medium"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Charter Inquiry"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="h-12 rounded-xl bg-background"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Your Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your travel needs, preferred dates, destinations, and any special requirements..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="rounded-xl bg-background resize-none"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full text-base font-medium gap-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </Card>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <Card
                    key={info.title}
                    className="p-5 rounded-[20px] border-0 bg-card hover:shadow-lg transition-shadow"
                  >
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.title === 'Address' ? '_blank' : undefined}
                        rel={info.title === 'Address' ? 'noopener noreferrer' : undefined}
                        className="block group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <info.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-xs text-muted-foreground mb-0.5"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {info.subtitle}
                            </p>
                            <h3
                              className="text-sm font-medium text-foreground mb-1"
                              style={{ fontFamily: 'Clash Display, sans-serif' }}
                            >
                              {info.title}
                            </h3>
                            <p
                              className="text-sm text-foreground/80 whitespace-pre-line group-hover:text-primary transition-colors"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {info.value}
                            </p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-xs text-muted-foreground mb-0.5"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {info.subtitle}
                          </p>
                          <h3
                            className="text-sm font-medium text-foreground mb-1"
                            style={{ fontFamily: 'Clash Display, sans-serif' }}
                          >
                            {info.title}
                          </h3>
                          <p
                            className="text-sm text-foreground/80 whitespace-pre-line"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {info.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Map Card */}
              <Card className="p-0 rounded-[24px] border-0 overflow-hidden bg-card">
                <div className="relative h-[300px] md:h-[350px] bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.8534867890756!2d-121.38847692392158!3d38.65825177176907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ae1f47ca3bf9f%3A0x62d22891b0fc7a8!2s5419%20Palm%20Ave%2C%20Sacramento%2C%20CA%2095841%2C%20USA!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </Card>

              {/* Quick Request CTA */}
              <Card className="p-6 rounded-[24px] border-0 bg-[#0F142E] text-white">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plane className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3
                      className="text-lg font-medium mb-1"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      Need a Quick Quote?
                    </h3>
                    <p
                      className="text-white/70 text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Get instant pricing for your private jet charter
                    </p>
                  </div>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="rounded-full px-6 border-white/30 text-white hover:bg-white hover:text-[#0F142E] transition-all"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
