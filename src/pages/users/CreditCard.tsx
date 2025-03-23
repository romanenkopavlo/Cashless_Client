import {Card, CardContent, Typography} from "@mui/material";
import { styled } from "@mui/system";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {Link} from "react-router";

const CardContainer = styled(Card)({
    width: 340,
    height: 200,
    background: "linear-gradient(135deg, #6d4c41, #8d6e63)",
    color: "#fff",
    borderRadius: 16,
    padding: 16,
    position: "relative",
});

const Chip = styled("div")({
    width: 40,
    height: 30,
    background: "#d4af37",
    borderRadius: 6,
    position: "absolute",
    top: 16,
    left: 16,
});

const CardNumber = styled(Typography)({
    fontSize: 20,
    letterSpacing: 2,
    marginTop: 24,
    color: "#f5f5f5",
});

const CardBalance = styled(Typography)({
    fontSize: 20,
    marginTop: 12,
    color: "#f5f5f5",
    fontWeight: "bold",
});

const TransactionLink = styled(Link)({
    fontSize: 16,
    position: "absolute",
    textDecoration: "none",
    bottom: 16,
    right: 16,
    color: "#f5f5f5",
    "&:hover": {
        color: "#c79a2a",
    },
});

interface CardFestivalProps {
    number: number | null;
    balance: number | null;
    id: number
}

export const CardFestival = ({ number, balance, id }: CardFestivalProps) => {
    return (
        <CardContainer>
                <Chip />
            <CreditCardIcon style={{ position: "absolute", top: 16, right: 16, fontSize: 32 }} />
            <CardContent>
                <CardNumber>{number}</CardNumber>
                <CardBalance>Solde: {balance} €</CardBalance>
                <TransactionLink to="/transaction-history" state={{ cardId: id}}>
                        Voir Transactions
                </TransactionLink>
            </CardContent>
        </CardContainer>
    );
};