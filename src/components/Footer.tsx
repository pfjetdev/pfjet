'use client';

import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const navigationLinks = [
    { name: 'Empty Legs', href: '/empty-legs' },
    { name: 'Top Routes', href: '#top-routes' },
    { name: 'Our Jets', href: '/aircraft' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms and conditions', href: '#terms' },
    { name: 'Privacy Policy', href: '#privacy' },
  ];

  return (
    <footer className="py-8 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F142E] rounded-[16px] md:rounded-[24px] p-6 md:p-16">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12">
            {/* Logo and Contact Info */}
            <div className="flex flex-col gap-6 md:gap-11">
              {/* Logo */}
              <div>
                <Image
                  src="/white-logo.svg"
                  alt="Logo"
                  width={170}
                  height={40}
                  className="h-5 w-auto"
                />
              </div>

              {/* Contact Details */}
              <div className="flex flex-col gap-6 md:gap-12">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-sm md:text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Call us 24/7
                    </span>
                  </div>
                  <a
                    href="tel:+14158542675"
                    className="text-[#f2f2f2] text-sm md:text-[15px] font-medium tracking-[0.75px] hover:text-white transition-colors active:text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    +1-415-854-2675
                  </a>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-sm md:text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      E-mail
                    </span>
                  </div>
                  <a
                    href="mailto:support@priorityflyers.com"
                    className="text-[#f2f2f2] text-sm md:text-[15px] font-medium tracking-[0.75px] hover:text-white transition-colors active:text-white break-all"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    support@priorityflyers.com
                  </a>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#f2f2f2]" />
                    <span
                      className="text-[#f2f2f2] text-sm md:text-[15px] font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Address
                    </span>
                  </div>
                  <p
                    className="text-[#f2f2f2] text-sm md:text-[15px] font-medium tracking-[0.75px] max-w-[253px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    5419 Palm Ave apt 11
                    <br />
                    Sacramento, CA 95841 USA
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation and Legal Links - Combined on Mobile */}
            <div className="grid grid-cols-2 gap-6 md:flex md:flex-row md:gap-12 lg:gap-16">
              {/* Navigation Links */}
              <div className="flex flex-col gap-4 md:gap-12">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[#f2f2f2] text-sm md:text-[15px] font-medium tracking-[0.75px] hover:text-white active:text-white transition-colors py-1"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex flex-col gap-4 md:gap-12">
                {legalLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[#f2f2f2] text-sm md:text-[15px] font-medium tracking-[0.75px] hover:text-white active:text-white transition-colors py-1"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
