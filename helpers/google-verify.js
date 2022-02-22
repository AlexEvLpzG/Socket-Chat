const { OAuth2Client } = require( 'google-auth-library' );

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const googleVerify = async( idToken = '' ) => {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });

  const { name: nombre, picture: img, email: correo } = ticket.getPayload();
  
  return { nombre, img, correo };
}

module.exports = { googleVerify };