/**
 * AI Coach Chat API Endpoint
 * Handles natural language Q&A about user performance using OpenAI GPT-4
 */

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context, tier } = req.body;

    // Validate input
    if (!message || !context || !tier) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user has access to AI chat
    if (tier === 'FREE') {
      return res.status(403).json({ 
        error: 'Upgrade required',
        message: 'AI coaching is available for PRO and GURU subscribers only.'
      });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not set');
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'AI service is not configured. Please contact support.'
      });
    }

    // Build system prompt based on tier
    const systemPrompt = buildSystemPrompt(tier);

    // Build context message with user's stats
    const contextMessage = buildContextMessage(context);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: contextMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error('OpenAI API error:', error);
      return res.status(500).json({ 
        error: 'AI service error',
        message: 'Failed to get AI response. Please try again.'
      });
    }

    const data = await openaiResponse.json();
    const answer = data.choices[0].message.content;

    return res.status(200).json({
      answer,
      usedTier: tier
    });

  } catch (error) {
    console.error('Coach chat error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Failed to process your request. Please try again.'
    });
  }
};

/**
 * Build system prompt based on subscription tier
 */
function buildSystemPrompt(tier) {
  const basePrompt = `You are an AI performance coach for professional car salespeople using CarCashPro, a commission and deal tracking app.

Your role:
- Give clear, concise, practical guidance rooted in their numbers
- Be direct, supportive, and focused on actions they can take today or this week
- Always reference specific numbers when available (deals, dollars, days)
- Keep responses under 100 words
- Do NOT flatter them unnecessarily
- Focus on what they can control

Style:
- Use "you" and "your" (second person)
- Be encouraging but realistic
- Suggest specific actions when possible`;

  if (tier === 'PRO') {
    return `${basePrompt}

PRO Tier Limitations:
- Keep answers shorter and more focused
- Avoid complex "what-if" simulations
- Stick to current month analysis
- Don't compare multiple time periods in detail`;
  } else if (tier === 'GURU') {
    return `${basePrompt}

GURU Tier Capabilities:
- You may run deeper analysis and compare periods
- You can suggest what-if scenarios when asked
- You can analyze trends over multiple months
- You can provide more detailed strategic advice`;
  }

  return basePrompt;
}

/**
 * Build context message with user's performance stats
 */
function buildContextMessage(context) {
  const { stats } = context;
  
  const paceDelta = stats.dealsThisMonth - ((stats.monthlyGoal / stats.daysInMonth) * stats.daysElapsed);
  const paceStatus = paceDelta >= 1 ? 'ahead' : paceDelta <= -1 ? 'behind' : 'on track';
  const daysRemaining = stats.daysInMonth - stats.daysElapsed;

  return `Current Performance Data:

Monthly Goal: ${stats.monthlyGoal} deals
Deals This Month: ${stats.dealsThisMonth}
Deals Last Month: ${stats.dealsLastMonth}
Commission This Month: $${Math.round(stats.commissionThisMonth).toLocaleString()}
Commission Last Month: $${Math.round(stats.commissionLastMonth).toLocaleString()}
Average Commission This Month: $${Math.round(stats.avgCommissionThisMonth).toLocaleString()}
Average Commission Last Month: $${Math.round(stats.avgCommissionLastMonth).toLocaleString()}
Days Elapsed: ${stats.daysElapsed} of ${stats.daysInMonth}
Days Remaining: ${daysRemaining}
Deals Today: ${stats.todayDeals}
Recent Days Without Deals: ${stats.recentDaysWithoutDeals}
Current Pace: ${paceStatus} (${paceDelta > 0 ? '+' : ''}${Math.round(paceDelta * 10) / 10} deals vs expected)

Use these numbers to answer the user's question accurately and provide actionable advice.`;
}
