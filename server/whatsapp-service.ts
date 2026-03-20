const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BASE_URL = "https://cloudapi.akst.in/api/v1.0/messages";

interface WhatsAppOTPParams {
  phoneNumber: string;
  otp: string;
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned;
  }
  
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  if (cleaned.length === 10) {
    return '91' + cleaned;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned;
  }
  
  throw new Error(`Invalid phone number format. Expected 10-digit number or 12-digit number with country code, got: ${phone} (cleaned: ${cleaned})`);
}

export async function sendWhatsAppOTP({ phoneNumber, otp }: WhatsAppOTPParams): Promise<boolean> {
  if (!WHATSAPP_API_KEY || !WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error('WhatsApp API credentials not configured');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formattedPhone,
    type: "template",
    template: {
      name: "otptest",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp
            }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: otp
            }
          ]
        }
      ]
    }
  };

  try {
    const url = `${WHATSAPP_BASE_URL}/send-template/${WHATSAPP_PHONE_NUMBER_ID}`;
    console.log('Sending WhatsApp OTP to:', formattedPhone, 'OTP:', otp);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error:', errorText);
      throw new Error(`Failed to send WhatsApp message: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('WhatsApp OTP sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    throw error;
  }
}

export async function sendOrderConfirmation(phoneNumber: string, orderNumber: string, customerName: string): Promise<boolean> {
  if (!WHATSAPP_API_KEY || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('WhatsApp API credentials not configured for order confirmation');
    return false;
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: false,
        body: `Hi ${customerName},\n\nYour order #${orderNumber} has been confirmed and is being processed. You'll receive a tracking update soon.\n\nThank you for shopping with Ramani Fashion!`
      }
    };

    const response = await fetch(`${WHATSAPP_BASE_URL}/send/${WHATSAPP_PHONE_NUMBER_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp order confirmation error:', errorText);
      return false;
    }

    console.log('Order confirmation sent to:', formattedPhone);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
