
const baseUrl = 'https://api.sportmonks.com/v3/football/fixtures'


export default async function(req, res) {
    // only allow GET requests
    if (req.method !== 'GET'){
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {

        // my API token from sportsmonks
        const apiToken = process.env.SPORTMONKS_API_TOKEN;

        // if there is no api token, throw error
        if (!apiToken) {
            return res.status(500).json({ message: 'API token not configured' });
        }

        // build the API url
        const apiUrl = `${baseUrl}/19146705/?api_token=${apiToken}&include=statistics.type;events.type`;

        // make the API call
        const response = await fetch(apiUrl);

        // check if response is unsuccessful
        if (!response.ok){
            throw new Error(`SportMonks API error: ${response.status}`);
        }

        // create variable for the data
        const data = await response.json();

        // return the data
        res.status(200).json(data)
    }

    catch (error) {
        console.error('Error fetching fixture:', error);
        res.status(500).json({ message: 'Failed to fetch fixture data' });
    }
}