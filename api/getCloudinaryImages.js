import axios from 'axios';

export default async function handler(req, res) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } = process.env;
  const base64Auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');

  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        params: { prefix: CLOUDINARY_FOLDER, max_results: 100 },
        headers: {
          Authorization: `Basic ${base64Auth}`,
        },
      }
    );

    // Validate and send only resources if response structure is correct
    if (response.data && response.data.resources) {
      res.status(200).json(response.data.resources);
    } else {
      res.status(500).json({ error: 'Unexpected response format from Cloudinary' });
    }
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    res.status(500).json({ error: 'Failed to fetch images from Cloudinary' });
  }
}
