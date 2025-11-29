require('dotenv').config();
const nodemailer = require('nodemailer');
const { EMAIL_CONFIG, ADMIN_EMAIL, FROM_EMAIL } = require('../config/email');

/**
 * Email Service
 * Handles sending emails via Nodemailer (Gmail SMTP or other SMTP providers)
 * 
 * This is a free alternative to AWS SES, suitable for AWS Academy accounts
 * that don't have access to SES.
 */

// Create reusable transporter object using SMTP transport
let transporter = null;

/**
 * Initialize email transporter
 * @returns {Object} Nodemailer transporter
 */
const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!EMAIL_CONFIG) {
    throw new Error(
      'Email configuration is not set. ' +
      'Please configure SMTP settings in your .env file. ' +
      'See EMAIL_SETUP.md for instructions.'
    );
  }

  transporter = nodemailer.createTransport(EMAIL_CONFIG);
  return transporter;
};

/**
 * Send email notification to admin about alumni judge interest
 * @param {Object} params - Email parameters
 * @param {string} params.alumniEmail - Email of the alumni who registered
 * @param {string} params.alumniName - Name of the alumni (optional)
 * @param {string} params.eventId - Event ID
 * @param {string} params.eventTitle - Event title
 * @param {string} params.preferredDateTime - Preferred date and time
 * @param {string} params.preferredLocation - Preferred location
 * @returns {Promise<Object>} Email send response
 */
