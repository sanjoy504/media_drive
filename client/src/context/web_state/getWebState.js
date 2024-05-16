import { useSelector } from "react-redux";

export const getWebState =()=>{

    const webStateData = useSelector((state)=> state.webState);

    return webStateData;
}