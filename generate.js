export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scene, videoType, mood, numShots } = req.body;

  if (!scene || typeof scene !== 'string' || scene.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a scene description (at least 10 characters).' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const prompt = `You are an expert cinematographer and film director. Generate a professional shot list for the following scene.

Scene description: ${scene.trim()}
Video type: ${videoType || 'short film'}
Mood / style: ${mood || 'cinematic'}
Number of shots requested: ${numShots || 10}

Return ONLY a valid JSON object with this exact structure, no other text:
{
  "title": "A short evocative title for this shot list (max 6 words)",
  "shots": [
    {
      "description": "Vivid description of what the camera sees and captures in this shot (2-3 sentences)",
      "angle": "Camera angle (e.g. Low angle, Eye level, Bird's eye, Dutch angle, Over-the-shoulder)",
      "movement": "Camera movement (e.g. Static, Slow push in, Handheld, Dolly back, Pan left, Crane up)",
      "lens": "Lens suggestion (e.g. 24mm wide, 50mm standard, 85mm portrait, 135mm telephoto)",
      "duration": "Estimated duration (e.g. 3–5 sec, 8–12 sec)"
    }
  ]
}

Make the shots cinematically thoughtful, varied in angle and movement, and appropriate for the mood. Include establishing shots, coverage, inserts and reaction shots where appropriate.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Anthropic API error ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    let parsed;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('Failed to parse AI response. Please try again.');
    }

    if (!parsed.shots || !Array.isArray(parsed.shots)) {
      throw new Error('Unexpected response format. Please try again.');
    }

    return res.status(200).json(parsed);

  } catch (e) {
    console.error('Generate error:', e.message);
    return res.status(500).json({ error: e.message || 'Generation failed. Please try again.' });
  }
}
