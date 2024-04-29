import { Schema, model, models } from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {
        type: String, 
        required: true, 
        validate: pass => {
            if (!pass?.length || pass.length < 5) {
                new Error('Password must be at least 5 characters')
            }
        },
    },
    image: {type: String},
}, {timestamps: true});

UserSchema.post('validate', (user) => {
    const notHashPassword = user.password;
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(notHashPassword, salt);
})

export const User = models?.User || model('User', UserSchema);