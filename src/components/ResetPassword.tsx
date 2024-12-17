import React, {useEffect, useState } from "react";
import { Button, Box, Alert, Paper, Grid, Dialog, DialogContent, DialogActions, TextField, 
    Snackbar, SnackbarCloseReason, InputAdornment, IconButton, Typography, DialogTitle, FormControlLabel, Checkbox} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";
// import { DevTool } from '@hookform/devtools';
import { User } from "../interfaces/User";
import "./Components.css"
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FoodPrefsIcon from "../svgs/FoodPrefsIcon";
import HistoryIcon from "../svgs/HistoryIcon";
import DiaryIcon from "../svgs/DiaryIcon";
import FoodEditIcon from "../svgs/FoodEditIcon";
import StatsIcon from "../svgs/StatsIcon";
import NotificationManagerIcon from "../svgs/NotificationManagerIcon";

type PasswordValues = {
    pass: string,
    confirmPass: string
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate()
    const { id, activationToken } = useParams()
    const passwordForm = useForm<PasswordValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            pass: "",
            confirmPass: ""
        }
    });
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: passwordFormState, watch } = passwordForm;
    const { errors: passwordErrors, isValid: isPasswordValid } = passwordFormState;

    const [showPassForm, setShowPassForm] = useState(true)
    const [snackbarMsg, setSnackbarMsg] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showRepeatPass, setShowRepeatPass] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const url = `/auth/resetpass/${id}`
    useEffect(()=>{
        document.title = "Cambiar contraseña - EyesFood";
        console.log(id, activationToken)
    },[])

    const handleClosePassForm = () => {
        setShowPassForm(false)
    }

    const handleLogin = () => {
        navigate("/login")
      }

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
      }

    const onSubmitPassword = (data: PasswordValues) => {
        console.log(data)
        api.post(url, {newPass: data.pass, activationToken},  
                        { 
                            withCredentials: true
                        }
        )
        .then(res => {
                setShowPassForm(false)
                setSnackbarMsg("Contraseña actualizada!")
        })
        .catch(error=>{
            setSnackbarMsg(error.response.data.message || "Error al actualizar contraseña")
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })

    }

    return (
        <>
          {/* Conditional Rendering */}
          {showPassForm ? (
            <Box
              sx={{
                pt:2,
                width: "100%",
                maxWidth: "500px",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
                <Typography variant="h6" sx={{py:2}}>
                    Reestablecer contraseña
                </Typography>
              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                noValidate
                encType="multipart/form-data"
                autoComplete="off"
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    id="pass"
                    label="Contraseña nueva"
                    type={showNewPass ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    autoComplete="off"
                    {...registerPassword("pass", {
                      required: "Ingresar contraseña",
                      minLength: {
                        value: 8,
                        message: "Mínimo 8 caractéres",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                        message: "Contraseña inválida",
                      },
                    })}
                    error={!!passwordErrors.pass}
                    helperText={passwordErrors.pass?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowNewPass(!showNewPass)}
                            aria-label="toggle password visibility"
                          >
                            {showNewPass ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
      
                  <TextField
                    id="confirmPass"
                    label="Repetir contraseña nueva"
                    type={showRepeatPass ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    autoComplete="off"
                    {...registerPassword("confirmPass", {
                      required: "Repetir contraseña",
                      validate: () =>
                        watch("pass") !== watch("confirmPass")
                          ? "Contraseñas no coinciden"
                          : true,
                    })}
                    error={!!passwordErrors.confirmPass}
                    helperText={passwordErrors.confirmPass?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowRepeatPass(!showRepeatPass)}
                            aria-label="toggle password visibility"
                          >
                            {showRepeatPass ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
      
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!isPasswordValid}
                    >
                      Aceptar
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          ) : (
            <Typography variant="h6" color="success.main" textAlign="center">
              Contraseña actualizada
            </Typography>
          )}
      
          {/* Navigation button */}
          <Button onClick={handleLogin} variant="text" sx={{pt:3}}>
            Ir a iniciar sesión
          </Button>
      
          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarMsg.includes("Error") ? "error" : "success"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMsg}
            </Alert>
          </Snackbar>
        </>
      );
}

export default ResetPassword