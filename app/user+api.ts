import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    console.log("📩 Received a POST request to /api/user"); // Debugging

    // Initialize Neon database connection
    const sql = neon(process.env.DATABASE_URL as string);

    // Parse request body
    const { name, email } = await request.json();

    console.log("🔍 Received data:", { name, email }); // Debugging

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Insert into database (correct syntax)
    const response = await sql`
      INSERT INTO users (name, email) 
      VALUES (${name}, ${email})
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response }), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
