import React, { useEffect, useState } from "react";
import { Button, Paper, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { googleLogout, useGoogleLogin } from "@react-oauth/google"
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuth: React.FC = () => {
    const navigate = useNavigate()
    const [tokens, setTokens] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [googleResponse, setGoogleResponse] = useState<any | null>(null)
    const tokensURL = "/auth/login/tokens"
    const url = "/auth/login/google"

    const login = useGoogleLogin({
        onSuccess: codeResponse => setGoogleResponse(codeResponse), 
        onError: (error) => console.log("login failed", error),
        scope: "https://www.googleapis.com/auth/tasks",
        flow: "auth-code"
        
    })

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(()=>{
        if (googleResponse){
            api.post(tokensURL, {
                code: googleResponse.code
            })
            .then(res => {
                setTokens(res.data)
            })
            .catch(error => {
                console.log("Error al inicar sesión con Google")
            })
        }
        
    }, [googleResponse])

    useEffect(() => {
        if (tokens) {
            api.post(url, {accessToken: tokens.access_token, userRole: ["Core"]}, 
                        {withCredentials: true})
            .then(res=> {
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
             
                )
                }
            </>
  
}

export default GoogleAuth