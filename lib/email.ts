import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
  console.warn('Email configuration is incomplete. Email sending will not work.');
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587'),
  secure: SMTP_PORT === '465',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendOrderConfirmation(
  customerEmail: string,
  orderNumber: string,
  orderTotal: number,
  items: Array<{ productName: string; quantity: number; price: number }>
) {
  const itemsList = items.map((item) => `- ${item.productName} x${item.quantity}: ₹${item.price}`).join('\n');

  const mailOptions = {
    from: SMTP_USER,
    to: customerEmail,
    subject: `Order Confirmation - Dark Zone #${orderNumber}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Thank you for your order at Dark Zone.</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Order Total:</strong> ₹${orderTotal}</p>
      <h3>Items Ordered:</h3>
      <pre>${itemsList}</pre>
      <p>We will update you soon with shipping details.</p>
      <p>Best regards,<br>Dark Zone Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendOrderStatusUpdate(
  customerEmail: string,
  orderNumber: string,
  status: string
) {
  const statusMessages: { [key: string]: string } = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    shipped: 'Your order has been shipped!',
    delivered: 'Your order has been delivered!',
    cancelled: 'Your order has been cancelled.',
  };

  const mailOptions = {
    from: SMTP_USER,
    to: customerEmail,
    subject: `Order Update - Dark Zone #${orderNumber}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Your order #${orderNumber} status has been updated.</p>
      <p><strong>New Status:</strong> ${status}</p>
      <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      <p>Best regards,<br>Dark Zone Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendContactReply(
  customerEmail: string,
  name: string,
  reply: string
) {
  const mailOptions = {
    from: SMTP_USER,
    to: customerEmail,
    subject: 'Dark Zone - Response to Your Message',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for contacting Dark Zone. Here's our response:</p>
      <p>${reply}</p>
      <p>Best regards,<br>Dark Zone Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
