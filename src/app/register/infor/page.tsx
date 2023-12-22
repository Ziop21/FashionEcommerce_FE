import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import RegisterForm from "./RegisterForm";

const Register = () => {
    return ( 
        <Container>
            <FormWrap>
                <RegisterForm/>
            </FormWrap>
        </Container>
     );
}
 
export default Register;