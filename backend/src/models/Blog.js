import mongoose from "mongoose"

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String, // Dùng string cho tên tác giả (không dùng ObjectId)
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true, // tự thêm createdAt và updatedAt
    },
)

const Blog = mongoose.model("Blog", blogSchema)

export default Blog
