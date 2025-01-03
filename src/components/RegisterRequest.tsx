import React, { useEffect, useState } from "react";
import { Button, Box, TextField, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions, 
    InputAdornment, IconButton, Alert, FormControlLabel, Checkbox, Typography, Grid,
    List,
    ListItem,
    ListItemText,
    FormHelperText} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

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
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const queryParams = url.searchParams;
    const userType = queryParams.get('u');
    const navigate = useNavigate()
    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
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
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const registerURL = "/auth/signup"

    const { register, handleSubmit, formState, watch } = form
    const {errors} = formState

    const password = watch("pass")

    const description = watch("description")

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

    useEffect(() => {
        document.title = "Solicitud de cuenta - EyesFood";
    }, []); // Empty dependency array to ensure it runs only once on mount

    const onSubmit = (data: FormValues) => {
        api.post(registerURL, {
            ...data,
            profilePic: "default_profile.png",
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
            <Button onClick={()=>navigate("/")}>
                <Typography variant="subtitle2" sx={{textDecoration: "underline"}}>
                    Volver a inicio de sesión
                </Typography>
            </Button>
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
                inputProps={{ maxLength: 100 }}
            />
       
            <TextField 
                sx={{my:1}}
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                fullWidth
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
                    {passwordRequirements.map(req => (
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
                inputProps={{ maxLength: 100 }}
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
                {...register("description", {required: "Ingresar descripción"})}
                error={!!errors.description}
                helperText={
                    errors.description?.message ||
                    `${description.length}/${userType==="expert"? 400 : 150}`
                }
                inputProps={{ maxLength: userType==="expert"? 400 : 150 }}
            />

            <TextField 
                sx={{ my: 1 }}
                id="phone" 
                label="Teléfono" 
                type="tel" 
                variant="standard" 
                fullWidth
                inputProps={{
                    maxLength: 15, // Enforces a maximum input length
                }}
                {...register("phone", {
                    pattern: {
                        value: /^\+56\s?(2|9)\s?\d{4}(\d{4}|\s?\d{4})$/,
                        message: "Formato incorrecto",
                    }
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || ""}
            />
            <FormHelperText>
                ej: +56 9 1234 5678
            </FormHelperText>

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
                inputProps={{ maxLength: 100 }}
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
                inputProps={{ maxLength: 100 }}
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
    </form>   
  </Grid>
  
  
}

export default RegisterRequest