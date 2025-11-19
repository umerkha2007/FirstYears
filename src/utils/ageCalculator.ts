export const calculateAge = (dateOfBirth: string): { months: number; weeks: number; days: number } => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dob.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const months = Math.floor(diffDays / 30);
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays;
  
  return { months, weeks, days };
};

export const formatAge = (dateOfBirth: string): string => {
  const age = calculateAge(dateOfBirth);
  
  if (age.months < 1) {
    if (age.weeks < 1) {
      return `${age.days} day${age.days !== 1 ? 's' : ''} old`;
    }
    return `${age.weeks} week${age.weeks !== 1 ? 's' : ''} old`;
  }
  
  if (age.months < 12) {
    return `${age.months} month${age.months !== 1 ? 's' : ''} old`;
  }
  
  return '1 year old';
};
