import './send-email-template.css';
import { Html, Button } from "@react-email/components";


const SendEmailTemplate = (props) => {
    const { url } = props;

    return (
        <Html lang="en">
            <Button href={url}>Click me</Button>
        </Html>
    )
}

export default SendEmailTemplate;
