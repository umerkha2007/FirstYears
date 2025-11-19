export const calculateAge = (dateOfBirth: string): { months: number; weeks: number; days: number; years: number } => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  
  // Calculate years
  let years = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  
  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    years--;
  }
  
  // Calculate total time difference
  const diffTime = Math.abs(now.getTime() - dob.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const months = Math.floor(diffDays / 30.44); // More accurate month calculation
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays;
  
  return { years, months, weeks, days };
};

export const formatAge = (dateOfBirth: string): string => {
  const age = calculateAge(dateOfBirth);
  
  // For babies under 1 week
  if (age.days < 7) {
    return `${age.days} day${age.days !== 1 ? 's' : ''} old`;
  }
  
  // For babies under 2 months, show weeks
  if (age.months < 2) {
    return `${age.weeks} week${age.weeks !== 1 ? 's' : ''} old`;
  }
  
  // For babies/toddlers under 2 years, show months
  if (age.years < 2) {
    return `${age.months} month${age.months !== 1 ? 's' : ''} old`;
  }
  
  // For children 2 years and older, show years
  if (age.years === 1) {
    return '1 year old';
  }
  
  return `${age.years} years old`;
};
