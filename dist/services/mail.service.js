"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendActivationEmail = void 0;
const env_1 = require("../utils/env");
const jwt_1 = require("../utils/jwt");
const mail_1 = require("../utils/mail/mail");
const sendActivationEmail = async (user) => {
    const token = (0, jwt_1.createActivationToken)({
        id: user.id,
        email: user.email,
    });
    const html = await (0, mail_1.renderMailHTML)("registration-success.ejs", {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        activationLink: `${env_1.CLIENT_HOST}/auth/activation?token=${token}`,
    });
    await (0, mail_1.sendMail)({
        from: `${env_1.EMAIL_SMTP_USER}`,
        to: user.email,
        subject: "Aktivasi Akun",
        html,
    });
};
exports.sendActivationEmail = sendActivationEmail;
//# sourceMappingURL=mail.service.js.map