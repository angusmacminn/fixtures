// Next.js API route handler
export default async function handler(req, res) {
  // Set up headers for the football API
  const myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "672bcb798c1a506431bdf4da3b62cf9d");
  myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Make the API call
    const response = await fetch("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2023&dates=true", requestOptions);
    const result = await response.json(); // Parse as JSON instead of text
    
    // Log to server console (you'll see this in your terminal)
    console.log('API Response:', result);
    
    // Send response back to client
    res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Send error response
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
