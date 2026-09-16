export type TabType = 
  | 'track-tracker' 
  | 'the-paddock' 
  | 'the-stable' 
  | 'trainer-connect' 
  | 'hall-of-fame';

export interface Jockey {
  id: string;
  name: string;
  role: string;
  tier: 'Rookie' | 'Pro Jockey' | 'Triple Crown Contender' | 'Master Trainer';
  avatar?: string;
  initials?: string;
  points: number;
  progressPercent: number;
  streakDays: number;
  rank: number;
  mentorName?: string;
  recentActivity?: string;
}

export interface SubmissionItem {
  id: string;
  jockeyName: string;
  jockeyAvatar?: string;
  jockeyInitials?: string;
  points: number;
  title: string;
  description?: string;
  note?: string;
  timeAgo: string;
  status: 'pending' | 'approved' | 'denied';
  verificationTier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  proofType?: 'file' | 'mls' | 'honor';
  proofFileName?: string;
  proofFileSize?: string;
  mlsNumber?: string;
  evidencePreviewUrl?: string;
}

export interface StableRanking {
  rank: number;
  name: string;
  tier: string;
  rawPoints: number;
  normalizedPoints: number;
  agentCount: number;
  trackProgressPercent: number;
  weeklyChange: string;
  weeklyChangeType: 'up' | 'flat' | 'down';
  logoUrl?: string;
  isTopThree?: boolean;
}

export interface ActivityTask {
  id: string;
  title: string;
  description: string;
  category: 'Education' | 'Production' | 'Networking' | 'Mentorship';
  points: number;
  badge?: string;
  progressText?: string;
  progressCurrent?: number;
  progressTotal?: number;
  locked?: boolean;
  lockReason?: string;
  nextDate?: string;
  participantsCount?: number;
  verificationTier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  requiredProof?: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  seasonBadge: string;
  seasonYear: string;
  quote?: string;
  imageUrl: string;
  specialties: string[];
  bio: string;
  winRate: number;
  totalPurses?: string;
  menteesCount?: number;
  rankBadgeIcon?: string;
  isFeatured?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}
