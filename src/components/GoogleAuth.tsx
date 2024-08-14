import React, { useEffect } from "react";
import { Button, Box, TextField, Alert, Paper, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import axios from 'axios';
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
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
     const url = "http://192.168.100.6:8080/auth/login/google"

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse)
        },
        onError: (error) => console.log("login failed", error)
    })

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        axios.post(url, {name: res.data.name,
                                        email: res.data.email,
                                        profilePic: res.data.picture,
                                        isActive: true,
                                        typeExternal: "Google",
                                        externalId: user.access_token,
                                        role: "Core"
                                    }, 
                                    {withCredentials: true})
                        .then(res2 => {
                            window.localStorage.setItem("id", res2.data.id)
                            window.localStorage.setItem("name", res2.data.name)
                            window.localStorage.setItem("email", res2.data.email)
                            window.localStorage.setItem("roles", res2.data.roles)
                            window.localStorage.setItem("token", res2.data.token)
                            return navigate("/home")
                        })
                    })
                    .catch((err) => console.log(err));
            }
    },[ user ]);

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