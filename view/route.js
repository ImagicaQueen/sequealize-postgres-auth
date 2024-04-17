import express from "express";
import {
  addEmp,
  deleteEmp,
  getAllEmp,
  getById,
  updateEmp,
  userLogin,
  userRegister,
  updatePassword,
  updateProfile,
} from "../controller/userController.js";

const router = express.Router();

router.get("/getAll", getAllEmp);
router.post("/addEmp", addEmp);
router.get("/getById/:id", getById);
router.put("/updateEmp/:id", updateEmp);
router.delete("/deleteEmp/:id", deleteEmp);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/updatePassword/:id", updatePassword);
router.put("/updateProfile/:id", updateProfile);

export default router;
