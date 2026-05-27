/**
 * Promotion Logic Utility
 * Handles determining if a student passed and computing their next class/year.
 */

// Class progression sequence for SJSS (Class 1 through 10)
const CLASS_PROGRESSION: Record<string, string> = {
  '1':  '2',
  '2':  '3',
  '3':  '4',
  '4':  '5',
  '5':  '6',
  '6':  '7',
  '7':  '8',
  '8':  '9',
  '9':  '10',
  '10': 'PASSED_OUT', // After Class 10 (SEE), student is passed out
};

/**
 * Determines if a student passed based on their result.
 * A student PASSES if:
 * - The division field is NOT 'Fail' or 'Failed'
 * - No subject in the subjects JSON has grade 'NG' (Non-Graded)
 */
export function didStudentPass(result: {
  division?: string | null;
  subjects?: Record<string, any> | null;
  remarks?: string | null;
}): boolean {
  // Check division field
  if (result.division) {
    const div = result.division.toLowerCase();
    if (div === 'fail' || div === 'failed' || div === 'ng') {
      return false;
    }
  }

  // Check if any subject has NG grade
  if (result.subjects && typeof result.subjects === 'object') {
    const subjectsArray = Array.isArray(result.subjects)
      ? result.subjects
      : Object.values(result.subjects);

    for (const sub of subjectsArray) {
      if (sub && (sub.grade === 'NG' || sub.letterGrade === 'NG')) {
        return false;
      }
    }
  }

  // Check remarks field
  if (result.remarks) {
    const rem = result.remarks.toLowerCase();
    if (rem === 'fail' || rem === 'failed' || rem.includes('not passed')) {
      return false;
    }
  }

  return true;
}

/**
 * Given a current class string, returns the next class.
 * Returns null if no progression exists.
 */
export function getNextClass(currentClass: string): string | null {
  const normalized = currentClass.trim().replace(/^class\s*/i, '');
  return CLASS_PROGRESSION[normalized] || null;
}

/**
 * Increments Bikram Sambat academic year string.
 * e.g. "2083" → "2084"
 * Also handles Nepali numeral years like "२०८३" → "२०८४"
 */
export function getNextAcademicYear(year: string): string {
  // Try numeric first
  const numericYear = parseInt(year, 10);
  if (!isNaN(numericYear)) {
    return String(numericYear + 1);
  }
  // Fallback: just return as is
  return year;
}

/**
 * Full promotion computation.
 * Returns the next class, next year, and whether the student should be "Passed Out".
 */
export function computePromotion(currentClass: string, currentYear: string): {
  nextClass: string;
  nextYear: string;
  isPassedOut: boolean;
} {
  const nextClass = getNextClass(currentClass);
  const nextYear = getNextAcademicYear(currentYear);

  if (!nextClass || nextClass === 'PASSED_OUT') {
    return { nextClass: currentClass, nextYear, isPassedOut: true };
  }

  return { nextClass, nextYear, isPassedOut: false };
}
