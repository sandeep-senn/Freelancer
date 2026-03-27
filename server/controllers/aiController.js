import OpenAI from 'openai';

const getOpenAI = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

export const generateFreelancerDescription = async (req, res) => {
  try {
    const { skills, role, experience } = req.body;

    if (!skills || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const openai = getOpenAI();

    const prompt = `
Write a professional freelancer profile description.
Role: ${role}
Skills: ${skills}
Experience: ${experience || 'Fresher'}
Tone: professional, concise, client-friendly (4-5 lines)
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    return res.json({
      description: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to generate freelancer description' });
  }
};

export const improveProjectDescription = async (req, res) => {
  try {
    const { title, description, skills, budget } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description required' });
    }

    const openai = getOpenAI();

    const prompt = `
Improve this freelance project description.
Title: ${title}
Description: ${description}
Skills: ${skills}
Budget: ${budget}
Make it clear, structured, and professional.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }]
    });

    return res.json({
      improvedDescription: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to improve project description' });
  }
};
