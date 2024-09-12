import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from '@mui/material';
import { esES } from '@mui/x-data-grid/locales';
import { esES as pickersEsES } from '@mui/x-date-pickers/locales';
import { esES as coreEsES } from '@mui/material/locale';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

const theme = createTheme({
  
  palette: {
    primary: {
      light: '#e8eff9',
      main: "#425a6c",
      dark: '#22323f',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#eefded',
      main: "#9bf096",
      dark: '#008537',
      contrastText: '#22323f',
    },
  },
  components: {
    MuiSwitch: {
      defaultProps: {
        color:"warning"
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "dashed" },
          style: {
           
            borderRadius: 10,
            border: "5px dashed",
            borderColor: "#ffffff",
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "#ffffff",
              border: "5px dashed",
              borderColor: "#9bf096"
            }
          },
        },
      ],
      styleOverrides: {
        root: {
          fontWeight: "bold",
          textTransform: "none",
          "&:hover" : {
            color: "#22323f",
            backgroundColor: "#9bf096",
            borderColor: "#9bf096"
          }
        }
      }
    },
    
  }
},
esES,
pickersEsES,
coreEsES
)
      
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
      