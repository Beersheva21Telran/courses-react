import { Typography, Box, Button } from "@mui/material";
import { FC, useContext } from "react";
import CoursesContext from "../../store/context";
const Courses: FC = () => {
    const storeValue = useContext(CoursesContext);
    return <Box>
        <Typography>Courses works {storeValue.count}</Typography>
        <Button onClick={() => !!storeValue.decrease && storeValue.decrease()}>Decrease count</Button>
    </Box>
}
export default Courses;