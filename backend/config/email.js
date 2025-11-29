require('dotenv').config();

/**
 * Email Configuration
 * 
 * This configuration supports multiple SMTP providers:
 * - Gmail (recommended for free tier)
 * - Outlook/Hotmail
 * - Custom SMTP servers
 * 
 * For AWS Academy accounts that don't have access to AWS SES,
 * this provides a free alternative using standard SMTP.
 */

/**
 * SMTP Configuration
 * Supports Gmail, Outlook, and custom SMTP servers
 */
const getEmailConfig = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPassword = process.env.EMAIL_PASSWORD;
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  // Log configuration status (without exposing password)
  console.log('📧 Email Configuration Check:');
  console.log('   ├─ SMTP_HOST:', smtpHost || 'smtp.gmail.com (default)');
  console.log('   ├─ SMTP_PORT:', smtpPort || 587);
  console.log('   ├─ EMAIL_USER:', smtpUser ? `${smtpUser.substring(0, 3)}***` : '❌ NOT SET');
  console.log('   ├─ EMAIL_PASSWORD:', smtpPassword ? '***SET***' : '❌ NOT SET');
  console.log('   ├─ FROM_EMAIL:', process.env.FROM_EMAIL || '❌ NOT SET');

  // If using Gmail (default)
  if (!smtpHost || smtpHost === 'smtp.gmail.com') {
    if (!smtpUser || !smtpPassword) {
      console.error('❌ Email configuration incomplete for Gmail. Missing:', {
        EMAIL_USER: !smtpUser,
        EMAIL_PASSWORD: !smtpPassword
      });
      return null; // Will throw error in email service
    }
    
    console.log('✅ Using Gmail SMTP configuration');
    return {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword, // Gmail App Password
      },
    };
  }

  // Custom SMTP server
  if (!smtpUser || !smtpPassword) {
    console.error('❌ Email configuration incomplete for custom SMTP. Missing:', {
      EMAIL_USER: !smtpUser,
      EMAIL_PASSWORD: !smtpPassword
    });
    return null; // Will throw error in email service
  }

  console.log('✅ Using custom SMTP configuration');
  return {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  };
};

/**
 * Admin email address (recipient for notifications)
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

/**
 * From email address (sender email)
 * Should match the EMAIL_USER for Gmail
 */
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'noreply@example.com';

module.exports = {
  EMAIL_CONFIG: getEmailConfig(),
  ADMIN_EMAIL,
  FROM_EMAIL,
};

