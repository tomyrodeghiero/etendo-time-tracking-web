export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();

  // Captura el email desde la query string
  const { email, providerUserId } = req.query;

  const jiraUrl = `${
    process.env.BACKEND_URL
  }/api/users?email=${encodeURIComponent(
    email
  )}&providerUserId=${encodeURIComponent(providerUserId)}`;

  try {
    const response = await fetch(jiraUrl);

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    res.status(200).json(data.issues);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Failed to fetch data");
  }
}
