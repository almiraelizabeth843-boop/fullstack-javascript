import express from "express";

const router = express.Router()

router.get("/products", () => {
    console.log("Retrieving products...")
});

export default router;