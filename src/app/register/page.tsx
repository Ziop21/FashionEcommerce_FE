import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import EmailInputForm from "./EmailInputForm";

const Register = () => {
    return ( 
        <Container>
            <FormWrap>
                <EmailInputForm/>
            </FormWrap>
        </Container>
     );
}
 
export default Register;