'use client';

import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const navigationLinks = [
    { name: 'Empty Legs', href: '#empty-legs' },
    { name: 'Top Routes', href: '#top-routes' },
    { name: 'Our Jets', href: '#our-jets' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const legalLinks = [
    { name: 'Terms and conditions', href: '#terms' },
    { name: 'Privacy Policy', href: '#privacy' },
  ];

  return (
    <footer className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F142E] rounded-[24px] p-16">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            {/* Logo and Contact Info */}
            <div className="flex flex-col gap-11">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  Priority Flyers
                </span>
              </div>

              {/* Contact Details */}
              <div className="flex flex-col gap-12">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-6 h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Call us 24/7
                    </span>
                  </div>
                  <p
                    className="text-[#f2f2f2] text-[15px] font-medium tracking-[0.75px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    +1-415-854-2675
                  </p>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-6 h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      E-mail
                    </span>
                  </div>
                  <p
                    className="text-[#f2f2f2] text-[15px] font-medium tracking-[0.75px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    support@priorityflyers.com
                  </p>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-6 h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Adress
                    </span>
                  </div>
                  <p
                    className="text-[#f2f2f2] text-[15px] font-medium tracking-[0.75px] max-w-[253px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    5419 Palm Ave apt 11
                    <br />
                    Sacramento, CA 95841 USA
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-12">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#f2f2f2] text-[15px] font-medium tracking-[0.75px] hover:text-white transition-colors"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-12">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#f2f2f2] text-[15px] font-medium tracking-[0.75px] hover:text-white transition-colors"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
