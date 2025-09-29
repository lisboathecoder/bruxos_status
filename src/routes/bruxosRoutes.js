import express from "express"
import { createBruxos, deleteBruxo, getAllbruxos, getBruxosById, updateBruxo } from "../controllers/bruxosController.js"

const router = express.Router();

router.get("/", getAllbruxos);
router.get("/:id", getBruxosById);
router.post("/", createBruxos);
router.delete("/:id", deleteBruxo);
router.put("/:id", updateBruxo);

export default router;