/**
 * Test Email Sending
 * Run this script to test if email configuration is working
 * 
 * Usage: node test-email.js
 */

require('dotenv').config();
const { sendRSVPConfirmation } = require('./services/email.service');

async function testEmail() {
  console.log('\n🧪 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('   ├─ EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : '❌ NOT SET');
  console.log('   ├─ EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : '❌ NOT SET');
  console.log('   ├─ FROM_EMAIL:', process.env.FROM_EMAIL || '❌ NOT SET');
  console.log('   ├─ SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
  console.log('   └─ SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
  console.log('');

  // Test email sending
  const testEmail = process.env.EMAIL_USER || 'darshilrayjada4154@gmail.com';
  
  console.log(`📧 Attempting to send test email to: ${testEmail}\n`);

  try {
    const result = await sendRSVPConfirmation({
      studentEmail: testEmail,
      studentName: 'Test User',
      eventTitle: 'Test Event - Email Configuration',
      eventDate: new Date().toISOString(),
      eventLocation: 'Test Location',
      eventDescription: 'This is a test email to verify your email configuration is working correctly.',
    });

    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('   ├─ Message ID:', result.MessageId);
    console.log('   └─ Check your inbox (and spam folder) at:', testEmail);
    console.log('\n');
  } catch (error) {
    console.error('\n❌ FAILED! Email could not be sent.\n');
    console.error('Error Details:');
    console.error('   ├─ Error Code:', error.code || 'N/A');
    console.error('   ├─ Error Message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 AUTHENTICATION ERROR:');
      console.error('   ├─ Your Gmail App Password might be incorrect');
      console.error('   ├─ Make sure you generated a NEW App Password for: darshilrayjada4154@gmail.com');
      console.error('   └─ Check that EMAIL_PASSWORD in .env has no spaces');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔧 CONNECTION ERROR:');
      console.error('   ├─ Could not connect to Gmail SMTP server');
      console.error('   ├─ Check your internet connection');
      console.error('   └─ Verify SMTP_HOST and SMTP_PORT in .env');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n🔧 TIMEOUT ERROR:');
      console.error('   ├─ SMTP connection timed out');
      console.error('   └─ Check your network connection');
    } else {
      console.error('\n🔧 UNKNOWN ERROR:');
      console.error('   └─ Full error:', error);
    }
    
    console.error('\n');
    process.exit(1);
  }
}

// Run test
testEmail();



