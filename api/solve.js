export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    // ✅ SAFE BODY PARSING FOR VERCEL
    let body = req.body;

    // If body comes as string (Vercel sometimes does this)
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const question = body?.question;

    if (!question) {
      return res.status(400).json({
        error: "No question received"
      });
    }

    return res.status(200).json({
      answer: "You asked: " + question
    });

  } catch (err) {
    return res.status(500).json({
      error: "Function crashed",
      details: err.message
    });
  }
}
