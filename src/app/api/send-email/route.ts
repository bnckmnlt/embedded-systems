import { NextRequest, NextResponse } from "next/server";
import mailgun from "mailgun.js";
import formData from "form-data";
import env from "@/lib/env";

const mg = new mailgun(formData).client({
  username: "api",
  key: env.MAILGUN_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const emailData = {
      from: "Mailgun Sandbox <postmaster@sandboxa08d5062b0ba4598923a654232bb757f.mailgun.org>",
      to: "montealtobryannicki@gmail.com",
      subject: "Motion Detected",
      template: "motion detected",
      "h:X-Mailgun-Variables": JSON.stringify({ test: "test" }),
    };

    const response = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);
    console.log(response);

    return NextResponse.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error in sending email:", error);
    return NextResponse.json(
      {
        error: "Error in sending email. Please try again.",
      },
      { status: 400 },
    );
  }
}
