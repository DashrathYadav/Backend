const cloudinary = require("cloudinary").v2;

function genSignature(userId) {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.API_SECRETE
  );

  return { signature, timestamp };
}

module.exports = genSignature;
