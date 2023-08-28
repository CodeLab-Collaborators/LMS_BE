import nodemailer from "nodemailer";
import { google } from "googleapis";
import ejs from "ejs";
import path from "path";
import { envVariable } from "../../config/envVariable";

const GOOGLE_SECRET = envVariable.GOOGLE_SECRET;
const GOOGLE_ID = envVariable.GOOGLE_ID;
const GOOGLE_REFRESHTOKEN = envVariable.GOOGLE_REFRESHTOKEN;
const GOOGLE_REDIRECT = envVariable.GOOGLE_REDIRECT;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });

export const verifyUserEmail = async (user: any) => {
  try {
    const accessToken = await oAuth.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "adedejiomogbehin@gmail.com",
        refreshToken: accessToken.token,
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        accessToken: GOOGLE_REFRESHTOKEN,
      },
    });

    const buildFile = path.join(__dirname, "../views/verifyAccount.ejs");

    const data = await ejs.renderFile(buildFile, {
      email: user.email,
      id: user!._id,
      status: user!.status,
      link: user.link,
    });

    const mailOptions = {
      from: "Your registration to VON <adanianlabs>",
      to: user.email,
      subject: "Account Verification Email",
      html: data,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendResetPasswordEmail = async (user: any) => {
  try {
    const accessToken = await oAuth.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "adedejiomogbehin@gmail.com",
        refreshToken: accessToken.token,
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        accessToken: GOOGLE_REFRESHTOKEN,
      },
    });

    const buildFile = path.join(__dirname, "../views/passwordReset.ejs");

    const data = await ejs.renderFile(buildFile, {
      email: user.email,
      id: user!._id,
      status: user!.status,
      link: user.link,
    });

    const mailOptions = {
      from: "This link is to reset your password <LMS>",
      to: user.email,
      subject: " Password reset Token",
      html: data,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendConfirmResetPasswordEmail = async (user: any) => {
  try {
    const accessToken = await oAuth.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "adedejiomogbehin@gmail.com",
        refreshToken: accessToken.token,
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        accessToken: GOOGLE_REFRESHTOKEN,
      },
    });

    const buildFile = path.join(__dirname, "../views/forgotPassword.ejs");

    const data = await ejs.renderFile(buildFile, {
      email: user.email,
      id: user!._id,
      status: user!.status,
      link: user.link,
    });

    const mailOptions = {
      from: "This link is to reset your password <LMS>",
      to: user.email,
      subject: "Reset your password",
      html: data,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
