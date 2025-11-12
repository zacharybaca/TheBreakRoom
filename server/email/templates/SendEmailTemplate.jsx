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
                <Row>
                    <Column align="center">
                        <Img
                        src="https://github.com/luxonauta.png?size=100"
                        alt="Lucas de França"
                        width="30"
                        height="30"
                        className="inline-block w-[30px] h-[30px] rounded-full"
                        />
                    </Column>
                    <Column align="center">
                        <Img
                        src="https://github.com/luxonauta.png?size=100"
                        alt="Lucas de França"
                        width="42"
                        height="42"
                        className="inline-block w-[42px] h-[42px] rounded-full"
                        />
                    </Column>
                    <Column align="center">
                        <Img
                        src="https://github.com/luxonauta.png?size=100"
                        alt="Lucas de França"
                        width="54"
                        height="54"
                        className="inline-block w-[54px] h-[54px] rounded-full"
                        />
                    </Column>
                    <Column align="center">
                        <Img
                        src="https://github.com/luxonauta.png?size=100"
                        alt="Lucas de França"
                        width="66"
                        height="66"
                        className="inline-block w-[66px] h-[66px] rounded-full"
                        />
                    </Column>
                </Row>
                
                <Text className="px-[12px] text-white">
                    Hello, I am a container. I keep content centered and maintain it to a
                    maximum width while still taking up as much space as possible!
                </Text>
            </Container>

            <Button href={url}>Click me</Button>

            <Section className="text-center">
                <table className="w-full">
                    <tr className="w-full">
                    <td align="center">
                        <Img
                        alt="React Email logo"
                        height="42"
                        src="https://react.email/static/logo-without-background.png"
                        />
                    </td>
                    </tr>
                    <tr className="w-full">
                    <td align="center">
                        <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                        Acme corporation
                        </Text>
                        <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
                        Think different
                        </Text>
                    </td>
                    </tr>
                    <tr>
                    <td align="center">
                        <Row className="table-cell h-[44px] w-[56px] align-bottom">
                        <Column className="pr-[8px]">
                            <Link href="#">
                            <Img
                                alt="Facebook"
                                height="36"
                                src="https://react.email/static/facebook-logo.png"
                                width="36"
                            />
                            </Link>
                        </Column>
                        <Column className="pr-[8px]">
                            <Link href="#">
                            <Img alt="X" height="36" src="https://react.email/static/x-logo.png" width="36" />
                            </Link>
                        </Column>
                        <Column>
                            <Link href="#">
                            <Img
                                alt="Instagram"
                                height="36"
                                src="https://react.email/static/instagram-logo.png"
                                width="36"
                            />
                            </Link>
                        </Column>
                        </Row>
                    </td>
                    </tr>
                    <tr>
                    <td align="center">
                        <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
                        123 Main Street Anytown, CA 12345
                        </Text>
                        <Text className="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]">
                        mail@example.com +123456789
                        </Text>
                    </td>
                    </tr>
                </table>
            </Section>
        </Html>
    )
}

export default SendEmailTemplate;
