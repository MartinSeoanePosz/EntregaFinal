import userController from "../controllers/userController.js";

const setLastConnection = async (req, res, next) => {
    try{
        const email = req.session.user;
        await userController.setLastConnection(email);
            next();
        } catch (error){
            console.error("Error setting last connection:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
}

export default setLastConnection;