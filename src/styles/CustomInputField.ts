const baseStyle = {
    '& label.Mui-focused': { color: '#2C2C2C' },
    '& .MuiInput-underline:after': { borderBottomColor: '#7f5656' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#7f5656' },
        '&:hover fieldset': { borderColor: '#7f5656' },
        '&.Mui-focused fieldset': { borderColor: '#7f5656' },
    }
};

export const styleCustomRole = {
    ...baseStyle,
    ml: 2,
    minWidth: 120
};

export const styleCustomInput = {
    ...baseStyle
};