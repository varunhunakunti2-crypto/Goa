export const TITLE_CATEGORIES = {
  developer: [
    "Code Surfer",
    "Bug Hunter",
    "Stack Samurai",
    "Pixel Coder",
    "API Alchemist",
    "Cloud Nomad"
  ],
  designer: [
    "Pixel Alchemist",
    "UI Wizard",
    "Visual Architect",
    "Design Surfer",
    "Interface Artist"
  ],
  ai: [
    "Model Whisperer",
    "Prompt Architect",
    "AI Explorer",
    "Neural Builder"
  ],
  cybersecurity: [
    "Security Ninja",
    "Threat Hunter",
    "Cyber Guardian",
    "Packet Warrior"
  ],
  generic: [
    "Code Surfer",
    "Digital Nomad",
    "Build Wizard",
    "Tech Explorer",
    "Pixel Pioneer",
    "Startup Hacker"
  ]
};

export function getFunTitle(role, reroll = false) {
  const normalized = (role || "").toLowerCase().trim();
  let category = "generic";
  
  if (
    normalized.includes("front") || 
    normalized.includes("back") || 
    normalized.includes("dev") || 
    normalized.includes("engineer") || 
    normalized.includes("full") || 
    normalized.includes("smart") || 
    normalized.includes("contract") || 
    normalized.includes("solidity")
  ) {
    category = "developer";
  }
  if (
    normalized.includes("design") || 
    normalized.includes("figma") || 
    normalized.includes("ui") || 
    normalized.includes("ux") || 
    normalized.includes("artist")
  ) {
    category = "designer";
  }
  if (
    normalized.includes("ai") || 
    normalized.includes("model") || 
    normalized.includes("prompt") || 
    normalized.includes("neural") || 
    normalized.includes("ml")
  ) {
    category = "ai";
  }
  if (
    normalized.includes("security") || 
    normalized.includes("cyber") || 
    normalized.includes("ninja") || 
    normalized.includes("guard")
  ) {
    category = "cybersecurity";
  }

  const list = TITLE_CATEGORIES[category] || TITLE_CATEGORIES.generic;
  
  if (reroll) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  } else {
    // Deterministic selection based on string hash
    const hash = Array.from(role || "Goa").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return list[hash % list.length];
  }
}
