import { createTheme } from "@mui/material";

const customeTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F0F0F", // Matte Black
      contrastText: "#FAF8F2", // Ivory White
    },
    secondary: {
      main: "#C8A24A", // Royal Gold
      contrastText: "#0F0F0F",
    },
    background: {
      default: "#FAF8F2", // Ivory White
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A", // Rich Charcoal
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: '"Inter", "Manrope", "sans-serif"',
    h1: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Cormorant Garamond", "Playfair Display", "serif"',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Inter", "Manrope", "sans-serif"',
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0px", // Sharp, elegant luxury styling
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#0F0F0F",
          color: "#FAF8F2",
          "&:hover": {
            backgroundColor: "#C8A24A",
            color: "#0F0F0F",
          },
        },
        outlinedPrimary: {
          borderColor: "#0F0F0F",
          color: "#0F0F0F",
          "&:hover": {
            borderColor: "#C8A24A",
            backgroundColor: "rgba(200, 162, 74, 0.05)",
            color: "#C8A24A",
          },
        },
      },
    },
  },
});

export default customeTheme;