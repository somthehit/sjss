// Bikram Sambat (BS) and AD date conversions & formatting utilities

const NEPALI_NUMBERS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const MONTHS_EN = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const MONTHS_NP = [
  "वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"
];

// Helper to convert English numerals to Devanagari numerals
export function toNepaliNumerals(num: number | string): string {
  return String(num)
    .split("")
    .map((char) => {
      const parsed = parseInt(char, 10);
      return isNaN(parsed) ? char : NEPALI_NUMBERS[parsed];
    })
    .join("");
}

/**
 * Approximate AD to BS date converter.
 * In a real environment, this utilizes calendar epoch mappings.
 * For this implementation, we calculate using standard Nepali calendar offsets (approx +56 years, 8 months, 17 days).
 */
export function getBikramSambatDate(adDate: Date = new Date()): {
  year: number;
  monthIndex: number; // 0-indexed (Baishakh is 0)
  day: number;
  formattedEn: string;
  formattedNp: string;
} {
  // Approximate conversion: BS is roughly 56 years, 8 months and 17 days ahead of AD.
  // We establish a precise baseline: 2026-05-23 AD corresponds to 2083 Baishakh 10 BS.
  const baseAD = new Date("2026-05-23T00:00:00").getTime();
  const diffDays = Math.floor((adDate.getTime() - baseAD) / (1000 * 60 * 60 * 24));
  
  // Starting point: 2083 Baishakh 10 BS
  let year = 2083;
  let monthIndex = 0; // Baishakh
  let day = 10;

  // Add the difference in days (handling both past and future dates)
  day += diffDays;

  // Simplified calendar math for BS months (averaging 30-32 days)
  const daysInMonths = [31, 31, 32, 32, 31, 30, 30, 29, 29, 29, 30, 30]; // 2083 specific

  if (day > 0) {
    while (day > daysInMonths[monthIndex]) {
      day -= daysInMonths[monthIndex];
      monthIndex++;
      if (monthIndex > 11) {
        monthIndex = 0;
        year++;
      }
    }
  } else {
    while (day <= 0) {
      monthIndex--;
      if (monthIndex < 0) {
        monthIndex = 11;
        year--;
      }
      day += daysInMonths[monthIndex];
    }
  }

  const monthEn = MONTHS_EN[monthIndex];
  const monthNp = MONTHS_NP[monthIndex];

  return {
    year,
    monthIndex,
    day,
    formattedEn: `${year} ${monthEn} ${day}`,
    formattedNp: `${toNepaliNumerals(year)} ${monthNp} ${toNepaliNumerals(day)}`,
  };
}

/**
 * Returns a dual calendar string: "2083 Baishakh 10 (May 23, 2026)"
 */
export function getDualCalendarString(adDateInput: string | Date = new Date(), lang: "EN" | "NP" = "EN"): string {
  const adDate = typeof adDateInput === "string" ? new Date(adDateInput) : adDateInput;
  if (isNaN(adDate.getTime())) return String(adDateInput);

  const bs = getBikramSambatDate(adDate);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const formattedAD = adDate.toLocaleDateString(lang === "EN" ? "en-US" : "ne-NP", options);

  if (lang === "EN") {
    return `${bs.formattedEn} BS (${formattedAD})`;
  } else {
    return `${bs.formattedNp} वि.सं. (${formattedAD})`;
  }
}
