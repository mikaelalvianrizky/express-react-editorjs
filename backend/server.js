// Import required modules
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Initialize the Express app
const app = express();

// Middleware for security
app.use(helmet());

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize('codeDB', 'myuser', 'mypassword', {
    host: 'localhost',
    dialect: 'postgres',
});

// Initialize DOMPurify with jsdom
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Define the Code model
const Code = sequelize.define('Code', {
    html: { type: DataTypes.TEXT, allowNull: true }, // Editor.js content might not have HTML/CSS/JS
    css: { type: DataTypes.TEXT, allowNull: true },
    js: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.JSONB, allowNull: true }, // To store Editor.js JSON output
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

// Sync the model with the database
sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch((err) => console.error('Error creating database tables:', err));

// Route to save code to the database (HTML, CSS, JS)
app.post('/save-code', async (req, res) => {
    try {
        const { html, css, js } = req.body;

        // Sanitize input using DOMPurify
        const sanitizedHtml = DOMPurify.sanitize(html);
        const sanitizedCss = DOMPurify.sanitize(css);
        const sanitizedJs = DOMPurify.sanitize(js);

        const code = await Code.create({ html: sanitizedHtml, css: sanitizedCss, js: sanitizedJs });
        res.status(201).json({ id: code.id, message: 'Code saved successfully!' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to save Editor.js content to the database
app.post('/save-editor-content', async (req, res) => {
    try {
        const { content } = req.body;

        // Save the Editor.js JSON output directly to the database
        const savedContent = await Code.create({ content });
        res.status(201).json({ id: savedContent.id, message: 'Content saved successfully!' });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to retrieve all code entries from the database
app.get('/get-codes', async (req, res) => {
    try {
        const codes = await Code.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(codes);
    } catch (error) {
        console.error('Error retrieving codes:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to retrieve code from the database by ID
app.get('/get-code/:id', async (req, res) => {
    try {
        const code = await Code.findByPk(req.params.id);
        if (!code) {
            return res.status(404).json({ message: 'Code not found' });
        }
        res.status(200).json(code);
    } catch (error) {
        console.error('Error retrieving code:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to retrieve Editor.js content by ID
app.get('/get-content/:id', async (req, res) => {
    try {
        const content = await Code.findByPk(req.params.id, {
            attributes: ['content'], // Only select the content field
        });
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
    } catch (error) {
        console.error('Error retrieving content:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
