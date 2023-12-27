const Recipe = require('../model/recipes');
const multer = require('multer');
// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dossier de stockage
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
});
// module.exports multer({ storage: storage });

// Endpoint to add a product with a photo in JSON body request
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const photoData = req.file.buffer.toString('base64');

        const newProduct = new Product({
            name: name,
            description: description,
            photo: {
                data: Buffer.from(photoData, 'base64'),
                contentType: req.file.mimetype,
            },
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

