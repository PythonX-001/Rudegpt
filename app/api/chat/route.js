export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Sending to Python API:", body)

    // Try to connect to Python Flask API
    const response = await fetch("https://rudegptapi.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("Python API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Python API error:", errorText)
      throw new Error(`Flask API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Python API response data:", data)
    return Response.json(data)
  } catch (error) {
    console.error("Error connecting to Python API:", error.message)

    // Check if it's a connection error
    if (error.code === "ECONNREFUSED" || error.message.includes("fetch")) {
      return Response.json({
        response:
          "My Python brain is offline! Make sure the Flask server is running on localhost:5000. Error: " +
          error.message,
        rageIncrease: 15,
        newMood: "Mood: Error 404: Python Not Found",
        action: null,
      })
    }

    // Fallback response for other errors
    return Response.json({
      response: "Ugh, my Python brain is having a moment. Try again, or don't. I don't care. Error: " + error.message,
      rageIncrease: 15,
      newMood: "Mood: Error 404: Patience Not Found",
      action: null,
    })
  }
}
