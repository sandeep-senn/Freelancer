import OpenAI from "openai";

// create client only when API is called
const getOpenAI = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};
console.log(process.env.OPENAI_API_KEY)

// 🧑‍💻 Freelancer Description
export const generateFreelancerDescription = async (req, res) => {
  try {
    const { skills, role, experience } = req.body;

    if (!skills || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const openai = getOpenAI();

    const prompt = `
Write a professional freelancer profile description.
Role: ${role}
Skills: ${skills}
Experience: ${experience || "Fresher"}
Tone: professional, concise, client-friendly (4-5 lines)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      description: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 📦 Project Description Improver
export const improveProjectDescription = async (req, res) => {
  try {
    const { title, description, skills, budget } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description required" });
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
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      improvedDescription: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
