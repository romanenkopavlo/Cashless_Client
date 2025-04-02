import React, {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export const SnackbarSuccess = ({ successMessage, setSuccessMessage }: { successMessage: string | null, setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (successMessage) {
            setOpenSnackbar(true);
        }
    }, [successMessage]);

    const handleCloseSnackbar = () => {
        setSuccessMessage(null);
        setOpenSnackbar(false);
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ textAlign: 'center' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    )
}