import NewPasswordPageComponent from "./comp/NewPasswordComponent";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Suspense } from "react";

export default function NewPassword(){
    return(
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Header />
                <NewPasswordPageComponent />
                <Footer />
            </Suspense>
        </>
    )
}