interface BookingConfirmationEmail {
    mentorName: string;
    meetingLink: string;
    sessionTime: string;
}

interface MentorBookingEmail {
    userName: string;
    meetingLink: string;
}

export const bookingConfirmationTemplate = ({
    mentorName,
    meetingLink,
    sessionTime
}: BookingConfirmationEmail):string => {
    return `
        <div style="max-width:600px;margin:auto;padding:40px;font-family:Arial,sans-serif;background:#fdfaf3;border-radius:24px;border:1px solid #e5e5e5;color:#1a1a1a;">
        
            <h1 style="font-size:32px;line-height:1.2;margin-bottom:20px;">
                Your session starts soon.
            </h1>

            <p style="font-size:16px;line-height:1.7;color:#555;margin-bottom:30px;">
                You have an upcoming session scheduled with 
                <strong>${mentorName}</strong>.
            </p>

            <div style="background:white;padding:24px;border-radius:20px;border:1px solid #eee;margin-bottom:30px;">

                <p style="margin:0 0 14px 0;font-size:14px;color:#777;">
                Mentor
                </p>

                <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">
                ${mentorName}
                </p>

                <p style="margin:0 0 14px 0;font-size:14px;color:#777;">
                Session Time
                </p>

                <p style="margin:0;font-size:18px;font-weight:500;color:#1a1a1a;">
                ${new Date(sessionTime).toLocaleString()}
                </p>

            </div>

            <a 
                href="${meetingLink}"
                style="
                display:inline-block;
                background:#120f0a;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:999px;
                font-size:15px;
                font-weight:600;
                "
            >
                Join Meeting
            </a>

            <p style="margin-top:40px;font-size:13px;color:#999;line-height:1.7;">
                Join a few minutes early to avoid connection issues.
            </p>

            </div>
            </p>
    `
}

export const mentorBookingTemplate = ({
    userName,
    meetingLink
}: MentorBookingEmail): string => {
    return `
        <h1>
                New Booking
            </h1>

            <p>
                A new user booked
                a session with you.
            </p>

            <p>
                User:
                ${userName}
            </p>

            <p>
                Meeting Link:
                <a href="${meetingLink}">
                    Join Meeting
                </a>
            </p>
        
    `
}