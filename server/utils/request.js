export const parseSkillInput = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === 'string') {
    return skills.split(',').map((skill) => skill.trim()).filter(Boolean);
  }

  return [];
};

export const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
