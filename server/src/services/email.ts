import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

let transporter: nodemailer.Transporter;

export function initializeEmailService() {
  transporter = nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!transporter) {
    initializeEmailService();
  }

  const html = getEmailTemplate(options.template, options.data);

  const mailOptions = {
    from: `Trading Hub <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

function getEmailTemplate(template: string, data: any): string {
  switch (template) {
    case 'verification':
      return getVerificationTemplate(data);
    case 'password-reset':
      return getPasswordResetTemplate(data);
    case 'alert-triggered':
      return getAlertTriggeredTemplate(data);
    case 'trade-executed':
      return getTradeExecutedTemplate(data);
    case 'welcome':
      return getWelcomeTemplate(data);
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}

function getVerificationTemplate(data: { name: string; verificationLink: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Trading Hub!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Thanks for joining Trading Hub! To get started, please verify your email address by clicking the button below:</p>
          <a href="${data.verificationLink}" class="button">Verify Email Address</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.verificationLink}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account with Trading Hub, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Trading Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPasswordResetTemplate(data: { name: string; resetLink: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>We received a request to reset your password for your Trading Hub account.</p>
          <a href="${data.resetLink}" class="button">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.resetLink}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Trading Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAlertTriggeredTemplate(data: { name: string; ticker: string; condition: string; price: number; message: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trading Alert Triggered</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .ticker { font-size: 24px; font-weight: bold; color: #1f2937; }
        .price { font-size: 20px; color: #059669; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Trading Alert Triggered</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Your trading alert has been triggered!</p>
          <div class="alert-box">
            <div class="ticker">${data.ticker}</div>
            <div class="price">$${data.price.toLocaleString()}</div>
            <p><strong>Condition:</strong> ${data.condition}</p>
            <p><strong>Message:</strong> ${data.message}</p>
          </div>
          <p>Consider reviewing your strategy and taking appropriate action.</p>
          <p><a href="${process.env.CLIENT_URL}/dashboard">View Dashboard</a></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Trading Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getTradeExecutedTemplate(data: { name: string; ticker: string; side: string; quantity: number; price: number; platform: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trade Executed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .trade-box { background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .ticker { font-size: 24px; font-weight: bold; color: #1f2937; }
        .details { margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Trade Executed Successfully</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Your trade has been executed successfully!</p>
          <div class="trade-box">
            <div class="ticker">${data.ticker}</div>
            <div class="details">
              <p><strong>Action:</strong> ${data.side}</p>
              <p><strong>Quantity:</strong> ${data.quantity}</p>
              <p><strong>Price:</strong> $${data.price.toLocaleString()}</p>
              <p><strong>Platform:</strong> ${data.platform}</p>
              <p><strong>Total Value:</strong> $${(data.quantity * data.price).toLocaleString()}</p>
            </div>
          </div>
          <p><a href="${process.env.CLIENT_URL}/trades">View All Trades</a></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Trading Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getWelcomeTemplate(data: { name: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Trading Hub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 6px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Trading Hub!</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Your email has been verified and you're all set to start trading smarter!</p>
          
          <div class="feature">
            <h3>📊 Smart Trading Strategies</h3>
            <p>Create automated trading strategies with advanced technical analysis</p>
          </div>
          
          <div class="feature">
            <h3>🔔 Real-time Alerts</h3>
            <p>Get notified instantly when your conditions are met</p>
          </div>
          
          <div class="feature">
            <h3>👥 Social Trading</h3>
            <p>Connect with other traders and share insights</p>
          </div>
          
          <div class="feature">
            <h3>🤖 Automated Execution</h3>
            <p>Execute trades automatically on popular platforms</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/dashboard" class="button">Get Started</a>
        </div>
        <div class="footer">
          <p>&copy; 2024 Trading Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: '🎉 Welcome to Trading Hub!',
    template: 'welcome',
    data: { name },
  });
}

export async function sendAlertEmail(to: string, alertData: any): Promise<void> {
  await sendEmail({
    to,
    subject: `🚨 Trading Alert: ${alertData.ticker}`,
    template: 'alert-triggered',
    data: alertData,
  });
}

export async function sendTradeEmail(to: string, tradeData: any): Promise<void> {
  await sendEmail({
    to,
    subject: `✅ Trade Executed: ${tradeData.ticker}`,
    template: 'trade-executed',
    data: tradeData,
  });
}