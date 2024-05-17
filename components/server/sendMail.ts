import nodemailer from 'nodemailer';
import User from '@/models/User';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const adminEmail = 'adeoluwaagbakosi@gmail.com';

export async function sendMoodDropAlert(userId: string, message: string) {
    const user = await User.findById(userId);

    if (!user) {
        console.error('User not found');
        return;
    } else {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `Mood Drop Alert for ${user.username}`,
            text: message
        };
    
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent');
        } catch (error) {
            console.error(error);
        }
    }

}

export async function lowMoodAlert(userId: string, message: string) {
    const user = await User.findById(userId);

    if (!user) {
        console.error('User not found');
        return;
    } else {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `Low Mood Alert for ${user.username}`,
            text: message
        };
    
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent');
        } catch (error) {
            console.error(error);
        }
    }
}