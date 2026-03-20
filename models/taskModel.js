import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    task: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export const Tasks = mongoose.model('Tasks', taskSchema);