import OpenAI from 'openai';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    const error = new Error('OpenAI API key is missing');
    error.statusCode = 503;
    throw error;
  }

  return new OpenAI({ apiKey });
};

const getAIErrorResponse = (error, fallbackMessage) => {
  if (error.statusCode) {
    return {
      status: error.statusCode,
      message: 'AI service is not configured on the server'
    };
  }

  if (error.status === 401) {
    return {
      status: 502,
      message: 'AI service authentication failed. Please verify the API key'
    };
  }

  if (error.status === 429) {
    return {
      status: 429,
      message: 'AI service limit reached. Please try again in a moment'
    };
  }

  if (error.status === 404) {
    return {
      status: 502,
      message: 'Configured AI model is unavailable'
    };
  }

  return {
    status: 500,
    message: fallbackMessage
  };
};

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
      model: 'gpt-5.1',
      messages: [{ role: 'user', content: prompt }]
    });

    return res.json({
      description: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    const response = getAIErrorResponse(error, 'Unable to generate freelancer description');
    return res.status(response.status).json({ message: response.message });
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
      model: 'gpt-5.1',
      messages: [{ role: 'user', content: prompt }]
    });

    return res.json({
      improvedDescription: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    const response = getAIErrorResponse(error, 'Unable to improve project description');
    return res.status(response.status).json({ message: response.message });
  }
};
