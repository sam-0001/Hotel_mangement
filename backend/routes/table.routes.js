import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addTable, editTable, deleteTable, getShopTables, updateTableStatus } from "../controllers/table.controllers.js";

const tableRouter = express.Router();

tableRouter.post("/add", isAuth, addTable);
tableRouter.put("/edit/:tableId", isAuth, editTable);
tableRouter.delete("/delete/:tableId", isAuth, deleteTable);
tableRouter.get("/shop/:shopId", getShopTables);
tableRouter.patch("/status/:tableId", isAuth, updateTableStatus);

export default tableRouter;
