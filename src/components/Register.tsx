import React, { useState } from "react";
import { Button, Box, TextField, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions, InputAdornment, IconButton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { DevTool } from '@hookform/devtools';

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
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePic: ""

        }
    })    
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false)
    // const [showPasswordHint, setShowPasswordHint] = useState(false)
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const url = "/auth/signup"

    const { register, handleSubmit, formState, watch } = form
    const {errors} = formState

    const onSubmit = (data: FormValues) => {
        console.log(data)
        api.post(url, {
            name: data.name,
            email: data.email,
            pass: data.password,
            profilePic: "default_profile.png",
            userRole: ["Core"]
        }, {withCredentials: true})
        .then((res)=>{
            if(res.data.name){
                console.log("oh")
                return handleSuccessDialog()    
            }
            console.log("huh")                    
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

    // const handlePasswordhint = () => {
    //     setShowPasswordHint(!showPasswordHint)
    // }

    // const handleFile = (newFile : any) => {
    //     setFile(newFile)
    //   
    // }

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
                <Button variant="dark" sx={{fontSize: 13}} onClick={()=>handleRequest("expert")}>
                    Soy nutricionista
                </Button>
                <Button variant="dark" sx={{fontSize: 13}} onClick={()=>handleRequest("store")}>
                    Soy dueño de tienda
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
            />
       
            <TextField 
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                {...register("email", {required: "Ingresar email"})}
                error={!!errors.email}
                helperText = {errors.email?.message}
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
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                                message: "Contraseña inválida"
                                            }

                })}
                error={!!errors.password}
                helperText = {errors.password?.message}
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