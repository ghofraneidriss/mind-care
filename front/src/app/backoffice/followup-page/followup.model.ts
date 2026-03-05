export type MoodState = 'CALM' | 'HAPPY' | 'ANXIOUS' | 'AGITATED' | 'DEPRESSED' | 'CONFUSED';
export type IndependenceLevel = 'INDEPENDENT' | 'NEEDS_ASSISTANCE' | 'DEPENDENT';
export type SleepQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface FollowUp {
  id?: number;
  patientId: number | null;
  caregiverId: number | null;
  followUpDate: string | null;

  // Cognitive
  cognitiveScore: number | null;

  // Behaviour
  mood: MoodState | null;
  agitationObserved: boolean;
  confusionObserved: boolean;

  // ADL
  eating: IndependenceLevel | null;
  dressing: IndependenceLevel | null;
  mobility: IndependenceLevel | null;

  // Sleep
  hoursSlept: number | null;
  sleepQuality: SleepQuality | null;

  // Notes
  notes: string | null;
  vitalSigns: string | null;

  // Timestamps
  createdAt?: string | null;
  updatedAt?: string | null;
}
