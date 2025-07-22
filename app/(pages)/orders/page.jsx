import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { OrdersComponent } from "../../components/Orders/OrdersPage";



export default function OrdersPage(){
    return(
        <>
            <Header />
            <OrdersComponent />
            <Footer />
        </>
    )
}