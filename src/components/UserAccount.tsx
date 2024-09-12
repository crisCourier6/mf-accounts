import React from "react";
import { Button, Box, Alert, Paper, Grid, Backdrop, Dialog, DialogContent, DialogActions, TextField, Snackbar, SnackbarCloseReason, InputAdornment, IconButton, Typography} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import { DevTool } from '@hookform/devtools';
import { UserFull } from "../interfaces/UserFull";
import "./Components.css"
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type FormValues = {
    pass: string,
    oldPass: string,
    confirmPass: string
}

const UserAccount: React.FC<{isAppBarVisible:boolean}> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const form = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            pass: "",
            oldPass: "",
            confirmPass: ""
        }
    })
    const { register, handleSubmit, formState, control, getValues, watch } = form
    const {errors, isValid} = formState
    const [user, setUser] = useState<UserFull>({id: ""})
    const [newUserName, setNewUserName] = useState("")
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [showNameForm, setShowNameForm] = useState(false)
    const [showPassForm, setShowPassForm] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [passErrorOpen, setPassErrorOpen] = useState(false)

    const [showOldPass, setShowOldPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showRepeatPass, setShowRepeatPass] = useState(false)

    const url = "http://192.168.100.6:8080/users/" + id
    useEffect(()=>{
        
        axios.get(url, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then((res)=>{
            console.log(res.data)
            const transformedUser = {
                ...res.data,
                createdAt: new Date(res.data.createdAt), // Convert `createdAt` to a Date object
                lastLogin: new Date(res.data.lastLogin),
                updatedAt: new Date(res.data.updatedAt),
                activationExpire: new Date(res.data.activationExpire),
            };  
            setUser(transformedUser)
            setNewUserName(res.data.name)
            
                                
        }).catch((error) => {
            console.log(error)
        })
    },[id, url])

    const handleCloseNameForm = () => {
        setShowNameForm(false)
    }

    const handleClosePassForm = () => {
        setShowPassForm(false)
    }

    const handleSuccessClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSuccessOpen(false);
      }

    const handleNameChange = (event:any) => {
        setNewUserName(event.target.value)
    }

    const handleOldPassChange = (event:any) => {
        setOldPass(event.target.value)
    }

    const handlePassChange = (event:any) => {
        setNewPass(event.target.value)
    }

    const handleSubmitName = () => {
        axios.post(url, {name: newUserName},  
                        { 
                            withCredentials: true,
                            headers: {
                                Authorization: "Bearer " + window.localStorage.token
                            }
                        }
        )
        .then(res => {
            console.log(res)
            if (res.data.affected==1){
                setShowNameForm(false)
                setUser({...user, name: newUserName})
                window.localStorage.name = newUserName
                setSuccessOpen(true)
            }
            else{

            }
        })

    }

    const handleSubmitPass = (data: FormValues) => {
        console.log(data)
        axios.post(url, {pass: data.pass, oldPass: data.oldPass},  
                        { 
                            withCredentials: true,
                            headers: {
                                Authorization: "Bearer " + window.localStorage.token
                            }
                        }
        )
        .then(res => {
            console.log(res)
            if (res.data.affected==1){
                setShowPassForm(false)
                setSuccessOpen(true)
            }
            else if(res.data.error=="oldPass"){
                setPassErrorOpen(true)
            }
        })

    }

    return <Grid container 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
                <Box 
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "500px",
                    position: 'fixed',
                    top: isAppBarVisible?"50px":"0px",
                    width:"100%",
                    transition: "top 0.3s",
                    backgroundColor: 'primary.dark', // Ensure visibility over content
                    zIndex: 100,
                    boxShadow: 3,
                    overflow: "hidden", 
                    borderBottom: "5px solid",
                    borderLeft: "5px solid",
                    borderRight: "5px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box"
                  }}
                >
                    <Typography variant='h5' width="100%" sx={{py:0.5}} color= "primary.contrastText">
                        Mi perfil
                    </Typography>
                </Box>
            <Box
                sx={{
                    marginTop: "60px",
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Información general
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                    <ul style={{ paddingLeft: 10 }}>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Nombre: </span>{user.name}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Email: </span>{user.email}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Rol: </span>{user.roles}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Miembro desde: </span>{user.createdAt?.toLocaleDateString("es-CL", )}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Último ingreso: </span>{user.lastLogin?.toLocaleDateString("es-CL", )}</li>
                        </Typography>
                    </ul>
                    </Paper>
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        justifyContent: "space-around",
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <Button onClick={()=>setShowNameForm(true)} variant="contained"
                        sx={{
                            borderRadius: 0,
                            width:"50%",
                            
                            }}>
                            <Typography fontFamily="Montserrat" fontSize={14}>
                                Cambiar <br /> nombre
                            </Typography>
                            
                        </Button>
                        <Button onClick={()=>setShowPassForm(true)} variant="contained"
                        sx={{
                            borderRadius: 0,
                            width:"50%",
                            
                            }}
                        >
                           <Typography fontFamily="Montserrat" fontSize={14}>
                                Cambiar <br /> contraseña
                            </Typography>
                        </Button>
                    </Paper>
                    
                </Box>
                
                <Backdrop open={showNameForm} 
                sx={{width: "100vw", zIndex: 10}}
                >
                    <Dialog open={showNameForm} scroll='paper' 
                                sx={{width: "100%", 
                                    maxWidth: "500px", 
                                    margin: "auto"
                                }}>
                                
                                <DialogContent>
                                    <TextField 
                                    id="name"
                                    label="Nombre nuevo"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={newUserName}
                                    onChange={handleNameChange}
                                    inputProps={{maxLength: 100}}
                                    >
                                    </TextField>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained"
                                    onClick={handleCloseNameForm}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" onClick={handleSubmitName} disabled={newUserName==user.name || newUserName == ""} 
                                    sx={{
                                        
                                    }} 
                                    >
                                        Aceptar
                                    </Button>
                                </DialogActions>
                    </Dialog>
                </Backdrop>

                <Backdrop open={showPassForm} 
                sx={{width: "100vw", zIndex: 100}}
                >
                    
                    <Dialog open={showPassForm} scroll='paper' 
                                sx={{width: "100%", 
                                    maxWidth: "500px", 
                                    margin: "auto"
                                }}>
                                <form onSubmit={handleSubmit(handleSubmitPass)} noValidate encType="multipart/form-data" autoComplete="off">
                                <DialogContent >
                                    <TextField 
                                    sx={{py: 1}}
                                    id="oldPass"
                                    label="Contraseña actual"
                                    type={showOldPass ? 'text' : 'password'}
                                    fullWidth
                                    variant="outlined"
                                    autoComplete="off"
                                    {...register("oldPass", {required: "Ingresar contraseña", 
                                        minLength: {
                                            value: 8,
                                            message: "Mínimo 8 caractéres"
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                            message: "Contraseña inválida"
                                        }

                                        })}
                                        error={!!errors.oldPass}
                                        helperText = {errors.oldPass?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={()=>setShowOldPass(!showOldPass)}
                                                aria-label="toggle password visibility"
                                            >
                                                {showOldPass? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    >
                                    </TextField>
                                    <TextField 
                                    sx={{py: 1}}
                                    id="pass"
                                    label="Contraseña nueva"
                                    type={showNewPass ? 'text' : 'password'}
                                    fullWidth
                                    variant="outlined"
                                    autoComplete="off"
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
                                                onClick={()=>setShowNewPass(!showNewPass)}
                                                aria-label="toggle password visibility"
                                            >
                                                {showNewPass? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    >
                                    </TextField>
                                    <TextField 
                                        sx={{py:1}}
                                        id="confirmPass" 
                                        label="Repetir contraseña nueva" 
                                        type={showRepeatPass ? 'text' : 'password'}
                                        fullWidth
                                        variant="outlined" 
                                        autoComplete="off"
                                        {...register("confirmPass", {required: "Repetir contraseña",
                                                                        validate: () => watch("pass")!=watch("confirmPass")?"Contraseñas no coinciden": true
                                        })}
                                        error={!!errors.confirmPass}
                                        helperText = {errors.confirmPass?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    onClick={()=>setShowRepeatPass(!showRepeatPass)}
                                                    aria-label="toggle password visibility"
                                                >
                                                    {showRepeatPass? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Alert severity="error" sx={{display: passErrorOpen?null:"none"}} >
                                        Contraseña actual incorrecta
                                    </Alert>
                                </DialogContent>
                                
                                <DialogActions>
                                    <Button variant="contained"
                                    onClick={handleClosePassForm}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" type="submit" disabled={!isValid}  
                                    sx={{
                                        
                                    }} 
                                    >
                                        Aceptar
                                    </Button>
                                </DialogActions>
                                </form>
                    </Dialog>
                    
                </Backdrop>

                
                    <Snackbar
                        open = {successOpen}
                        autoHideDuration={3000}
                        onClose={handleSuccessClose}
                        sx={{bottom: "40vh"}}
                        >
                        <Alert
                            severity="success"
                            variant="filled"
                            action={
                                <Button color="inherit" size="small" onClick={handleSuccessClose}>
                                  OK
                                </Button>
                              }
                            sx={{ width: '100%',
                                color: "secondary.contrastText",
                                bgcolor: "secondary.main"
                            }}
                        >
                            Datos actualizados!
                        </Alert>
                    </Snackbar>  
                
                
        </Grid>
  
}

export default UserAccount