/**
 * Copyright (c) 2026 Joemar Jane Cardiño. All rights reserved.
 * Proprietary and Confidential. Unauthorized copying of this file is strictly prohibited.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
