// routes/favouritesRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/Authentication'); // JWT middleware

let favourites = []; // In-memory (or connect to DB in real apps)

router.get('/', authenticate, (req, res) => {
  res.json({ favourites });
});

router.post('/', authenticate, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const alreadyExists = favourites.find(fav => fav.title === title);
  if (!alreadyExists) favourites.push({ title });
  res.status(201).json({ message: "Added to favourites", favourites });
});

router.delete('/:title', authenticate, (req, res) => {
  const title = req.params.title;
  favourites = favourites.filter(fav => fav.title !== title);
  res.json({ message: "Removed from favourites", favourites });
});

module.exports = router;
