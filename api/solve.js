export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { question } = req.body;

  return res.status(200).json({
    answer: "You asked: " + question
  });
}
