import type { Level } from "@/types/course";

export const levelMapping: Record<Level, { text: string; color: string }> = {
    beginner: { text: 'Sơ cấp', color: 'blue' },
    intermediate: { text: 'Trung cấp', color: 'orange' },
    advanced: { text: 'Nâng cao', color: 'purple' },
};    