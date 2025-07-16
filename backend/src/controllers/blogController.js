import Blog from "../models/Blog.js"

export async function createBlogPost(req, res) {
    try {
        const { title, content, author, tags } = req.body

        // Kiểm tra các trường bắt buộc
        if (!title || !content || !author) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        // Tạo bài viết mới
        const newPost = new Blog({
            title,
            content,
            author,
            tags: tags || [],
        })

        const savedPost = await newPost.save()

        return res.status(201).json({
            message: "Blog post created successfully",
            blog: savedPost,
        })
    } catch (error) {
        console.error("Error creating blog post:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
// PATCH /blogs/:id
export async function updateBlogPost(req, res) {
    try {
        const { id } = req.params
        const { title, content, author, tags } = req.body

        // Tìm và cập nhật bài viết
        const updatedPost = await Blog.findByIdAndUpdate(
            id,
            { title, content, author, tags },
            { new: true, runValidators: true }
        )

        if (!updatedPost) {
            return res.status(404).json({ message: "Blog post not found" })
        }

        return res.status(200).json({
            message: "Blog post updated successfully",
            blog: updatedPost,
        })
    } catch (error) {
        console.error("Error updating blog post:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
// DELETE /blogs/:id
export async function deleteBlogPost(req, res) {
    try {
        const { id } = req.params

        const deletedPost = await Blog.findByIdAndDelete(id)

        if (!deletedPost) {
            return res.status(404).json({ message: "Blog post not found" })
        }

        return res.status(200).json({
            message: "Blog post deleted successfully",
            blog: deletedPost,
        })
    } catch (error) {
        console.error("Error deleting blog post:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
