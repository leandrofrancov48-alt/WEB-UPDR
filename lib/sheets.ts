import { google } from "googleapis";
import type { SessionUser } from "./session";

export async function appendUserToSheet(user: SessionUser) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const tab = process.env.GOOGLE_SHEET_TAB ?? "Registros";

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:F`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[new Date().toISOString(), user.email, user.nombre, user.apellido, user.celular, user.dni]],
    },
  });
}
