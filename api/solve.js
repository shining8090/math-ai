export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    // 🔥 FIX: safely parse body (VERY IMPORTANT for Vercel)
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const question = body?.question || "no question received";

    return res.status(200).json({
      answer: "You asked: " + question
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server crashed",
      details: error.message
    });
  }
}
