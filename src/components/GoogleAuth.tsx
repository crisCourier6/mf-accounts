import React, { useEffect } from "react";
import { Button, Box, TextField, Alert, Paper, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import api from "../api";
import { useState } from 'react';
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google"
import GoogleIcon from '@mui/icons-material/Google';

type GoogleUser = {
    name: string
    email: string
    profilePic: string
    isActive: boolean
    typeExternal: string
    externalId: string
    role: string
}


const GoogleAuth: React.FC = () => {
    const navigate = useNavigate()
    const [tokens, setTokens] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const tokensURL = "/auth/login/tokens"
    const url = "/auth/login/google"

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try{
                const response = await api.post(tokensURL, {
                    code: codeResponse.code
                })
                setTokens(response.data);  
            }
            catch(error){
                console.log("Error al iniciar sesión con Google")
            }
            
        },
        onError: (error) => console.log("login failed", error),
        scope: "https://www.googleapis.com/auth/tasks",
        flow: "auth-code"
        
    })

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(() => {
        if (tokens) {
            api.post(url, {accessToken: tokens.access_token, userRole: ["Core"]}, 
                        {withCredentials: true})
            .then(res=> {
                console.log(res.data)
                window.localStorage.setItem("id", res.data.id)
                window.localStorage.setItem("name", res.data.name)
                window.localStorage.setItem("email", res.data.email)
                window.localStorage.setItem("roles", res.data.roles)
                window.localStorage.setItem("token", res.data.token)
                window.localStorage.setItem("g_auth", tokens.access_token)
                window.localStorage.setItem("g_refresh", tokens.refresh_token)
                window.localStorage.setItem("g_expires", tokens.expires_in)
                window.localStorage.setItem("g_issued_at", tokens.issued_at)
                return navigate("/home")
            })
            .catch((err) => console.log(err));              
        }
    },[ tokens ]);

    return  <>
                {profile? (
                    <>
                        <Paper>
                            {profile.name}
                        </Paper>
                        <Paper>
                            {profile.email}
                        </Paper>
                        <Paper>
                            {profile.id}
                        </Paper>
                        <Button onClick={logOut}>
                            Cerrar sesión
                        </Button>
                    </>
                )
                :(
                    <>
                        <Button onClick={() => login()}
                        sx={{
                            border: "3px solid",
                            borderColor: "#4285F4",
                            color: "primary.main",
                            gap:1,
                            bgcolor: "primary.contrastText",
                            boxShadow: 2,
                            width:"100%",
                            "&:hover": {
                                bgcolor: "primary.contrastText",
                                borderColor: "secondary.main",
                                color: "primary.main",
                            }
                        }}    
                        >
                            <Typography>Ingresar con Google</Typography>
                            <GoogleIcon sx={{color: "#4285F4"}}></GoogleIcon>
                        </Button>
                    </>
                )
                }
            </>
  
}

export default GoogleAuth