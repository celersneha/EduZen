'use server';

import { sendEmail } from '@/lib/nodemailer';

const sendClassroomInvite = async (studentEmail, classroomName, classroomCode, teacherName) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const joinLink = `${baseUrl}/student-classroom/join?code=${classroomCode}`;

  const subject = `Join ${classroomName} on EduZen`;

  const htmlMessage = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Classroom Invitation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Classroom Invitation</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Hello!
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>${teacherName}</strong> has invited you to join the classroom <strong>"${classroomName}"</strong> on EduZen.
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Classroom Name:</strong> ${classroomName}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
              <strong>Classroom Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: #667eea;">${classroomCode}</code>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${joinLink}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Join Classroom
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Or copy and paste this link into your browser:
            <br>
            <a href="${joinLink}" style="color: #667eea; word-break: break-all;">${joinLink}</a>
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If you don't have an EduZen account, you can sign up at <a href="${baseUrl}/register" style="color: #667eea;">${baseUrl}/register</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} EduZen. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  const textMessage = `
Hello!

${teacherName} has invited you to join the classroom "${classroomName}" on EduZen.

Classroom Name: ${classroomName}
Classroom Code: ${classroomCode}

Join the classroom by clicking this link: ${joinLink}

If you don't have an EduZen account, you can sign up at ${baseUrl}/register

© ${new Date().getFullYear()} EduZen. All rights reserved.
  `;

  try {
    await sendEmail(studentEmail, subject, htmlMessage);
    return { success: true, message: "Invitation email sent successfully" };
  } catch (error) {
    console.error("Error sending classroom invitation:", error);
    return { 
      success: false, 
      message: error.message || "Failed to send invitation email" 
    };
  }
};

export default sendClassroomInvite;

