const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_TEMPLATE_ID = process.env.SMS_TEMPLATE_ID;
const SMS_BASE_URL = "http://135.181.19.87/Login/V2/apikey.php";

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');

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

export async function sendSMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
  if (!SMS_API_KEY || !SMS_SENDER_ID || !SMS_TEMPLATE_ID) {
    throw new Error('SMS API credentials not configured');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const message = `Ramani Fashion: Your Login OTP is ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;

  const params = new URLSearchParams({
    apikey: SMS_API_KEY,
    senderid: SMS_SENDER_ID,
    templateid: SMS_TEMPLATE_ID,
    number: formattedPhone,
    message,
  });

  const url = `${SMS_BASE_URL}?${params.toString()}`;

  try {
    console.log('Sending SMS OTP to:', formattedPhone, 'OTP:', otp);

    const response = await fetch(url, { method: 'GET' });
    const responseText = await response.text();

    console.log('SMS API response:', responseText);

    if (responseText.toLowerCase().includes('invalid') || responseText.toLowerCase().includes('failure')) {
      throw new Error(`SMS API error: ${responseText}`);
    }

    console.log('SMS OTP sent successfully to:', formattedPhone);
    return true;
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    throw error;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
