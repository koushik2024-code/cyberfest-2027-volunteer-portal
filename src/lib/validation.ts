import { DepartmentName } from '@/types';
import { DEPARTMENTS } from './constants';

const VALID_DEPARTMENT_NAMES: DepartmentName[] = DEPARTMENTS.map((d) => d.name);

// Sanitize string to prevent XSS / injection
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim();
}

// Validate Full Name
export function validateFullName(name: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(name);
  if (!sanitized) {
    return { isValid: false, error: 'Full Name is required.' };
  }
  if (sanitized.length < 3) {
    return { isValid: false, error: 'Full Name must be at least 3 characters long.' };
  }
  if (sanitized.length > 80) {
    return { isValid: false, error: 'Full Name must not exceed 80 characters.' };
  }
  // Allow letters, spaces, dots, and hyphens
  const nameRegex = /^[A-Za-z\s.\-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, error: 'Full Name can only contain letters, spaces, dots, and hyphens.' };
  }
  return { isValid: true };
}

// Validate Roll Number
// CBIT Roll numbers are typically 12 characters (e.g. 160123733045) or standard college roll numbers
export function validateRollNumber(rollNumber: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(rollNumber).toUpperCase();
  if (!sanitized) {
    return { isValid: false, error: 'Roll Number is required.' };
  }
  if (sanitized.length < 6 || sanitized.length > 20) {
    return { isValid: false, error: 'Roll Number must be between 6 and 20 characters.' };
  }
  // Alphanumeric check
  const rollRegex = /^[A-Z0-9\-_/]+$/;
  if (!rollRegex.test(sanitized)) {
    return { isValid: false, error: 'Roll Number can only contain letters, numbers, hyphens, and slashes.' };
  }
  return { isValid: true };
}

// Validate Areas of Interest
export function validateAreasOfInterest(areas: any[]): { isValid: boolean; error?: string; cleanAreas?: DepartmentName[] } {
  if (!Array.isArray(areas) || areas.length === 0) {
    return { isValid: false, error: 'Please select at least one department / area of interest.' };
  }
  const filtered = areas.filter((a) => VALID_DEPARTMENT_NAMES.includes(a as DepartmentName)) as DepartmentName[];
  if (filtered.length === 0) {
    return { isValid: false, error: 'Invalid department selection.' };
  }
  // Deduplicate
  const unique = Array.from(new Set(filtered));
  return { isValid: true, cleanAreas: unique };
}

// Generate human-friendly reference ID: CF27-VOL-XXXXXX
export function generateApplicationId(): string {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CF27-VOL-${randomChars}`;
}
