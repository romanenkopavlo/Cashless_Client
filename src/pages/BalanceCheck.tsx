import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import {Box, Container, Typography} from "@mui/material";

export const BalanceCheck = () => {
    const {accessToken} = useAuthenticationJWTStore()
    console.log(accessToken?.token)

    return (
        <>
            <Container maxWidth="xs" sx={{mt: 3}}>
                <Box
                    sx = {
                        {
                            p: 4,
                            boxShadow: 16,
                            borderRadius: 2,
                            bgcolor: "background.paper"
                        }
                    }>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                    </Typography>
                </Box>
            </Container>
            <Container maxWidth="xs" sx={{mt: 3}}>
                <Box
                    sx = {
                        {
                            p: 4,
                            boxShadow: 16,
                            borderRadius: 2,
                            bgcolor: "background.paper"
                        }
                    }>
                </Box>
            </Container>
        </>
    )
}