import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { RegisterComponents } from "./comp/RegisterPage";

export default function RegisterComponent(){
    return(
        <>
            
            <Header />
                <RegisterComponents />
            <Footer />
        </>
    )
}