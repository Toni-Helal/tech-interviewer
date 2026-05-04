#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import https from "https";

const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const INDEED_PUBLISHER_ID = process.env.INDEED_API_KEY;

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: { "User-Agent": "tech-interviewer-mcp/1.0", ...headers },
    };
    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data });
          }
        });
      })
      .on("error", reject);
  });
}

const server = new Server(
  { name: "linkedin-indeed", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_linkedin_profile",
      description:
        "Fetch a candidate's LinkedIn profile by URL or vanity name. Returns name, headline, experience, education, and skills to pre-populate interview data.",
      inputSchema: {
        type: "object",
        properties: {
          profile_url: {
            type: "string",
            description:
              "LinkedIn profile URL (e.g. https://linkedin.com/in/johndoe) or vanity name (e.g. johndoe)",
          },
        },
        required: ["profile_url"],
      },
    },
    {
      name: "search_linkedin_candidates",
      description:
        "Search LinkedIn for candidates matching keywords and optional location.",
      inputSchema: {
        type: "object",
        properties: {
          keywords: {
            type: "string",
            description: "Search keywords (e.g. 'React developer', 'full-stack engineer')",
          },
          location: {
            type: "string",
            description: "Location filter (e.g. 'Paris', 'Remote')",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (default: 10, max: 25)",
          },
        },
        required: ["keywords"],
      },
    },
    {
      name: "get_indeed_job",
      description:
        "Fetch a job description from Indeed by job URL or job key. Useful for loading the role requirements before an interview.",
      inputSchema: {
        type: "object",
        properties: {
          job_url: {
            type: "string",
            description:
              "Indeed job URL (e.g. https://www.indeed.com/viewjob?jk=abc123) or bare job key",
          },
        },
        required: ["job_url"],
      },
    },
    {
      name: "search_indeed_jobs",
      description:
        "Search Indeed for job listings matching a query and optional location.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Job search query (e.g. 'web developer', 'React engineer')",
          },
          location: {
            type: "string",
            description: "Location to search in (e.g. 'Paris, France', 'Remote')",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (default: 10, max: 25)",
          },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_linkedin_profile":
      return handleGetLinkedInProfile(args);
    case "search_linkedin_candidates":
      return handleSearchLinkedInCandidates(args);
    case "get_indeed_job":
      return handleGetIndeedJob(args);
    case "search_indeed_jobs":
      return handleSearchIndeedJobs(args);
    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

async function handleGetLinkedInProfile(args) {
  if (!LINKEDIN_ACCESS_TOKEN) {
    return errorResult(
      "LINKEDIN_ACCESS_TOKEN is not set. Set it via: export LINKEDIN_ACCESS_TOKEN=your_token"
    );
  }

  const vanityName = extractLinkedInVanityName(args.profile_url);
  const url =
    `https://api.linkedin.com/v2/people/(vanityName:${encodeURIComponent(vanityName)})` +
    `?projection=(id,firstName,lastName,headline,summary,positions,educations,skills)`;

  let result;
  try {
    result = await httpsGet(url, { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` });
  } catch (err) {
    return errorResult(`Network error fetching LinkedIn profile: ${err.message}`);
  }

  if (result.status !== 200) {
    return errorResult(
      `LinkedIn API error (HTTP ${result.status}): ${JSON.stringify(result.data)}`
    );
  }

  return { content: [{ type: "text", text: formatLinkedInProfile(result.data) }] };
}

async function handleSearchLinkedInCandidates(args) {
  if (!LINKEDIN_ACCESS_TOKEN) {
    return errorResult(
      "LINKEDIN_ACCESS_TOKEN is not set. Set it via: export LINKEDIN_ACCESS_TOKEN=your_token"
    );
  }

  const limit = Math.min(args.limit || 10, 25);
  const params = new URLSearchParams({
    q: "people",
    keywords: args.keywords,
    count: String(limit),
  });
  if (args.location) params.set("location", args.location);

  let result;
  try {
    result = await httpsGet(
      `https://api.linkedin.com/v2/search?${params}`,
      { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` }
    );
  } catch (err) {
    return errorResult(`Network error searching LinkedIn: ${err.message}`);
  }

  if (result.status !== 200) {
    return errorResult(
      `LinkedIn API error (HTTP ${result.status}): ${JSON.stringify(result.data)}`
    );
  }

  return { content: [{ type: "text", text: formatLinkedInSearchResults(result.data) }] };
}

async function handleGetIndeedJob(args) {
  if (!INDEED_PUBLISHER_ID) {
    return errorResult(
      "INDEED_API_KEY is not set. Set it via: export INDEED_API_KEY=your_publisher_id"
    );
  }

  const jobKey = extractIndeedJobKey(args.job_url);
  const params = new URLSearchParams({
    publisher: INDEED_PUBLISHER_ID,
    jobkeys: jobKey,
    format: "json",
    v: "2",
  });

  let result;
  try {
    result = await httpsGet(`https://api.indeed.com/ads/apisearch?${params}`);
  } catch (err) {
    return errorResult(`Network error fetching Indeed job: ${err.message}`);
  }

  if (result.status !== 200) {
    return errorResult(
      `Indeed API error (HTTP ${result.status}): ${JSON.stringify(result.data)}`
    );
  }

  return { content: [{ type: "text", text: formatIndeedJob(result.data) }] };
}

async function handleSearchIndeedJobs(args) {
  if (!INDEED_PUBLISHER_ID) {
    return errorResult(
      "INDEED_API_KEY is not set. Set it via: export INDEED_API_KEY=your_publisher_id"
    );
  }

  const limit = Math.min(args.limit || 10, 25);
  const params = new URLSearchParams({
    publisher: INDEED_PUBLISHER_ID,
    q: args.query,
    format: "json",
    v: "2",
    limit: String(limit),
  });
  if (args.location) params.set("l", args.location);

  let result;
  try {
    result = await httpsGet(`https://api.indeed.com/ads/apisearch?${params}`);
  } catch (err) {
    return errorResult(`Network error searching Indeed: ${err.message}`);
  }

  if (result.status !== 200) {
    return errorResult(
      `Indeed API error (HTTP ${result.status}): ${JSON.stringify(result.data)}`
    );
  }

  return { content: [{ type: "text", text: formatIndeedSearchResults(result.data) }] };
}

// --- Helpers ---

function extractLinkedInVanityName(input) {
  const match = input.match(/linkedin\.com\/in\/([^/?#]+)/);
  return match ? match[1] : input.replace(/\/$/, "");
}

function extractIndeedJobKey(input) {
  const match = input.match(/[?&]jk=([^&]+)/);
  return match ? match[1] : input;
}

function localizedValue(field) {
  if (!field?.localized) return "";
  return Object.values(field.localized)[0] || "";
}

function formatLinkedInProfile(profile) {
  const firstName = localizedValue(profile.firstName);
  const lastName = localizedValue(profile.lastName);
  const headline = localizedValue(profile.headline);
  const summary = localizedValue(profile.summary);

  let out = `# LinkedIn Profile: ${firstName} ${lastName}\n\n`;
  if (headline) out += `**Headline**: ${headline}\n`;
  if (summary) out += `\n**Summary**:\n${summary}\n`;

  const positions = profile.positions?.values || [];
  if (positions.length) {
    out += `\n**Experience**:\n`;
    for (const pos of positions.slice(0, 5)) {
      const company = pos.company?.name || "Unknown";
      const start = pos.startDate?.year || "";
      const end = pos.isCurrent ? "Present" : (pos.endDate?.year || "");
      const period = start ? ` (${start}${end ? `–${end}` : ""})` : "";
      out += `- ${pos.title || "Role"} @ ${company}${period}\n`;
    }
  }

  const educations = profile.educations?.values || [];
  if (educations.length) {
    out += `\n**Education**:\n`;
    for (const edu of educations.slice(0, 3)) {
      const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      out += `- ${edu.schoolName || "School"}${degree ? `, ${degree}` : ""}\n`;
    }
  }

  const skills = (profile.skills?.values || [])
    .slice(0, 12)
    .map((s) => s.skill?.name)
    .filter(Boolean);
  if (skills.length) out += `\n**Skills**: ${skills.join(", ")}\n`;

  return out;
}

function formatLinkedInSearchResults(data) {
  const elements = data.elements || [];
  if (!elements.length) return "No candidates found matching your search.";

  const total = data.paging?.total ?? elements.length;
  let out = `# LinkedIn Candidate Search\n\nFound ${total} result(s) (showing ${elements.length}):\n\n`;

  for (const el of elements) {
    const mini =
      el.hitInfo?.["com.linkedin.voyager.search.SearchProfile"]?.miniProfile;
    if (mini) {
      const name = `${mini.firstName} ${mini.lastName}`;
      const headline = mini.occupation || "";
      out += `- **${name}**${headline ? ` — ${headline}` : ""}\n`;
      if (mini.publicIdentifier) {
        out += `  https://www.linkedin.com/in/${mini.publicIdentifier}\n`;
      }
    }
  }

  return out;
}

function formatIndeedJob(data) {
  const results = data.results || [];
  if (!results.length) return "Job not found on Indeed.";

  const job = results[0];
  let out = `# Job: ${job.jobtitle}\n\n`;
  out += `**Company**: ${job.company}\n`;
  out += `**Location**: ${job.formattedLocation || job.city}\n`;
  out += `**Posted**: ${job.date}\n`;
  if (job.salary) out += `**Salary**: ${job.salary}\n`;
  out += `**URL**: ${job.url}\n`;
  if (job.snippet) out += `\n**Description**:\n${job.snippet}\n`;

  return out;
}

function formatIndeedSearchResults(data) {
  const results = data.results || [];
  if (!results.length) return "No jobs found matching your search on Indeed.";

  const total = data.totalResults ?? results.length;
  let out = `# Indeed Job Search\n\nFound ${total} result(s) (showing ${results.length}):\n\n`;

  for (const job of results) {
    out += `## ${job.jobtitle} — ${job.company}\n`;
    out += `**Location**: ${job.formattedLocation || job.city}\n`;
    out += `**Posted**: ${job.date}\n`;
    if (job.salary) out += `**Salary**: ${job.salary}\n`;
    out += `**URL**: ${job.url}\n`;
    if (job.snippet) out += `\n${job.snippet}\n`;
    out += "\n";
  }

  return out;
}

function errorResult(message) {
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

// ---

const transport = new StdioServerTransport();
await server.connect(transport);
