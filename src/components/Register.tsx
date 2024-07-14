import React from "react";
import { Button, Box, TextField, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useEffect, useState } from 'react';
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
    const [file, setFile] = useState(null)
    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePic: ""

        }
    })
    useEffect(()=>{
        if(window.localStorage.getItem("token")){
            return navigate("/home")
        }
        
    },[navigate])      
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
    const [showPasswordHint, setShowPasswordHint] = useState(false);

    const url = "http://192.168.100.6:8080/auth/signup"

    const { register, handleSubmit, formState, control, getValues, watch } = form
    const {errors} = formState

    const onSubmit = (data: FormValues) => {
        console.log(data)
        axios.post(url, {
            name: data.name,
            email: data.email,
            pass: data.password,
            profilePic: "default_profile.png"
        }, {withCredentials: true})
        .then((res)=>{
            if(res.data.name){
                return handleSuccessDialog()    
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

    return  <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
        <Box
        sx={{
            pt: 2,
            pb: 10,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            py: 2,
            gap: 5
        }}     
        >
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
                type="password" 
                variant="standard" 
                {...register("password", {required: "Ingresar contraseña", 
                                            minLength: {
                                                value: 8,
                                                message: "Mínimo 8 caractéres"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                                message: "Contraseña inválida"
                                            }

                })}
                error={!!errors.password}
                helperText = {errors.password?.message}
            />

            <TextField 
                id="confirmPassword" 
                label="Repetir contraseña" 
                type="password" 
                variant="standard" 
                {...register("confirmPassword", {required: "Repetir contraseña",
                                                validate: () => watch("password")!=watch("confirmPassword")?"Contraseñas no coinciden": true
                })}
                error={!!errors.confirmPassword}
                helperText = {errors.confirmPassword?.message}
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
        
        {/* <DevTool control = {control}/> */}
        
  </Box>
  </form>
  
}

export default Register