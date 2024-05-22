import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render(
        "signup", { 
            title: "Signup",
            style: "../css/login.css",
        });
});

export default router;