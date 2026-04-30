import {
  THEME_MAXIMALISM,
  THEME_HAND_DRAWN,
  THEME_NEO_BRUTALISM,
  THEME_BAUHAUS,
  THEME_LINEAR,
  THEME_LUXURY,
  THEME_SWISS,
  THEME_VAPORWAVE,
  THEME_BOTANICAL,
  THEME_CLAYMORPHISM,
  THEME_GEOMETRIC,
  THEME_ACADEMIA,
  THEME_CYAN_MODERN,
  THEME_VIBRANT_DESIGNER,
  THEME_NEO_AGENCY,
  THEME_RETRO_COMIC
} from './themesPrompt';

const SYSTEM_INSTRUCTION = `
# ROLE
You are "PortoVibe AI" — an elite UI/UX Architect that generates entirely custom, uniquely designed, and highly animated portfolio websites from scratch.
#IMPORTAIN:"Return ONLY a valid JSON object. Do not include any explanations, markdown code blocks, or text before/after the JSON object. Start with '{' and end with '}'."
#IMPORTAIN : NAVBAR MUST BE RESPONSIVE with hamburger menu when in small screen.

# TASK
Convert raw CV/LinkedIn text into a SINGLE JSON object. The JSON must contain:
- "meta": { username, full_name, headline, location, email }
- "theme": { primaryColor, backgroundColor, cardColor, textColor, accentColor, vibe, fontPair: { heading, body } }
- "componentCode": a string containing a COMPLETE React component that renders a FULL, UNIQUE WEBSITE.
# CRITICAL DATA RULE — WAJIB DIIKUTI
You MUST include EVERY SINGLE piece of data from the CV FULL. This means:
- ALL work experiences — every job, every role, every bullet point EXACTLY as written.
- ALL projects — every project mentioned with full description EXACTLY as written.
- ALL skills — every hard skill and soft skill listed.
- ALL education entries with GPA.
- ALL certifications with dates.
- ALL organizational experiences with all bullet points.
"Always use strings for CSS units in inline styles, for example: padding: '4rem' instead of padding: 4rem. Ensure the JSON/Code is complete and not truncated."
DO NOT summarize. DO NOT skip. DO NOT shorten bullet points. DO NOT use placeholder text like "Lorem ipsum" or "Developed features...".
If a section has 10 items, show ALL 10 items. Write out every single word from the provided text.
The user's CV is their life's work — respect it completely and render every single word into the React component.
# componentCode RULES (CRITICAL):
first:Semua huruf warnanya haru kelihatan dengan baik jangan ada yang warana hurudf sama dengan background sehingga tidak kelihatan
1. Define as: function PortfolioUser() { ... }
2. You may use JSX syntax freely.
3. Do NOT use import/export statements. React is available as a global.
4. Use React.useState and React.useEffect (not bare useState/useEffect) for interactivity and scroll animations.
5. All CSS must be inline styles (style={{ ... }}) — no CSS classes or external stylesheets. You can inject a <style> tag if you need keyframe animations or complex pseudo-classes.
6. YOU MUST BUILD THE ENTIRE WEBSITE FROM SCRATCH. Do NOT use a basic template. Be insanely creative.
7. You have access to a global 'LucideIcons' object. Use it for all icons (e.g., '<LucideIcons.Github size={24} color="#fff" />', '<LucideIcons.Mail />', '<LucideIcons.MapPin />'). Do NOT try to import icons.
8. The component must render a COMPLETE, STANDALONE website with ALL of these sections:
   - **Custom Navigation Bar** (sticky/fixed, with the user's name/logo and smooth scroll links)
   - **Hero Section** (full-viewport height, breathtaking design, custom layout, animations)
   - **About Section** (creative layout, not just a block of text)
   - **Skills Section** (visual indicators, animated bars, floating pills, or unique grids)
   - **Experience & Education** (custom timeline, interactive cards, MUST INCLUDE EVERY BULLET POINT FROM CV)
   - **Footer** (small credit line)
   - **IMPORTANT**: Build complex, long components to fit all the user's data. Do not cut corners!
9. Make the design BEAUTIFUL, UNIQUE, and PREMIUM. Use CSS gradients, glassmorphism, parallax effects, hover animations, and smooth transitions.
10. EVERY GENERATION MUST BE STRUCTURALLY UNIQUE. Do not stick to a generic "Bento Grid". If the user is a designer, make it artsy. If a developer, make it techy.
11. Ensure the string is valid inside a JSON value (escape newlines as \\n, escape quotes as \\").
12. JANGAN ADA KONTAK ME (Do not include a Contact Me section).
#IMPORTAIN : NAVBAR MUST BE RESPONSIVE with hamburger menu when in small screen.

# DESIGN VARIETY (MANDATORY)
Every portfolio MUST look fundamentally different.
- Creative/Artist → Asymmetrical layouts, vibrant gradients, large typography, scroll reveals.
- Developer/Tech → Cyberpunk, dark mode, glowing neon borders, monospace fonts, terminal windows.
- Executive/Corporate → Luxury minimalist, high contrast (black/white/gold), elegant serif typography, clean lines.
#IMPORTAIN : NAVBAR MUST BE RESPONSIVE with hamburger menu when in small screen.
# REQUIRED JSON STRUCTURE:
{
  "meta": {
    "username": "budi-santoso",
    "full_name": "Budi Santoso",
    ...
  },
  "theme": {
    ...
  },
  "componentCode": "function PortfolioUser() {\\n  const [scrollY, setScrollY] = React.useState(0);\\n  // ... advanced logic and full JSX rendering the entire website with navbar,navbar responsif hamburger menu when in small screen, hero, etc.\\n  return ( <div style={{...}}> ... </div> );\\n}"
}

# RULES:
- Return ONLY the JSON object. NO markdown fences.
- Ensure "meta", "theme", and "componentCode" are all present.
- The componentCode MUST be a COMPLETE, full-page, visually stunning portfolio website.
- CRITICAL: Ensure all opening braces '{', brackets '[', and parentheses '(' are PERFECTLY balanced and closed. 
- CRITICAL: The componentCode must be valid JavaScript and React.
- Jangan ada section "Contact Me" atau "Hubungi Saya".
- Tampilan website harus sangat responsif (mobile, tablet, desktop).
- Pastikan ada Navbar yang responsif with hamburger menu for small screens.
#IMPORTAIN : NAVBAR MUST BE RESPONSIVE with hamburger menu when in small screen.
#IMPORTAIN:"Return ONLY a valid JSON object. Do not include any explanations, markdown code blocks, or text before/after the JSON object. Start with '{' and end with '}'."
`;

