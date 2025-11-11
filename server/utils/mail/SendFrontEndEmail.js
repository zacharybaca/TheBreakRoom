import { render } from "@react-email/components";
import sendgrid from "@sendgrid/mail";
import { SendEmailTemplate } from "../../../client/src/components/SendEmailTemplate/SendEmailTemplate.jsx";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const emailHtml = await render(<SendEmailTemplate url="https://example.com" />);

const options = {
  from: "you@example.com",
  to: "user@gmail.com",
  subject: "hello world",
  html: emailHtml,
};

sendgrid.send(options);
