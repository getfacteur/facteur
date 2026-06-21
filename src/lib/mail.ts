import nodemailer from "nodemailer";
import { env } from "./env.server";

const transport = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	secure: env.SMTP_SECURE,
	from: env.SMTP_FROM,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
});

export const sendMail = async (
	to: string,
	subject: string,
	html: string,
	text: string,
) => {
	await transport.sendMail({ to, subject, html, text });
};
