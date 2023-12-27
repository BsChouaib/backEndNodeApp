const router  = require("express").Router();
const Recipe = require('../model/recipes');
const {check_security, getUserid}  = require('./verifyToken');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Recipe
router.post('/recipes', check_security, upload.single('img'), async (req, res) => {
    try {
        const user_id = getUserid(req.headers['authorization']);
        const { title, ingredients, instructions, tempsPreparation, tempsCuisson, difficulte } = req.body;
        const image = 0;
        const recipe = new Recipe({ title,     
                                    ingredients, 
                                    instructions, 
                                    tempsPreparation, 
                                    tempsCuisson, 
                                    difficulte, 
                                    user_id, 
                                    image:
                                    {
                                        data: Buffer, 
                                        contentType: String, 
                                    } });
        await recipe.save();
        return res.status(201).json({ 
            message: 'Recipe created', 
            data: recipe
          })
    } catch (error) {
        return res.status(400).json({ 
            message: 'error', 
            error: error.message
          })
    }
});

// get all recipes
router.get('/recipes', check_security, async (req, res) => {
    try {
        const recipes = await Recipe.find({},{__v: 0});
        return res.status(200).json({ 
            message: 'success', 
            data: recipes
          })
        res.json(recipes);
    } catch (error) {
        return res.status(400).json({ 
            message: 'error', 
            error: error.message
          })
    }
});
// get recipes by id
router.get('/recipes', check_security, async (req, res) => {
    try {
        const recipes = await Recipe.findById(req.body.id);
        return res.status(200).json({ 
            message: 'success', 
            data: recipes
          })
        res.json(recipes);
    } catch (error) {
        return res.status(400).json({ 
            message: 'error', 
            error: error.message
          })
    }
});

// comment recipe
router.post('/recipes/comment', check_security, async (req, res) => {
    try {
        const recipeId = req.body.recipes_id;
        const text = req.body.text;
        const user_id = getUserid(req.headers['authorization']);
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ error: 'Recette non trouvée' });
        }

        recipe.comments.push({ text, user_id });
        await recipe.save();

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;