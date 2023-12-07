const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://krishkanojia98:krish123@cluster0.dog4mvt.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const Book = mongoose.model('Book', {
  title: String,
  author: String,
  published_date: String,
  id:String
});

app.use(bodyParser.json());

// Endpoint 1: get=>fetching book details 
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 2: node for adding new book 
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, published_date,id } = req.body;
    const newBook = new Book({ title, author, published_date,id});
    await newBook.save();
    res.status(201).json({ message: 'book has been added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 3: put used for updating book details 
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, published_date , id} = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      {id},
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json({message: 'book has been updated'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
