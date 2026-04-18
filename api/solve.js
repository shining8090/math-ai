export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    // ✅ SAFE BODY HANDLING (WORKS ON ALL VERCEL ENVIRONMENTS)
    let body = req.body;

    if (!body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // If body is string → parse it
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    const question = body.question;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    return res.status(200).json({
      answer: "You asked: " + question
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server crashed",
      details: err.message
    });
  }
}
