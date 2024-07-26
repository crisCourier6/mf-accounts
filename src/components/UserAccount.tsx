import React from "react";
import { Button, Box, Alert, Paper, Grid} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { DevTool } from '@hookform/devtools';
import { UserFull } from "../interfaces/UserFull";
import "./Components.css"

const UserAccount: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const handleSendMail = () =>{
        return console.log("mail")
    }

    const handleLogin = () =>{
        return navigate("/login")
    }
    const [user, setUser] = useState<UserFull>({id: ""})
    useEffect(()=>{
        const url = "http://192.168.100.6:8080/users/" + id
        axios.get(url, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then((res)=>{
            console.log(res.data)
            setUser(res.data)
                                
        }).catch((error) => {
            console.log(error)
        })
    },[id])              

    return <Grid container display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
            <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        py: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Información general
                    </Paper>
                    <Paper elevation={0} sx={{textIndent: 10, fontSize: 14 }}>
                    <ul>
                        <li>Nombre: {user.name}</li>
                        <li>Email: {user.email}</li>
                        <li>Rol: {user.roles}</li>
                    </ul>
                    </Paper>
                    
                </Box>
        </Grid>
  
}

export default UserAccount