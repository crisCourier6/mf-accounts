import React, { useEffect } from "react";
import { Button, Box, TextField, Alert, InputAdornment, IconButton, FormLabel, RadioGroup, FormControlLabel, Radio, Grid} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import { useState } from 'react';
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { DevTool } from '@hookform/devtools';

type FormValues = {
    email: string
    password: string
}

const LoginAdmin: React.FC = () => {
    const navigate = useNavigate()
    const form = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            email: "",
            password: ""
        }
    })   
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("")
    const url = "/auth/login"
    const { register, handleSubmit, formState, control } = form
    const {errors} = formState
    const [showPass, setShowPass] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>('Admin'); // Default selected role
    
    useEffect(() => {
        document.title = "Iniciar sesión - EF Admin";
    }, []); // Empty dependency array to ensure it runs only once on mount

    const onSubmit = (data: FormValues) => {
        api.post(`${url}?r=${selectedRole}`, {
            email: data.email,
            pass: data.password
        }, {withCredentials: true})
        .then((res)=>{
            if(res.data.name){
                window.localStorage.setItem("id", res.data.id)
                window.localStorage.setItem("name", res.data.name)
                window.localStorage.setItem("email", res.data.email)
                window.localStorage.setItem("token", res.data.token)
                window.localStorage.setItem("role", selectedRole)
                return navigate(`/home`)
            }
            setShowError(true)
            
        }).catch((error) => {
            setShowError(true)
            setErrorText(error.response.data.message)
        })

    }

    return  (
        <Grid container display="flex" 
        flexDirection="column" 
        justifyContent="center"
        alignItems="center"
        sx={{width: "100vw", gap:2, flexWrap: "wrap", py: 5}}
        >
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            py: 2,
            gap: 5,
            width:"90%",
        }}     
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
       
            <TextField 
                id="email" 
                label="Email" 
                type="email" 
                variant="standard" 
                {...register("email", {required: "Ingresar email"})}
                error={!!errors.email}
                helperText = {errors.email?.message}
                sx={{width:"100%", maxWidth: "400px"}}
                inputProps={{maxLength: 100}}
            />

            <TextField 
                id="password" 
                label="Contraseña" 
                type={showPass ? 'text' : 'password'}
                variant="standard" 
                {...register("password", {required: "Ingresar contraseña"})}
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
                inputProps={{maxLength: 100}}
                sx={{width:"100%", maxWidth: "400px"}}
            />
            
                <RadioGroup
                    row
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)
                    }
                >
                    <Box
                    sx={{
                        py: 2,
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                        gap: 2,
                        width:"100%",
                        flexWrap: "wrap",
                    }}     
                    >
                        <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                        <FormControlLabel value="Tech" control={<Radio />} label="Técnico" />
                        <FormControlLabel value="Expert" control={<Radio />} label="Experto" />
                        <FormControlLabel value="Store" control={<Radio />} label="Tienda" />
                    </Box>
                </RadioGroup>

            <Button type="submit" variant="contained" sx={{width: "100%"}} > Iniciar sesión</Button>
            
            <Alert severity="error" sx={{display: showError?null:"none"}} >{errorText}</Alert>
        
        {/* <DevTool control = {control}/> */}
        </form>
  </Box>
  </Grid>
  
)
}

export default LoginAdmin