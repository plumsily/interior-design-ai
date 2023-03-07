import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const design = req.body.input || "";
  if (design.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid quality",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(design),
      temperature: 0.7,
      max_tokens: 500,
      stop: ["Style:"],
    });
    // console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(design) {
  const capitalizedDesign =
    design[0].toUpperCase() + design.slice(1).toLowerCase();
  return `Suggest 3 interior design styles for a space to feel cozy and why. Use long answers and in JSON format. For example:
  
  Quality: Clean
  Style: Minimalist - Minimalism is a design style that emphasizes simplicity and functionality, with a focus on clean lines, neutral colors, and uncluttered spaces. The minimalist aesthetic can create a sense of calm and order in a room, making it feel clean and well-organized. The key to achieving a minimalist look is to keep furnishings and decor to a minimum, with a focus on items that are both functional and beautiful. This can include furniture with clean lines, simple artwork, and a few carefully chosen accessories. In a minimalist space, less is definitely more. BREAK Scandinavian - Scandinavian design is known for its light and airy aesthetic, with a focus on natural materials, light colors, and simple lines. This style is ideal for creating a sense of cleanliness and order, with a focus on open spaces and natural light. Scandinavian interiors often incorporate light-colored wood, natural textiles, and minimalist furnishings, creating a cozy and inviting feel. The key to achieving a Scandinavian look is to focus on simplicity and functionality, with a few carefully chosen pieces that add warmth and texture to the space. BREAK Contemporary - Contemporary design is a style that emphasizes clean lines, geometric shapes, and a neutral color palette. This style is ideal for creating a sense of cleanliness and sophistication in a space. Contemporary interiors often incorporate sleek furniture, modern artwork, and minimalist decor, creating a look that is both elegant and streamlined. The key to achieving a contemporary look is to focus on order, with a few carefully chosen pieces that add visual interest to the space.
  
  Suggest 3 interior design styles for a space to feel ${capitalizedDesign} and why.
  
  Quality: ${capitalizedDesign}
  Style:`;
}
