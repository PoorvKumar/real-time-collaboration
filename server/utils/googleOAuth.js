const { OAuth2Client } = require("google-auth-library");
const axios=require("axios");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const getProfileInfo = async (code) => {
    
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI; 

  try {
    const encodedCredentials = Buffer.from(`${googleClientId}:${googleClientSecret}`).toString('base64');
    const authorizationHeader = `Basic ${encodedCredentials}`;
    
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      grant_type: 'authorization_code',
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: redirectUri,
      code
    }, {
      headers: {
        Authorization: authorizationHeader
      }
    });

    if (response.status === 200) {
        const accessToken = response.data.access_token;
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
  
        return profileResponse.data; // User profile information
      } else {
        console.error('Error:', response.status, response.data);
        // Handle error appropriately (e.g., return specific error message or status code)
      }

  } 
  catch(error) 
  {
    console.error("Error:", error.message);
    throw new Error("Failed to retrieve profile information from Google",error);
  }
};

module.exports = {
  getProfileInfo,
};
