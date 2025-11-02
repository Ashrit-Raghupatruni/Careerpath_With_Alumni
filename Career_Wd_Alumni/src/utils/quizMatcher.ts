import { Alumni } from './supabase';

// Simple matching algorithm based on skills and interests overlap
export const calculateMatchScore = (
  quizAnswers: Record<string, any>,
  alumni: Alumni
): { score: number; explanation: string } => {
  let score = 0;
  const reasons: string[] = [];

  // Extract skills from quiz answers
  const userSkills = (quizAnswers.skills || []).map((s: string) => s.toLowerCase());
  const userInterests = (quizAnswers.interests || []).map((i: string) => i.toLowerCase());
  const careerGoal = (quizAnswers.career_goal || '').toLowerCase();

  // Match skills (40 points max)
  const alumniSkills = alumni.skills.map(s => s.toLowerCase());
  const matchedSkills = userSkills.filter((skill: string) =>
    alumniSkills.some(as => as.includes(skill) || skill.includes(as))
  );
  const skillScore = Math.min(40, matchedSkills.length * 10);
  score += skillScore;
  if (matchedSkills.length > 0) {
    reasons.push(`${matchedSkills.length} matching skills: ${matchedSkills.slice(0, 3).join(', ')}`);
  }

  // Match interests (30 points max)
  const alumniInterests = alumni.interests.map(i => i.toLowerCase());
  const matchedInterests = userInterests.filter((interest: string) =>
    alumniInterests.some(ai => ai.includes(interest) || interest.includes(ai))
  );
  const interestScore = Math.min(30, matchedInterests.length * 10);
  score += interestScore;
  if (matchedInterests.length > 0) {
    reasons.push(`${matchedInterests.length} matching interests`);
  }

  // Match career goal with role/company (30 points max)
  if (careerGoal) {
    const roleMatch = alumni.role.toLowerCase().includes(careerGoal) || careerGoal.includes(alumni.role.toLowerCase());
    const companyMatch = alumni.company.toLowerCase().includes(careerGoal) || careerGoal.includes(alumni.company.toLowerCase());

    if (roleMatch) {
      score += 20;
      reasons.push(`Role aligns with your career goal`);
    }
    if (companyMatch) {
      score += 10;
      reasons.push(`Company matches your interest`);
    }
  }

  const explanation = reasons.length > 0
    ? reasons.join(' • ')
    : 'General career alignment';

  return { score: Math.min(100, score), explanation };
};

export const matchAlumni = (
  quizAnswers: Record<string, any>,
  allAlumni: Alumni[]
): Array<{ alumni: Alumni; score: number; explanation: string }> => {
  const matches = allAlumni.map(alumni => ({
    alumni,
    ...calculateMatchScore(quizAnswers, alumni)
  }));

  // Sort by score descending and return top 5
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
