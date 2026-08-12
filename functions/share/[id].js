export async function onRequest(context) {
  const { request, params, env } = context;
  const id = params.id; // e.g. card_uniqueId_timestamp

  // Retrieve Supabase project details from environment or default
  const supabaseUrl = env.PUBLIC_SUPABASE_URL || "https://kpxguxfylqszqsznqmqq.supabase.co"; // Fallback to workspace default if not bound
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/generated-images/${id}.png`;

  // Fetch the static build template index.html
  const url = new URL(request.url);
  const templateResponse = await env.ASSETS.fetch(new URL("/", url.origin));
  let html = await templateResponse.text();

  // Construct dynamic Open Graph metadata tags
  const ogTags = `
    <title>My Hacker House Goa 2026 Builder Card</title>
    <meta property="og:title" content="My Hacker House Goa 2026 Builder Card" />
    <meta property="og:description" content="Build • Ship • Repeat // Claim your verified status" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${url.href}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="My Hacker House Goa 2026 Builder Card" />
    <meta name="twitter:description" content="Build • Ship • Repeat // Claim your verified status" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  // Inject meta tags into the template header
  html = html.replace("</head>", `${ogTags}</head>`);

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  });
}
