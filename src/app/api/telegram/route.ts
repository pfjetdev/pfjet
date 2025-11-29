import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface OrderData {
  name: string;
  email: string;
  phone: string;
  order_type: string;
  from_location?: string;
  to_location?: string;
  departure_date?: string;
  departure_time?: string;
  passengers?: number;
  product_name?: string;
  product_type?: string;
  price?: number;
  message?: string;
}

// Convert 24h time to 12h AM/PM format
function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Format date as "Dec 26, 2025"
function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatOrderMessage(data: OrderData): string {
  const orderTypeLabels: Record<string, string> = {
    charter: '✈️ Charter',
    empty_leg: '🏷️ Empty Leg',
    jet_sharing: '👥 Jet Sharing',
    contact: '📩 Contact Form',
    multi_city: '🌍 Multi-City',
    search: '🔍 Search Request',
  };

  const typeLabel = orderTypeLabels[data.order_type] || data.order_type;

  let message = `🚀 *New Order*\n\n`;
  message += `*Type:* ${typeLabel}\n`;
  message += `━━━━━━━━━━━━━━━\n\n`;

  // Contact info
  message += `👤 *Contact Info*\n`;
  message += `• Name: ${data.name}\n`;
  message += `• Email: ${data.email}\n`;
  message += `• Phone: ${data.phone}\n\n`;

  // Flight details (if available)
  if (data.from_location || data.to_location) {
    message += `✈️ *Flight Details*\n`;
    if (data.from_location) message += `• From: ${data.from_location}\n`;
    if (data.to_location) message += `• To: ${data.to_location}\n`;
    if (data.departure_date) message += `• Date: ${formatDateReadable(data.departure_date)}\n`;
    if (data.departure_time) message += `• Time: ${formatTime12h(data.departure_time)}\n`;
    if (data.passengers) message += `• Passengers: ${data.passengers}\n`;
    message += `\n`;
  }

  // Product info (if available)
  if (data.product_name) {
    message += `🛩️ *Product*\n`;
    message += `• ${data.product_name}\n`;
    if (data.price) message += `• Price: $${data.price.toLocaleString()}\n`;
    message += `\n`;
  }

  // Message (for contact form)
  if (data.message) {
    message += `💬 *Message*\n`;
    message += `${data.message}\n\n`;
  }

  message += `━━━━━━━━━━━━━━━\n`;
  message += `📅 ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST`;

  return message;
}

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return NextResponse.json({ success: true, warning: 'Telegram not configured' });
    }

    const data: OrderData = await request.json();
    const message = formatOrderMessage(data);

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return NextResponse.json(
        { success: false, error: result.description },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send to Telegram' },
      { status: 500 }
    );
  }
}
