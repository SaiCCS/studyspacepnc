import { getDatabase } from "@netlify/database";
import { getUser } from "@netlify/identity";

const json = (body, status = 200) => Response.json(body, { status });

function emptyState(user) {
  return {
    profile: { name: user.name || user.userMetadata?.full_name || user.email?.split("@")[0] || "", program: "" },
    subjects: [], tasks: [], sessions: [],
    settings: { focusDuration: 25, defaultPriority: "Medium", notifications: true, weeklyGoal: 12 },
  };
}

export default async (request) => {
  if (request.method !== "GET" && request.method !== "PUT") return new Response("Method not allowed", { status: 405 });
  try {
    const user = await getUser();
    if (!user?.id) return new Response("Unauthorized", { status: 401 });
    const db = getDatabase();
    if (request.method === "GET") {
      const [row] = await db.sql`SELECT data FROM study_data WHERE user_id = ${user.id}`;
      if (row) return json(row.data);
      const data = emptyState(user);
      await db.sql`INSERT INTO study_data (user_id, data) VALUES (${user.id}, ${JSON.stringify(data)}::jsonb) ON CONFLICT (user_id) DO NOTHING`;
      return json(data);
    }
    const raw = await request.text();
    if (raw.length > 1_000_000) return new Response("Study data is too large", { status: 413 });
    let data;
    try { data = JSON.parse(raw); } catch { return new Response("Invalid JSON", { status: 400 }); }
    if (!data || typeof data !== "object" || !data.profile || !Array.isArray(data.subjects) || !Array.isArray(data.tasks) || !Array.isArray(data.sessions) || !data.settings) {
      return new Response("Invalid study data", { status: 400 });
    }
    await db.sql`INSERT INTO study_data (user_id, data, updated_at) VALUES (${user.id}, ${JSON.stringify(data)}::jsonb, NOW()) ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`;
    return json({ saved: true });
  } catch (error) {
    console.error("Study data request failed", error);
    return json({ error: "Study data is temporarily unavailable." }, 500);
  }
};
