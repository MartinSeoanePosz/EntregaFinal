import express from 'express';
import { addLogger } from "../middleware/index.js";


const router = express.Router();

router.get('/', (req, res) => {
    req.logger.debug("Debug message");
    req.logger.http("HTTP message");
    req.logger.info("Info message");
    req.logger.warn("Warning message");
    req.logger.error("Error message");
    req.logger.fatal("Fatal message");
    res.send("Logger test");
});

export default router;