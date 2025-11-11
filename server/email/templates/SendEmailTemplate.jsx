import './send-email-template.css';
import { Html, Button, Section, Row, Column, Container, Img, Link, Text } from "@react-email/components";


const SendEmailTemplate = (props) => {
    const { url } = props;

    return (
        <Html lang="en">
            <Section className="my-[40px] px-[32px] py-[40px]">
                <Row>
                    <Column align="center">
                    <Img
                        alt="React Email logo"
                        height="42"
                        src="https://react.email/static/logo-without-background.png"
                    />
                    </Column>
                </Row>
                <Row className="mt-[40px]">
                    <Column align="center">
                    <table>
                        <tr>
                        <td className="px-[8px]">
                            <Link className="text-gray-600 [text-decoration:none]" href="#">
                            About
                            </Link>
                        </td>
                        <td className="px-[8px]">
                            <Link className="text-gray-600 [text-decoration:none]" href="#">
                            Blog
                            </Link>
                        </td>
                        <td className="px-[8px]">
                            <Link className="text-gray-600 [text-decoration:none]" href="#">
                            Company
                            </Link>
                        </td>
                        <td className="px-[8px]">
                            <Link className="text-gray-600 [text-decoration:none]" href="#">
                            Features
                            </Link>
                        </td>
                        </tr>
                    </table>
                    </Column>
                </Row>
            </Section>

            <Container className="bg-gray-400">
                <Text className="px-[12px] text-white">
                    Hello, I am a container. I keep content centered and maintain it to a
                    maximum width while still taking up as much space as possible!
                </Text>
            </Container>

            <Button href={url}>Click me</Button>
        </Html>
    )
}

export default SendEmailTemplate;
