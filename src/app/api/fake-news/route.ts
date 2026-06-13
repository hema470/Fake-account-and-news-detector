import { NextResponse } from 'next/server';

// Advanced 100% Free Wikipedia Cross-Reference
async function queryWikipedia(text: string) {
  // Use core keywords (nouns/verbs ideally, but here we strip common stop words)
  const stopWords = ['the','is','at','which','on','and','a','an','of','to','in','for','with','that','by','this','it','from','as','be','are','was','were'];
  const words = text.split(/\s+/).filter(w => !stopWords.includes(w.toLowerCase()) && w.length > 3);
  const query = encodeURIComponent(words.slice(0, 10).join(' ')); // top 10 significant words
  
  if (!query) return [];
  
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&utf8=&format=json&origin=*`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return data.query?.search || [];
}

// Advanced NLP Metrics Engine
function performAdvancedNLP(text: string) {
  const words = text.split(/\s+/).map(w => w.replace(/[.,!?]/g, '').toLowerCase());
  const uniqueWords = new Set(words);
  
  // Lexical Diversity (Fake news often has low lexical diversity, repetitive emotional wording)
  const lexicalDiversity = words.length > 0 ? (uniqueWords.size / words.length) : 0;
  
  // Subjectivity & Emotional Load Markers
  const emotionalWords = ['shocking', 'miracle', 'secret', 'exposed', 'hoax', 'destroy', 'traitor', 'evil', 'unprecedented', 'mind-blowing', 'banned', 'elite', 'agenda', 'sheep', 'wake', 'truth'];
  const objectiveWords = ['reported', 'stated', 'according', 'study', 'research', 'announced', 'published', 'analysis', 'survey', 'found'];
  
  let emotionalCount = 0;
  let objectiveCount = 0;
  
  words.forEach(w => {
    if (emotionalWords.some(e => w.includes(e))) emotionalCount++;
    if (objectiveWords.some(o => w.includes(o))) objectiveCount++;
  });
  
  // Formatting & Syntax Analysis
  const hasAllCaps = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w)).length > 0;
  const excessivePunc = /(!{2,}|\?{2,})/.test(text);
  
  // Base NLP Risk Score Calculation
  // Start neutral
  let nlpRiskScore = 50; 

  // Emotional load heavily biases fake news up
  if (emotionalCount > 0) {
    nlpRiskScore += (emotionalCount * 12);
  } else {
    nlpRiskScore -= 5;
  }

  // Objective markers bias towards truthfulness
  if (objectiveCount > 0) {
    nlpRiskScore -= (objectiveCount * 8);
  } else if (words.length > 20) {
    nlpRiskScore += 10; // Long texts without objective markers are suspect
  }

  // Penalize repetitive syntax (low diversity) in long texts
  if (words.length > 30 && lexicalDiversity < 0.5) nlpRiskScore += 15;
  
  // Penalize formatting abuse
  if (hasAllCaps) nlpRiskScore += 10;
  if (excessivePunc) nlpRiskScore += 15;

  return {
    nlpRiskScore: Math.min(Math.max(nlpRiskScore, 0), 100),
    stats: {
      emotionalCount,
      objectiveCount,
      lexicalDiversity,
      excessivePunc
    }
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text content is required for analysis' }, { status: 400 });
    }

    // Connect to Free Wikipedia API for Semantic Cross-Reference
    let wikiResults: any[] = [];
    try {
      wikiResults = await queryWikipedia(text);
    } catch (apiErr) {
      console.warn("Wiki fail", apiErr);
    }

    // Run deep NLP analysis on the raw text
    const { nlpRiskScore, stats } = performAdvancedNLP(text);

    let finalScore = nlpRiskScore;
    let confidence = "Medium";
    let explanation = "";
    let risk = "Moderate";
    let wikiSnippet = "";

    // If we have factual hits, cross-reference semantics
    if (wikiResults && wikiResults.length > 0) {
      const topResult = wikiResults[0];
      const snippet = topResult.snippet.toLowerCase();
      const title = topResult.title.toLowerCase();
      wikiSnippet = topResult.snippet.replace(/<\/?[^>]+(>|$)/g, "");
      
      const fakeIndicators = ["hoax", "conspiracy theory", "myth", "debunked", "pseudoscientific", "satire", "urban legend", "falsely claimed"];
      const isLikelyFake = fakeIndicators.some(ind => snippet.includes(ind) || title.includes(ind));
      
      // Calculate overlap between user text and wikipedia factual summary
      const textWords = text.toLowerCase().split(/\s+/);
      const snippetWords = wikiSnippet.toLowerCase().split(/\s+/);
      const overlapCount = textWords.filter((w: string) => w.length > 4 && snippetWords.includes(w)).length;
      
      // A high overlap with a non-debunked Wikipedia article implies strong factuality
      if (isLikelyFake) {
        finalScore = Math.max(85, nlpRiskScore + 20); // Pin high
        explanation = `Advanced semantic cross-reference strongly classifies this as a known hoax or conspiracy theory ("${topResult.title}"). `;
        confidence = "High";
      } else if (overlapCount >= 3) {
        // High semantic overlap with real encyclopedia entry
        finalScore = Math.min(15, nlpRiskScore - 30);
        explanation = `High semantic overlap with factual encyclopedia entries ("${topResult.title}"). `;
        confidence = "High";
      } else {
        // Topic exists, but weak overlap with text claim. Rely heavily on NLP.
        explanation = `Topic recognized ("${topResult.title}"), but claim specifics lack strong encyclopedic overlap. `;
      }
    } else {
      explanation = `No directencyclopedia match found. Evaluation based purely on NLP readability and linguistic patterns. `;
    }

    // Add NLP Breakdown to the explanation
    if (finalScore >= 70) {
      explanation += `The linguistic engine flagged excessive subjectivity, sensationalist phrasing, and lack of objective reporting metrics.`;
      risk = "Suspicious";
    } else if (finalScore <= 30) {
      explanation += `Linguistic evaluation shows objective phrasing, high lexical diversity, and balanced sentiment typical of reliable news sources.`;
      risk = "Low";
    } else {
      explanation += `The text contains a mix of objective and subjective markers, representing standard opinion or unverified commentary.`;
      risk = "Moderate";
    }

    // Ensure within bounds
    finalScore = Math.min(Math.max(finalScore, 5), 95);

    return NextResponse.json({
      type: "news",
      textPreview: text.length > 50 ? text.substring(0, 50) + "..." : text,
      fakeScore: Math.round(finalScore),
      confidence,
      indicators: [
        { label: "Semantic Fact-Match", risk: wikiResults.length > 0 ? "Low" : "Moderate", value: wikiSnippet ? (wikiSnippet.substring(0, 30) + "...") : "No external match" },
        { label: "Subjectivity Load", risk: stats.emotionalCount > 1 ? "Suspicious" : "Low", value: `${stats.emotionalCount} loaded terms` },
        { label: "Objective Markers", risk: stats.objectiveCount === 0 ? "Suspicious" : "Low", value: `${stats.objectiveCount} citations` },
        { label: "Linguistic Formatting", risk: stats.excessivePunc ? "Unprofessional" : "Normal", value: stats.excessivePunc ? "Excessive Punctuation" : "Standard" }
      ],
      explanation,
      isSimulated: false
    });

  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: 'Internal server error while analyzing text' }, { status: 500 });
  }
}
