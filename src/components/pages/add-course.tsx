import { Typography, Box, Button } from "@mui/material";
import { FC, useContext } from "react";
import CoursesContext from "../../store/context";
const AddCourse: FC = () => {
    const storeValue = useContext(CoursesContext);
    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <Typography variant='h2'>Add Course works {storeValue.count} </Typography>
        <Button onClick={storeValue.increase}>Add Count</Button>

    </Box>
}
export default AddCourse;