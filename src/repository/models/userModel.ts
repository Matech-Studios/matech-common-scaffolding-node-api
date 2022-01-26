import { Schema, model } from 'mongoose';
import UserEntity from '../../core/entities/userEntity';

const userSchema = new Schema<UserEntity>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: false
    }
});

export default model('User', userSchema);