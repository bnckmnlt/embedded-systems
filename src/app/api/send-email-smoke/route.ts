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
    const body = await req.json();
    const { smokeLevel } = body;

    if (!smokeLevel) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const formattedDate = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    });

    const emailData = {
      from: "Mailgun Sandbox <postmaster@sandboxa08d5062b0ba4598923a654232bb757f.mailgun.org>",
      to: "montealtobryannicki@gmail.com",
      subject: "Smoke Detected - Immediate Action Required",
      template: "smoke detected",
      "h:X-Mailgun-Variables": JSON.stringify({
        timestamp: formattedDate,
        smoke_level: `${smokeLevel} ppm`,
      }),
    };

    const response = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);

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
