import { useSelector } from "react-redux";

export const getUserData =()=>{

    const userData = useSelector((state)=> state.user);

    return userData;
}