import { Backdrop, CircularProgress } from "@mui/material";
import { getWebState } from "../context/web_state/getWebState";

export default function Backdrops() {

    const { isBackdropOpen } = getWebState();
  return (
    <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isBackdropOpen || false }
>
    <CircularProgress color="inherit" />
</Backdrop>
  )
};
