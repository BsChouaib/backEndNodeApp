const mongoose = require('mongoose');

const recipesSchema = new  mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            min : 6, 
            max : 255
        },
        ingredients:[{
            type: String,
            required: true,
        }],
        instructions:[{
            type: String,
            required: true,
        }],
        tempsPreparation:{
            type: Number, 
            required: true
        }
        ,
        tempsCuisson:{
            type: Number, 
            required: true
        },
        difficulte:{
            type: Number, 
            required: true
        },
        comments: [
            { 
                text: String, 
                user_id: String 
            }
        ],
        creation_date:{
            type: Date,
            default : Date.now
        },
        user_id:
        {
            type: String,
            required: true,
        },
        image: 
        {
            data: Buffer, 
            contentType: String,
        }
    }
);
module.exports = mongoose.model( 'Recipes', recipesSchema );