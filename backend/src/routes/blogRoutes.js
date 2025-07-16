// routes/blogRoutes.js
import express from "express"
import { createBlogPost, updateBlogPost, deleteBlogPost } from "../controllers/blogController.js"

const router = express.Router()

router.post("/create", createBlogPost)
router.put("/update/:id", updateBlogPost)
router.delete("/delete/:id", deleteBlogPost)

export default router
