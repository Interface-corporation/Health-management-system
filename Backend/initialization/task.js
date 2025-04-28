
import { DataTypes } from "sequelize";
import sequelize from "../models/index.js";

const Tasks = sequelize.define('Tasks',{
    title:DataTypes.STRING,
    description:DataTypes.STRING,
    status:DataTypes.STRING,
    priority:DataTypes.STRING,
    assigne:DataTypes.STRING,
    due_date:DataTypes.STRING,
    progress: DataTypes.STRING,
    comment:DataTypes.STRING


})

export default Tasks;