const sendJudgeInterestNotification = async ({
  alumniEmail,
  alumniName = 'Alumni',
  eventId,
  eventTitle,
  preferredDateTime,
  preferredLocation,
}) => {
  if (!ADMIN_EMAIL || !FROM_EMAIL) {
    throw new Error(
      'ADMIN_EMAIL and FROM_EMAIL must be configured in your .env file.'
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(alumniEmail)) {
    throw new Error('Invalid alumni email format');
  }

  try {
    const emailTransporter = getTransporter();
    
    const subject = `New Judge Interest: ${eventTitle}`;
    
    const htmlBody = `
      <html>
        <body>
          <h2>New Judge Interest Notification</h2>
          <p>An alumni has expressed interest in participating as a judge for an event.</p>
          
          <h3>Event Details:</h3>
          <ul>
            <li><strong>Event ID:</strong> ${eventId}</li>
            <li><strong>Event Title:</strong> ${eventTitle}</li>
          </ul>
          
          <h3>Alumni Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${alumniName}</li>
            <li><strong>Email:</strong> ${alumniEmail}</li>
          </ul>
          
          <h3>Preferences:</h3>
          <ul>
            <li><strong>Preferred Date/Time:</strong> ${preferredDateTime}</li>
            <li><strong>Preferred Location:</strong> ${preferredLocation}</li>
          </ul>
          
          <p>Please review and contact the alumni to confirm their participation.</p>
        </body>
      </html>
    `;
    
    const textBody = `
New Judge Interest Notification

An alumni has expressed interest in participating as a judge for an event.

Event Details:
- Event ID: ${eventId}
- Event Title: ${eventTitle}

Alumni Details:
- Name: ${alumniName}
- Email: ${alumniEmail}

Preferences:
- Preferred Date/Time: ${preferredDateTime}
- Preferred Location: ${preferredLocation}

Please review and contact the alumni to confirm their participation.
    `;

    const mailOptions = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: alumniEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      MessageId: info.messageId,
      success: true,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your SMTP credentials (EMAIL_USER and EMAIL_PASSWORD).';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'SMTP connection timed out. Please check your network connection and SMTP settings.';
    }
    
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

/**
 * Send RSVP confirmation email to student
 * @param {Object} params - Email parameters
 * @param {string} params.studentEmail - Email of the student who RSVP'd
 * @param {string} params.studentName - Name of the student
 * @param {string} params.eventTitle - Event title
 * @param {string} params.eventDate - Event date and time
 * @param {string} params.eventLocation - Event location
 * @param {string} params.eventDescription - Event description (optional)
 * @returns {Promise<Object>} Email send response
 */
const sendRSVPConfirmation = async ({
  studentEmail,
  studentName = 'Student',
  eventTitle,
  eventDate,
  eventLocation,
  eventDescription = '',
}) => {
  if (!FROM_EMAIL) {
    throw new Error(
      'FROM_EMAIL must be configured in your .env file.'
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentEmail)) {
    throw new Error('Invalid student email format');
  }

  try {
    const emailTransporter = getTransporter();
    
    const subject = `Event Registration Confirmation: ${eventTitle}`;
    
    // Format date for display
    const formattedDate = new Date(eventDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #500000; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .event-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #500000; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #500000; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Event Registration Confirmed! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              
              <p>Thank you for registering for the following event:</p>
              
              <div class="event-details">
                <h2 style="margin-top: 0; color: #500000;">${eventTitle}</h2>
                <p><strong>📅 Date & Time:</strong> ${formattedDate}</p>
                <p><strong>📍 Location:</strong> ${eventLocation || 'TBA'}</p>
                ${eventDescription ? `<p><strong>📝 Description:</strong> ${eventDescription}</p>` : ''}
              </div>
              
              <p>Your registration has been confirmed. We look forward to seeing you at the event!</p>
              
              <p>If you have any questions or need to cancel your registration, please contact us.</p>
              
              <p>Best regards,<br>
              CMIS Engagement Platform<br>
              Texas A&M University - Mays Business School</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const textBody = `
Event Registration Confirmation: ${eventTitle}

Dear ${studentName},

Thank you for registering for the following event:

Event: ${eventTitle}
Date & Time: ${formattedDate}
Location: ${eventLocation || 'TBA'}
${eventDescription ? `Description: ${eventDescription}` : ''}

Your registration has been confirmed. We look forward to seeing you at the event!

If you have any questions or need to cancel your registration, please contact us.

Best regards,
CMIS Engagement Platform
Texas A&M University - Mays Business School

---
This is an automated confirmation email. Please do not reply to this message.
    `;

    const mailOptions = {
      from: FROM_EMAIL,
      to: studentEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('✅ RSVP confirmation email sent successfully:', info.messageId);
    return {
      MessageId: info.messageId,
      success: true,
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your SMTP credentials (EMAIL_USER and EMAIL_PASSWORD).';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'SMTP connection timed out. Please check your network connection and SMTP settings.';
    }
    
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

/**
 * Send competition registration confirmation email to student
 * @param {Object} params - Email parameters
 * @param {string} params.studentEmail - Email of the student who registered
 * @param {string} params.studentName - Name of the student
 * @param {string} params.teamName - Team name
 * @param {string} params.competitionName - Competition name
 * @param {string} params.teamId - Team ID
 * @returns {Promise<Object>} Email send response
 */
const sendCompetitionRegistrationConfirmation = async ({
  studentEmail,
  studentName = 'Student',
  teamName,
  competitionName,
  teamId,
}) => {
  if (!FROM_EMAIL) {
    throw new Error(
      'FROM_EMAIL must be configured in your .env file.'
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentEmail)) {
    throw new Error('Invalid student email format');
  }

  try {
    const emailTransporter = getTransporter();
    
    const subject = `Competition Registration Confirmed: ${competitionName}`;
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #500000; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .team-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #500000; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #500000; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .team-id { font-size: 18px; font-weight: bold; color: #500000; padding: 10px; background-color: #f0f0f0; border-radius: 4px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Competition Registration Confirmed! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              
              <p>Congratulations! Your team has been successfully registered for the competition.</p>
              
              <div class="team-details">
                <h2 style="margin-top: 0; color: #500000;">${competitionName}</h2>
                <p><strong>Team Name:</strong> ${teamName}</p>
                <div class="team-id">Team ID: ${teamId}</div>
                <p style="margin-top: 15px; font-size: 14px; color: #666;">Please save this Team ID - you'll need it for submissions and team management.</p>
              </div>
              
              <h3 style="color: #500000;">Next Steps:</h3>
              <ol style="line-height: 2;">
                <li>Share your Team ID (<strong>${teamId}</strong>) with your team members</li>
                <li>Prepare your submission materials</li>
                <li>Check the competition deadline</li>
                <li>Submit your final work through the platform</li>
              </ol>
              
              <p>Good luck! We're excited to see what you create.</p>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>
              CMIS Engagement Platform<br>
              Texas A&M University - Mays Business School</p>
            </div>
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const textBody = `
Competition Registration Confirmed: ${competitionName}

Dear ${studentName},

Congratulations! Your team has been successfully registered for the competition.

Competition: ${competitionName}
Team Name: ${teamName}
Team ID: ${teamId}

Next Steps:
1. Share your Team ID (${teamId}) with your team members
2. Prepare your submission materials
3. Check the competition deadline
4. Submit your final work through the platform

Good luck! We're excited to see what you create.

If you have any questions, please don't hesitate to contact us.

Best regards,
CMIS Engagement Platform
Texas A&M University - Mays Business School

---
This is an automated confirmation email. Please do not reply to this message.
    `;

    const mailOptions = {
      from: FROM_EMAIL,
      to: studentEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('✅ Competition registration confirmation email sent successfully:', info.messageId);
    return {
      MessageId: info.messageId,
      success: true,
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message || 'Failed to send email';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your SMTP credentials (EMAIL_USER and EMAIL_PASSWORD).';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'SMTP connection timed out. Please check your network connection and SMTP settings.';
    }
    
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

module.exports = {
  sendJudgeInterestNotification,
  sendRSVPConfirmation,
  sendCompetitionRegistrationConfirmation,
  ADMIN_EMAIL,
  FROM_EMAIL,
};
