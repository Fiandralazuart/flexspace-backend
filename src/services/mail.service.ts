import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { createActivationToken } from "../utils/jwt";
import { renderMailHTML, sendMail } from "../utils/mail/mail";
import { UserMail } from "../validations/user.validation";

export const sendActivationEmail = async (user: UserMail) => {
	const token = createActivationToken({
		id: user.id,
		email: user.email,
	});

	const html = await renderMailHTML("registration-success.ejs", {
		name: user.name,
		email: user.email,
		createdAt: user.createdAt,
		activationLink: `${CLIENT_HOST}/auth/activation?token=${token}`,
	});

	await sendMail({
		from: `${EMAIL_SMTP_USER}`,
		to: user.email,
		subject: "Aktivasi Akun",
		html,
	});
};
