import React, {useEffect} from "react";
import {Alert, Container} from "@mui/material";

export const SuccessMessage = ({ successMessage, setSuccessMessage }: { successMessage: string | null,  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>}) => {
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [setSuccessMessage, successMessage]);

    return (
        <>
            {successMessage && (
                <Container maxWidth="xs" sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Alert severity="success">
                        {successMessage}
                    </Alert>
                </Container>
            )}
        </>
    )
}