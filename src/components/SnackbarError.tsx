import React, {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export const SnackbarError = ({ error, setError }: { error: string | null, setError: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (error) {
            setOpenSnackbar(true);
        }
    }, [error]);

    const handleCloseSnackbar = () => {
        setError(null);
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
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ textAlign: 'center' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    )
}