import express, { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public"));
});

export default router;
