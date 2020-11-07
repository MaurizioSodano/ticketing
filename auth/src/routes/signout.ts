import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    console.log("removing auth cookie")
    req.session = null; // destroying the session to remove the cookie
    res.send({});
});

export { router as signoutRouter };