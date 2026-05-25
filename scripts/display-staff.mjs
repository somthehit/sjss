import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const filePath = resolve(process.cwd(), "staff.json");
  const fileContent = await readFile(filePath, "utf8");
  const staff = JSON.parse(fileContent);

  if (!Array.isArray(staff)) {
    throw new Error("Expected staff.json to contain a JSON array.");
  }

  console.log(`Found ${staff.length} staff member(s):\n`);

  staff.forEach((member, index) => {
    const nameEn = member.name_en ?? "N/A";
    const nameNp = member.name_np ?? "N/A";
    const roleEn = member.role_en ?? "N/A";
    const department = member.department ?? "N/A";
    const qualification = member.qualification ?? "N/A";
    const active = member.is_active ? "Yes" : "No";

    console.log(
      `${index + 1}. ${nameEn} (${nameNp})\n` +
        `   Role: ${roleEn}\n` +
        `   Department: ${department}\n` +
        `   Qualification: ${qualification}\n` +
        `   Active: ${active}\n`
    );
  });
}

main().catch((error) => {
  console.error("Failed to read/display staff data:", error.message);
  process.exitCode = 1;
});
