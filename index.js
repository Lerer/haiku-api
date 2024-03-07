const PORT = process.env.PORT || 8000;
const express = require('express');

const app = express();

const { OpenAI } = require('openai');
require('dotenv').config();

app.get('/', (req, res) => res.json('Welcome to my Haiku API'));

app.get('/haiku', async (req, res) => {
  const authHeaders = req.headers;

  if (authHeaders.secretKey !== 'super-secret-key') {
    res
      .status(401)
      .json({ message: 'You are not authorized to make this request.' });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'Write a haiku.' }],
      model: 'gpt-3.5-turbo-0125',
    });
    console.log(completion.choices[0].message.content);
    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
