import { Typography } from "@mui/material";
import React, { FC, useContext } from "react";
import CoursesContext from "../../store/context";
const StatisticsCost: FC = () => {
    const storeValue = useContext(CoursesContext);
    return <Typography>Cost Statisics works: number of digits in counter is {Math.abs(storeValue.count).toString().length}</Typography>
}
export default StatisticsCost;