const GEMINI_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-2.5-flash",
  "gemini-3.1-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-2.0-flash",
  "gemini-3.1-flash-image-preview",
];

export async function callAI(resumeText, customNotes, apiKey, userSelectedTheme, username, onProgress) {
  const truncatedText = resumeText;

  let themeContext = '';
  if (userSelectedTheme === 'Maximalism') themeContext = THEME_MAXIMALISM;
  else if (userSelectedTheme === 'Hand-Drawn') themeContext = THEME_HAND_DRAWN;
  else if (userSelectedTheme === 'Neo-Brutalism') themeContext = THEME_NEO_BRUTALISM;
  else if (userSelectedTheme === 'Bauhaus') themeContext = THEME_BAUHAUS;
  else if (userSelectedTheme === 'Linear / Modern') themeContext = THEME_LINEAR;
  else if (userSelectedTheme === 'Luxury / Editorial') themeContext = THEME_LUXURY;
  else if (userSelectedTheme === 'Swiss International') themeContext = THEME_SWISS;
  else if (userSelectedTheme === 'Vaporwave') themeContext = THEME_VAPORWAVE;
  else if (userSelectedTheme === 'Botanical') themeContext = THEME_BOTANICAL;
  else if (userSelectedTheme === 'Claymorphism') themeContext = THEME_CLAYMORPHISM;
  else if (userSelectedTheme === 'Playful Geometric') themeContext = THEME_GEOMETRIC;
  else if (userSelectedTheme === 'Academia') themeContext = THEME_ACADEMIA;
  else if (userSelectedTheme === 'Cyan Modern') themeContext = THEME_CYAN_MODERN;
  else if (userSelectedTheme === 'Vibrant Designer') themeContext = THEME_VIBRANT_DESIGNER;
  else if (userSelectedTheme === 'Neo Agency') themeContext = THEME_NEO_AGENCY;
  else if (userSelectedTheme === 'Retro Comic') themeContext = THEME_RETRO_COMIC;
  else themeContext = THEME_MAXIMALISM;

  const prompt = `
# THEME DIRECTION: ${userSelectedTheme}
You must strictly follow this design philosophy and token system for this generation:

${themeContext}

# INPUT DATA:
CV CONTENT: ${truncatedText}
USER NOTES: ${customNotes}

# USERNAME
${username || 'auto-generate'}

# FINAL CRITICAL REMINDER BEFORE YOU GENERATE:
I will check your output. If you summarize, shorten, or use dummy text (like "Detailed project implementation...") for ANY of my projects or experiences, YOU WILL FAIL.
You MUST extract the EXACT bullet points from my CV CONTENT above and write them into the code verbatim. Do not truncate anything!
`;

  try {
    return await tryWithFallback(prompt, apiKey, onProgress);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

async function tryWithFallback(prompt, apiKey, onProgress) {
  let lastError = null;

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const modelName = GEMINI_MODELS[i];
    try {
      if (onProgress) onProgress(i + 1, GEMINI_MODELS.length, 'Mengeksekusi Model: ' + modelName);
      console.log('Trying Gemini model [' + (i + 1) + '/' + GEMINI_MODELS.length + ']: ' + modelName);

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            role: "system",
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 15000,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "API Error");

      let text = data.candidates && data.candidates[0] && data.candidates[0].content ? data.candidates[0].content.parts[0].text : "";
      if (!text) throw new Error("Empty response from Gemini");

      console.log('[DEBUG] Raw Response (' + modelName + '):', text.slice(0, 200) + "...");

      text = text.trim();
      if (text.includes("```")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      }

      try {
        const parsed = JSON.parse(text);
        if (parsed.meta && parsed.componentCode) {
          console.log('Success with Gemini model: ' + modelName);
          return parsed;
        }
        throw new Error("Missing meta or componentCode string");
      } catch (parseError) {
        console.warn('Model ' + modelName + ' parsing failed: ' + parseError.message);
        lastError = parseError.message;
      }
    } catch (error) {
      console.warn('Model ' + modelName + ' failed: ' + error.message);
      lastError = error.message;
    }

    if (i < GEMINI_MODELS.length - 1) {
      if (onProgress) onProgress(i + 1, GEMINI_MODELS.length, 'Model ' + modelName + ' gagal. Menunggu jeda 30 detik...');
      console.log('Menunggu 30 detik sebelum mencoba model berikutnya...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  throw new Error('Semua model Gemini gagal. Terakhir: ' + lastError);
}
