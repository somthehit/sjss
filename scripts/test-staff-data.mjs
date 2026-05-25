import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const REQUIRED_STRING_FIELDS = [
  "name_en",
  "name_np",
  "role_en",
  "role_np",
  "department",
  "qualification",
  "created_at",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateMember(member, index) {
  const at = `staff[${index}]`;
  assert(member && typeof member === "object" && !Array.isArray(member), `${at} must be an object`);
  assert(Number.isInteger(member.idx), `${at}.idx must be an integer`);
  assert(Number.isInteger(member.id), `${at}.id must be an integer`);
  assert(Number.isInteger(member.display_order), `${at}.display_order must be an integer`);
  assert(typeof member.is_active === "boolean", `${at}.is_active must be boolean`);

  for (const field of REQUIRED_STRING_FIELDS) {
    assert(typeof member[field] === "string" && member[field].length > 0, `${at}.${field} must be a non-empty string`);
  }

  const photoType = typeof member.photo_url;
  assert(
    member.photo_url === null || photoType === "string",
    `${at}.photo_url must be null or string`
  );
}

async function main() {
  const filePath = resolve(process.cwd(), "staff.json");
  const raw = await readFile(filePath, "utf8");
  const data = JSON.parse(raw);

  assert(Array.isArray(data), "staff.json root must be an array");
  assert(data.length > 0, "staff.json must contain at least one staff record");

  data.forEach(validateMember);
  console.log(`PASS: validated ${data.length} staff record(s) in staff.json`);
}

main().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
});
