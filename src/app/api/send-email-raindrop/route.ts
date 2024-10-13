import { NextRequest, NextResponse } from "next/server";
import mailgun from "mailgun.js";
import formData from "form-data";
import env from "@/lib/env";

const rainObject = [
  {
    id: 1,
    title: "GREEN RAINFALL WARNING",
    description:
      "Alert 1: There might be some minor rain in low-lying areas, and roads could get slippery , so drive carefully. Stay safe!",
  },
  {
    id: 2,
    title: "YELLOW RAINFALL WARNING",
    description:
      "Alert 2: There there's a chance of rain in low areas, so it's a good idea to stay indoors. Be ready to move to higher ground if needed.",
  },
  {
    id: 3,
    title: "ORANGE RAINFALL WARNING",
    description:
      "Alert 3: Intense rain is on its way! Be prepared to evacuate. Stay away from rivers or streams.",
  },
  {
    id: 4,
    title: "RED RAINFALL WARNING",
    description:
      "Alert 4: Dangerous! If you're in a flood-prone area, move to a higher ground immediately. This is a serious situation, please stay safe.",
  },
];

const mg = new mailgun(formData).client({
  username: "api",
  key: env.MAILGUN_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rainLevel, moisture, voltage } = body;

    if (!rainLevel || !moisture || !voltage) {
      return NextResponse.json({ error: "Missing value" }, { status: 422 });
    }

    const formattedDate = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    });

    const selectWarning = rainObject.find((object) => object.id === rainLevel);

    const emailData = {
      from: "Mailgun Sandbox <postmaster@sandboxa08d5062b0ba4598923a654232bb757f.mailgun.org>",
      to: "montealtobryannicki@gmail.com",
      subject: "Rainfall Advisory - Immediate Action Required",
      template: "rain detected",
      "h:X-Mailgun-Variables": JSON.stringify({
        timestamp: formattedDate,
        weather_condition: selectWarning?.title,
        weather_description: selectWarning?.description,
        moisture_level: moisture,
        voltage_value: voltage,
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
