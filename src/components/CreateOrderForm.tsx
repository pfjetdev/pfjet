'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface CreateOrderFormProps {
  jetName: string;
  price: string;
  hideTitle?: boolean;
  isJetSharing?: boolean;
  availableSeats?: number;
  selectedPassengers?: number;
}

export default function CreateOrderForm({
  jetName,
  price,
  hideTitle = false,
  isJetSharing = false,
  availableSeats = 1,
  selectedPassengers = 1
}: CreateOrderFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [orderConditionsOpen, setOrderConditionsOpen] = useState(false);
  const [cancellationPolicyOpen, setCancellationPolicyOpen] = useState(false);

  // Extract price number from string (e.g., "$ 2,340" -> 2340)
  const pricePerSeat = parseFloat(price.replace(/[^0-9.]/g, ''));
  const totalPrice = isJetSharing ? pricePerSeat * selectedPassengers : pricePerSeat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order created:', { jetName, name, email, phone: `${countryCode}${phone}`, price });
  };

  return (
    <div className="bg-[#0F142E] dark:bg-card rounded-2xl p-4 sm:p-8 border border-border lg:sticky lg:top-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Title */}
        {!hideTitle && (
          <h3
            className="text-xl sm:text-2xl font-medium text-white dark:text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Create Order
          </h3>
        )}

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/70 dark:text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-background border border-white/20 dark:border-border text-white dark:text-foreground placeholder:text-white/50 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-primary/30 hover:bg-white/15 dark:hover:bg-accent transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/70 dark:text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 dark:bg-background border border-white/20 dark:border-border text-white dark:text-foreground placeholder:text-white/50 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-primary/30 hover:bg-white/15 dark:hover:bg-accent transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            required
          />
        </div>

        {/* Phone Input with Country Code */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-white/70 dark:text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Phone
          </label>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-3 rounded-xl bg-white/10 dark:bg-background border border-white/20 dark:border-border text-white dark:text-foreground focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-primary/30 hover:bg-white/15 dark:hover:bg-accent transition-all cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+7">🇷🇺 +7</option>
              <option value="+373">🇲🇩 +373</option>
            </select>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 dark:bg-background border border-white/20 dark:border-border text-white dark:text-foreground placeholder:text-white/50 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-primary/30 hover:bg-white/15 dark:hover:bg-accent transition-all"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              required
            />
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-white/5 dark:bg-background rounded-xl p-4 sm:p-6 border border-white/10 dark:border-border">
          <p
            className="text-xs sm:text-sm font-medium text-white/70 dark:text-muted-foreground mb-1 sm:mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Total Price
          </p>
          <p
            className="text-3xl sm:text-4xl font-bold text-white dark:text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            $ {totalPrice.toLocaleString()}
          </p>
          {isJetSharing && selectedPassengers > 1 && (
            <p
              className="text-xs text-white/60 dark:text-muted-foreground mt-1"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              $ {pricePerSeat.toLocaleString()} × {selectedPassengers} passengers
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-between px-6 py-4 bg-[#DF1F3D] hover:bg-[#c91a35] text-white rounded-full transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl group"
        >
          <span
            className="text-sm font-bold tracking-wider uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Create Order
          </span>
          <div className="w-6 h-6 bg-white text-[#DF1F3D] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
          </div>
        </button>

        {/* Order Conditions */}
        <div className="border-t border-white/10 dark:border-border pt-6">
          <button
            type="button"
            onClick={() => setOrderConditionsOpen(!orderConditionsOpen)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span
              className="text-sm font-medium text-white dark:text-foreground group-hover:text-white/80 dark:group-hover:text-foreground/80 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Order conditions
            </span>
            {orderConditionsOpen ? (
              <ChevronUp className="w-4 h-4 text-white/70 dark:text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/70 dark:text-muted-foreground" />
            )}
          </button>
          {orderConditionsOpen && (
            <div
              className="mt-4 text-sm text-white/70 dark:text-muted-foreground space-y-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <p>• Full payment required at booking confirmation</p>
              <p>• Flight schedule subject to weather conditions</p>
              <p>• Additional charges may apply for route changes</p>
              <p>• Passengers must arrive 30 minutes before departure</p>
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="border-t border-white/10 dark:border-border pt-6">
          <button
            type="button"
            onClick={() => setCancellationPolicyOpen(!cancellationPolicyOpen)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span
              className="text-sm font-medium text-white dark:text-foreground group-hover:text-white/80 dark:group-hover:text-foreground/80 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Cancellation policy
            </span>
            {cancellationPolicyOpen ? (
              <ChevronUp className="w-4 h-4 text-white/70 dark:text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/70 dark:text-muted-foreground" />
            )}
          </button>
          {cancellationPolicyOpen && (
            <div
              className="mt-4 text-sm text-white/70 dark:text-muted-foreground space-y-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <p>• 100% refund if cancelled 48+ hours before departure</p>
              <p>• 50% refund if cancelled 24-48 hours before departure</p>
              <p>• No refund if cancelled less than 24 hours before departure</p>
              <p>• Weather-related cancellations eligible for full refund or rescheduling</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
