import { Container, Title, Group, Button, Space } from "@mantine/core"
import MetaMask from '../assets/metamask.svg'
import { useAuth } from "../context/Auth"

export const LoginPage = () => {
    const { dispatch } = useAuth()

    const handleLoginViaMetaMask = async () => {
        if(!window.ethereum) return

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

        if(accounts?.length){
            dispatch({ address: accounts[0], type: 'setAddress' })
        }
    }

    return (
        <Container>
            <Title>Login.</Title>

            <Space h="lg"/>

            <Group position="center">
                <Button onClick={handleLoginViaMetaMask}>
                    <img style={{ height: "25px", marginRight: "5px" }} src={MetaMask} alt="Metamask" />
                    Connect Via MetaMask
                </Button>
            </Group>
        </Container>
    )
}