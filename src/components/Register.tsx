import React, { useState } from "react";
import { Button, Box, TextField, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions, InputAdornment, IconButton, Alert, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

type FormValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
    profilePic: string
}

const Register: React.FC = () => {
    const navigate = useNavigate()
    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePic: ""

        }
    })    
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false)
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const url = "/auth/signup"

    const { register, handleSubmit, formState, watch } = form
    const {errors} = formState

    const password = watch("password")

    const passwordRequirements = [
        {
          text: "Mínimo 8 caracteres",
          valid: password?.length >= 8,
        },
        {
          text: "Al menos una letra mayúscula",
          valid: /[A-Z]/.test(password || ""),
        },
        {
          text: "Al menos una letra minúscula",
          valid: /[a-z]/.test(password || ""),
        },
        {
          text: "Al menos un número",
          valid: /\d/.test(password || ""),
        },
      ];

    const onSubmit = (data: FormValues) => {
        api.post(url, {
            name: data.name,
            email: data.email,
            pass: data.password,
            profilePic: "default_profile.png",
            userRole: ["Core"]
        }, {withCredentials: true})
        .then((res)=>{
            if(res.data.name){
                return handleSuccessDialog()    
            }                
        })
        .catch((error) => {
            console.log(error.response)
            setShowError(true)
            if (error.response.status == 401){
                setErrorText("El email ya está asociado a una cuenta")
            }

            else if (error.response.status == 403){
                setErrorText("Cuenta no activada")
            }
        })
    }

    const handleSuccessDialog = () => {
        setShowRegisterSuccess(!showRegisterSuccess)
    }

    const handleRequest = (userType: string) => {
        navigate("request?u=" + userType )
    }
    
    return  <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
        <Box
        sx={{
            pt: 2,
            pb: 10,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            py: 2,
            gap: 2,
            width:"100%",
        }}     
        >
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                gap: 2,
                width:"100%",
            }}     
            >
                <Button onClick={()=>handleRequest("expert")}>
                    <Typography variant="subtitle1" sx={{textDecoration: "underline"}}>
                        Soy nutricionista
                    </Typography>
                </Button>
                <Button onClick={()=>handleRequest("store")}>
                    <Typography variant="subtitle1" sx={{textDecoration: "underline"}}>
                        Soy dueño de tienda
                    </Typography>
                </Button>
            </Box>
            
            <TextField 
                id="name" 
                label="Nombre" 
                type="text" 
                variant="standard" 
                {...register("name", {required: "Ingresar nombre"})}
                error={!!errors.name}
                helperText = {errors.name?.message}
                inputProps={{ maxLength: 100 }}
            />
       
            <TextField 
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                {...register("email", {
                    required: "Ingresar email",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Formato de email inválido"
                    }
                })}
                error={!!errors.email}
                helperText = {errors.email?.message}
                inputProps={{ maxLength: 100 }}
            />

            <TextField 
                id="password" 
                label="Contraseña" 
                type={showPass ? 'text' : 'password'}
                variant="standard" 
                {...register("password", {required: "Ingresar contraseña", 
                                            minLength: {
                                                value: 8,
                                                message: "Mínimo 8 caractéres"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/,
                                                message: "Contraseña inválida"
                                            }

                })}
                error={!!errors.password}
                helperText = {errors.password?.message}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            onClick={()=>setShowPass(!showPass)}
                            aria-label="toggle password visibility"
                        >
                            {showPass? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {password && (
                <List>
                    {passwordRequirements.map(req=> (
                    <ListItem key={req.text} disableGutters>
                        {req.valid ? (
                        <CheckCircleRoundedIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                        ) : (
                        <CancelRoundedIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                        )}
                        <ListItemText
                        primary={
                            <Typography
                            variant="subtitle2"
                            color={req.valid ? "primary.main" : "error.main"}
                            >
                            {req.text}
                            </Typography>
                        }
                        />
                    </ListItem>
                    ))}
                </List>
                )}

            <TextField 
                id="confirmPassword" 
                label="Repetir contraseña" 
                type={showConfirmPass ? 'text' : 'password'}
                variant="standard" 
                {...register("confirmPassword", {required: "Repetir contraseña",
                                                validate: () => watch("password")!=watch("confirmPassword")?"Contraseñas no coinciden": true
                })}
                error={!!errors.confirmPassword}
                helperText = {errors.confirmPassword?.message}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            onClick={()=>setShowConfirmPass(!showConfirmPass)}
                            aria-label="toggle password visibility"
                        >
                            {showConfirmPass? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button type="submit" variant="contained" > Registrarse</Button>
            <Backdrop open={showRegisterSuccess} onClick={handleSuccessDialog}>
                <Dialog open={showRegisterSuccess} onClose={handleSuccessDialog}>
                    <DialogContent>
                        <DialogContentText>
                            ¡Cuenta registrada con éxito! Revisa tu email para activar tu cuenta.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{
                            color: "primary.contrastText", 
                            bgcolor: "primary.main", 
                            "&:hover": {
                                color: "secondary.contrastText", 
                                bgcolor: "secondary.main", 
                            }
                        }} 
                        onClick={() => {return navigate(0)}}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Backdrop>
            <Backdrop open={showError} onClick={()=>setShowError(false)} sx={{zIndex: 100, height:"100vh", width: "100vw"}}>
                
                    <Alert 
                    variant="filled"
                    severity="error" 
                    action={
                        <Button color="inherit" size="small" onClick={()=>setShowError(false)}>
                          OK
                        </Button>
                    }
                    sx={{display: showError?"flex":"none",
                        justifyContent: 'center',
                        alignItems: 'center',}} >{errorText}</Alert>
                
            </Backdrop>
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default Register