export type AuthUser = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
} | null;

export type QuizAttempt = {
  session_token: string;
  score: number;
  total_questions: number;
  answered_questions: number;
  completed_at: string;
  auto_submitted: boolean;
};

export type LeaderboardEntry = {
  user_id: string;
  full_name: string;
  school_name: string | null;
  grade_level: string | null;
  attempts_count: number;
  total_points: number;
  average_percentage: number;
  best_score: number;
  last_completed_at: string | null;
};

export const fallbackLeaderboardRows: LeaderboardEntry[] = [
  {
    user_id: 'fallback-1',
    full_name: 'Adebimpe Rhoda',
    school_name: 'Olashoore International School',
    grade_level: 'SS3',
    attempts_count: 24,
    total_points: 1120,
    average_percentage: 93.2,
    best_score: 49,
    last_completed_at: null,
  },
  {
    user_id: 'fallback-2',
    full_name: 'Sijuwade Lawrence',
    school_name: 'Iloko Model College',
    grade_level: 'SS2',
    attempts_count: 20,
    total_points: 980,
    average_percentage: 90.4,
    best_score: 47,
    last_completed_at: null,
  },
  {
    user_id: 'fallback-3',
    full_name: 'Amos Ayomide',
    school_name: 'LSE Graduate Dept',
    grade_level: 'Postgraduate',
    attempts_count: 19,
    total_points: 940,
    average_percentage: 88.9,
    best_score: 46,
    last_completed_at: null,
  },
];

export function getScholarIdentity(user: AuthUser) {
  const metadata = user?.user_metadata ?? {};
  const metadataFullName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';
  const emailPrefix = user?.email ? user.email.split('@')[0] : '';
  const fullName = metadataFullName || emailPrefix || 'Digital Scholar';
  const firstName = fullName.split(' ')[0] || 'Scholar';
  const schoolName =
    typeof metadata.school_name === 'string' && metadata.school_name.trim()
      ? metadata.school_name.trim()
      : 'School not added yet';
  const gradeLevel =
    typeof metadata.grade_level === 'string' && metadata.grade_level.trim()
      ? metadata.grade_level.trim()
      : 'Grade level not added yet';

  return {
    fullName,
    firstName,
    schoolName,
    gradeLevel,
    email: user?.email ?? null,
  };
}

export function derivePerformance(attempts: QuizAttempt[]) {
  const completedCount = attempts.length;
  const averageAccuracy =
    completedCount === 0
      ? 0
      : Math.round(
          attempts.reduce((sum, attempt) => sum + (attempt.score / Math.max(attempt.total_questions, 1)) * 100, 0) /
            completedCount,
        );
  const bestScore = attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);
  const totalPoints = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const answeredQuestions = attempts.reduce((sum, attempt) => sum + attempt.answered_questions, 0);
  const latestAttemptAt = attempts[0]?.completed_at ?? null;

  return {
    completedCount,
    averageAccuracy,
    bestScore,
    totalPoints,
    answeredQuestions,
    latestAttemptAt,
  };
}

export function buildScholarInsights(
  user: AuthUser,
  attempts: QuizAttempt[],
  leaderboardEntries: LeaderboardEntry[],
) {
  const identity = getScholarIdentity(user);
  const performance = derivePerformance(attempts);
  const leaderboardEntry = user ? leaderboardEntries.find((entry) => entry.user_id === user.id) ?? null : null;
  const rank = user ? leaderboardEntries.findIndex((entry) => entry.user_id === user.id) + 1 : 0;
  const totalPoints = leaderboardEntry?.total_points ?? performance.totalPoints;
  const averageAccuracy = leaderboardEntry ? Math.round(leaderboardEntry.average_percentage) : performance.averageAccuracy;
  const bestScore = leaderboardEntry?.best_score ?? performance.bestScore;
  const completedCount = leaderboardEntry?.attempts_count ?? performance.completedCount;

  let stageLabel = 'Tier I Foundation';
  if (bestScore >= 45 || averageAccuracy >= 85 || completedCount >= 8) {
    stageLabel = 'Tier III Elite';
  } else if (bestScore >= 35 || averageAccuracy >= 65 || completedCount >= 4) {
    stageLabel = 'Tier II Specialist';
  }

  const progressPercent = Math.max(
    8,
    Math.min(100, completedCount * 10 + Math.round(averageAccuracy * 0.45) + (rank > 0 ? 10 : 0)),
  );
  const weeklyGoalTarget = 14;
  const weeklyGoalCompleted = Math.min(weeklyGoalTarget, completedCount * 2 + (averageAccuracy >= 70 ? 2 : 0));
  const nextMilestone = totalPoints >= 100 ? Math.ceil((totalPoints + 1) / 100) * 100 : 100;
  const upcomingRound =
    averageAccuracy >= 80 ? 'Elite Logic Sprint' : averageAccuracy >= 60 ? 'Systems Architecture Round' : 'Foundation Warm-Up';
  const recommendedFocus =
    identity.gradeLevel.includes('SS3')
      ? 'Senior qualifier polish'
      : identity.gradeLevel.includes('SS2')
        ? 'Competitive speed drills'
        : identity.gradeLevel.includes('JS')
          ? 'Digital literacy basics'
          : 'Core quiz foundations';

  return {
    ...identity,
    completedCount,
    averageAccuracy,
    bestScore,
    totalPoints,
    answeredQuestions: performance.answeredQuestions,
    latestAttemptAt: performance.latestAttemptAt,
    leaderboardEntry,
    rank: rank > 0 ? rank : null,
    stageLabel,
    progressPercent,
    weeklyGoalCompleted,
    weeklyGoalTarget,
    nextMilestone,
    upcomingRound,
    recommendedFocus,
  };
}

export function formatAttemptTimestamp(value: string | null) {
  if (!value) {
    return 'No submitted quiz yet';
  }

  return new Date(value).toLocaleString();
}

export function formatAttemptDate(value: string | null) {
  if (!value) {
    return 'No recent quiz yet';
  }

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
