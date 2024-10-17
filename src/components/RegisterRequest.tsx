import React from "react";
import { Button, Box, TextField, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions, InputAdornment, IconButton, Alert, Snackbar, FormControlLabel, Checkbox, Typography, Grid} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import { useEffect, useState } from 'react';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CheckBox } from "@mui/icons-material";
// import { DevTool } from '@hookform/devtools';

type FormValues = {
    name: string
    email: string
    pass: string
    confirmPassword: string
    profilePic: string
    address: string
    description: string
    phone: string
    webPage: string
    specialty: string
    isCoach: boolean
    isNutritionist: boolean
    userRole: string[]
}

const RegisterRequest: React.FC = () => {
    const currentUrl = window.location.href; // "http://example.com/login?u=expert"
    const url = new URL(currentUrl);
    const queryParams = url.searchParams;
    const userType = queryParams.get('u');
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const form = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            pass: "",
            confirmPassword: "",
            profilePic: "",
            userRole: userType==="expert"?["Core", "Expert"]:["Core", "Store"],
            address: "",
            description: "",
            phone: "",
            webPage: "",
            specialty: "",
            isNutritionist: true,
            isCoach: false
        }
    })    
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false)
    const [showPasswordHint, setShowPasswordHint] = useState(false)
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const registerURL = "/auth/signup"

    const { register, handleSubmit, formState, control, getValues, watch } = form
    const {errors} = formState

    useEffect(() => {
        document.title = "Solicitud de cuenta - EyesFood";
    }, []); // Empty dependency array to ensure it runs only once on mount

    const onSubmit = (data: FormValues) => {
        console.log(data)
        api.post(registerURL, {
            ...data,
            profilePic: "default_profile.png",
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

    const handlePasswordhint = () => {
        setShowPasswordHint(!showPasswordHint)
    }

    const handleFile = (newFile : any) => {
        setFile(newFile)
      }

    return  <Grid container 
    display="flex" 
    flexDirection="column" 
    justifyContent="center" 
    alignItems="center" 
    sx={{width: "90vw", maxWidth:"500px", gap:2}}>
    
    <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
        
            <Typography variant="h5" my={2}>
                Registro de {userType==="expert"?"nutricionista":"tienda"}
            </Typography>
            <TextField 
                sx={{my:1}}
                id="name" 
                label="Nombre" 
                type="text" 
                variant="standard" 
                fullWidth
                {...register("name", {required: "Ingresar nombre"})}
                error={!!errors.name}
                helperText = {errors.name?.message}
            />
       
            <TextField 
                sx={{my:1}}
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                fullWidth
                {...register("email", {required: "Ingresar email"})}
                error={!!errors.email}
                helperText = {errors.email?.message}
            />

            <TextField 
                sx={{my:1}}
                id="pass" 
                label="Contraseña" 
                type={showPass ? 'text' : 'password'}
                variant="standard" 
                fullWidth
                {...register("pass", {required: "Ingresar contraseña", 
                                            minLength: {
                                                value: 8,
                                                message: "Mínimo 8 caractéres"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                                message: "Contraseña inválida"
                                            }

                })}
                error={!!errors.pass}
                helperText = {errors.pass?.message}
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
                sx={{my:1}}
                id="confirmPassword" 
                label="Repetir contraseña" 
                type={showConfirmPass ? 'text' : 'password'}
                variant="standard" 
                fullWidth
                {...register("confirmPassword", {required: "Repetir contraseña",
                                                validate: () => watch("pass")!=watch("confirmPassword")?"Contraseñas no coinciden": true
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
            <TextField 
                sx={{my:1}}
                id="address" 
                label="Dirección" 
                type="text" 
                variant="standard" 
                fullWidth
                {...register("address")}
                error={!!errors.address}
                helperText = {errors.address?.message}
            />

            <TextField 
                sx={{my:1}}
                id="description" 
                label="Descripción" 
                type="text" 
                variant="standard" 
                multiline
                fullWidth
                rows={5} // Default number of rows
                maxRows={5} // Maximum number of rows it can expand to
                {...register("description", {required: "Ingresar descripción breve"})}
                error={!!errors.description}
                helperText = {errors.description?.message}
            />

            <TextField 
                sx={{my:1}}
                id="phone" 
                label="Teléfono" 
                type="tel" 
                variant="standard" 
                fullWidth
                inputProps={{
                    maxLength: 15, // Length for the pattern "+56 9 1234 5678"
                }}
                {...register("phone", {
                    pattern: {
                        value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                        message: "Formato incorrecto"
                    }    
                })}
                error={!!errors.phone}
                helperText = {errors.phone?.message}
            />

            <TextField 
                sx={{my:1}}
                id="webPage" 
                label="Página web" 
                type="text" 
                variant="standard" 
                fullWidth
                {...register("webPage")}
                error={!!errors.webPage}
                helperText = {errors.webPage?.message}
            />

            
            {userType==="expert" && (<TextField 
                sx={{my:1}}
                id="specialty" 
                label="Especialización" 
                type="text" 
                variant="standard" 
                fullWidth
                {...register("specialty", {required: "Ingresar especialización"})}
                error={!!errors.specialty}
                helperText = {errors.specialty?.message}
            />)}
            {userType==="expert" && (<Box my={1}>
           
                <FormControlLabel hidden={userType!="expert"}
                    control={
                        <Checkbox
                            checked={watch("isNutritionist")}
                            onChange={(e) => form.setValue("isNutritionist", e.target.checked)}
                        />
                    }
                    label="Nutricionista"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={watch("isCoach")}
                            onChange={(e) => form.setValue("isCoach", e.target.checked)}
                        />
                    }
                    label="Coach"
                />
            </Box>)}
            <Button type="submit" variant="contained" sx={{mb: 2}} > Registrarse</Button>
            
            <Backdrop open={showRegisterSuccess} onClick={handleSuccessDialog}>
                <Dialog open={showRegisterSuccess} onClose={handleSuccessDialog}>
                    <DialogContent>
                        <DialogContentText>
                            ¡Solicitud registrada con éxito! Te enviaremos un email con el resultado de la evaluación.
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
                        onClick={() => {return navigate("/login")}}>
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
    </form>   
  </Grid>
  
  
}

export default RegisterRequest