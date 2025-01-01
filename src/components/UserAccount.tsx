import React, {useEffect, useState } from "react";
import { Button, Box, Alert, Paper, Grid, Dialog, DialogContent, DialogActions, TextField, 
    Snackbar, SnackbarCloseReason, InputAdornment, IconButton, Typography, DialogTitle, FormControlLabel, Checkbox,
    List,
    ListItem,
    ListItemText} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";
// import { DevTool } from '@hookform/devtools';
import { User } from "../interfaces/User";
import "./Components.css"
import { useForm } from "react-hook-form";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FoodPrefsIcon from "../svgs/FoodPrefsIcon";
import HistoryIcon from "../svgs/HistoryIcon";
import DiaryIcon from "../svgs/DiaryIcon";
import FoodEditIcon from "../svgs/FoodEditIcon";
import StatsIcon from "../svgs/StatsIcon";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseIcon from '@mui/icons-material/Close';

type PasswordValues = {
    pass: string,
    oldPass: string,
    confirmPass: string
}

type StoreValues = {
    address: string,
    description: string,
    phone: string,
    webPage: string,
}

type ExpertValues = {
    address: string,
    description: string,
    phone: string,
    webPage: string,
    specialty: string,
    isCoach: boolean,
    isNutritionist: boolean
}

type Option = {
    name:string,
    function: () => void
    icon: any
  }

const UserAccount: React.FC<{isAppBarVisible:boolean, onReady:()=>void}> = ({ isAppBarVisible, onReady }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const s_id = window.sessionStorage.getItem("s_id") || window.localStorage.getItem("s_id")
    const e_id = window.sessionStorage.getItem("e_id") || window.localStorage.getItem("e_id")
    const passwordForm = useForm<PasswordValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            pass: "",
            oldPass: "",
            confirmPass: ""
        }
    });
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: passwordFormState, watch: passWatch } = passwordForm;
    const { errors: passwordErrors, isValid: isPasswordValid } = passwordFormState;

    const password = passWatch("pass")

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

    // Second form (for store details)
    const storeForm = useForm<StoreValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            address: "",
            description: "",
            phone: "",
            webPage: ""
        }
    });
    const { register: registerStore, handleSubmit: handleSubmitStore, formState: storeFormState, watch: storeWatch } = storeForm;
    const { errors: storeErrors, isValid: isStoreValid } = storeFormState;

    const expertForm = useForm<ExpertValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            address: "",
            description: "",
            phone: "",
            webPage: "",
            specialty: "",
            isCoach: false,
            isNutritionist: false
        }
    });
    const { register: registerExpert, handleSubmit: handleSubmitExpert, formState: expertFormState, watch: expertWatch} = expertForm;
    const { errors: expertErrors, isValid: isExpertValid } = expertFormState;

    const storeDescription = storeWatch("description")
    const expertDescription = expertWatch("description")

    const [user, setUser] = useState<User>({id: ""})
    const [newUserName, setNewUserName] = useState("")
    const [showNameForm, setShowNameForm] = useState(false)
    const [showPassForm, setShowPassForm] = useState(false)
    const [showStoreForm, setShowStoreForm] = useState(false)
    const [showExpertForm, setShowExpertForm] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [showOldPass, setShowOldPass] = useState(false)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showRepeatPass, setShowRepeatPass] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const url = "/users/" + id
    const storesURL = "/stores/"
    const expertsURL = "/experts/"
    useEffect(()=>{
        document.title = "Mi perfil - EyesFood";
        api.get(url, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res)=>{
            const transformedUser = {
                ...res.data,
                createdAt: new Date(res.data.createdAt), // Convert `createdAt` to a Date object
                lastLogin: new Date(res.data.lastLogin),
                updatedAt: new Date(res.data.updatedAt),
                activationExpire: new Date(res.data.activationExpire),
            };  
            setUser(transformedUser)
            setNewUserName(res.data.name)
            if(res.data.storeProfile){
                storeForm.reset(res.data.storeProfile)
            }
            if(res.data.expertProfile){
                expertForm.reset(res.data.expertProfile)
            }

        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setAllDone(true)
            onReady()
        })

    },[id, url])

    const handleCloseNameForm = () => {
        setShowNameForm(false)
    }

    const handleClosePassForm = () => {
        setShowPassForm(false)
    }

    const handleOpenStoreForm = () => {
        setShowStoreForm(true)
    }

    const handleCloseStoreForm = () => {
        setShowStoreForm(false)
    }

    const handleOpenExpertForm = () => {
        setShowExpertForm(true)
    }

    const handleCloseExpertForm = () => {
        setShowExpertForm(false)
    }

    const handleFoodPrefs = () => {
        navigate("food-prefs")
    }

    const handleFoodHistory = () => {
        navigate("food-history")
    }

    const handleFoodDiary = () => {
        navigate("food-diary")
    }

    const handleNotif = () => {
        navigate("notifications")
      }

    const handleFoodEdits = () => {
        navigate("food-edits")
    }

    const handleStats = () => {
        navigate("/stats")
      }

    const [optionsUser, setOptionsUser] = useState<Option[]>([])

    useEffect(()=>{
        const url = window.location.href
        if (e_id){
            setOptionsUser(
                [
                    {name: "Preferencias alimenticias", function: handleFoodPrefs, icon: <FoodPrefsIcon width={"100%"} height={"auto"}/>},
                    {name: "Historial de alimentos", function: handleFoodHistory, icon: <HistoryIcon width={"100%"} height={"auto"}/>},
                    {name: "Diario alimenticio", function: handleFoodDiary, icon: <DiaryIcon width={"100%"} height={"auto"}/>},
                    {name: "Mis aportes", function: handleFoodEdits, icon: <FoodEditIcon width={"100%"} height={"auto"}/>},
                    {name: "Mis medidas", function: handleStats, icon: <StatsIcon width='100%' height= 'auto'/>},
                    //{name: "Notificaciones", function: handleNotif, icon: <NotificationManagerIcon width='100%' height= 'auto'/>},
                ]
            )
        }
        else if (s_id){
            setOptionsUser(
                [
                ]
            )
        }
        else if(url.includes("admin")) {
            setOptionsUser(
                [
                ]
            )
        }

        else {
            setOptionsUser(
                [
                    {name: "Preferencias alimenticias", function: handleFoodPrefs, icon: <FoodPrefsIcon width={"100%"} height={"auto"}/>},
                    {name: "Historial de alimentos", function: handleFoodHistory, icon: <HistoryIcon width={"100%"} height={"auto"}/>},
                    {name: "Diario alimenticio", function: handleFoodDiary, icon: <DiaryIcon width={"100%"} height={"auto"}/>},
                    {name: "Mis aportes", function: handleFoodEdits, icon: <FoodEditIcon width={"100%"} height={"auto"}/>},
                    {name: "Mis medidas", function: handleStats, icon: <StatsIcon width='100%' height= 'auto'/>},
                    //{name: "Notificaciones", function: handleNotif, icon: <NotificationManagerIcon width='100%' height= 'auto'/>},
                ]
            )
        }

    }, [e_id])
    

    const handleStoreCatalogue = () => {
        navigate("/stores/" + s_id + "/catalogue")
      }

    const handleSnackbarClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSnackbarOpen(false);
      }

    const handleNameChange = (event:any) => {
        setNewUserName(event.target.value)
    }

    const onSubmitName = () => {
        api.patch(url, {name: newUserName},  
                        { 
                            withCredentials: true,
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        }
        )
        .then(res => {
            setShowNameForm(false)
            setUser({...user, name: res.data.name})
            if (window.localStorage.name){
                window.localStorage.name = res.data.name
            }
            else{
                window.sessionStorage.name = res.data.name
            }
            
            setSnackbarMsg("Nombre actualizado!")
           
        })
        .catch(error=>{
            setSnackbarMsg("Error al actualizar nombre")
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })

    }

    const onSubmitPassword = (data: PasswordValues) => {
        api.patch(url, {pass: data.pass, oldPass: data.oldPass},  
                        { 
                            withCredentials: true,
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        }
        )
        .then(res => {
                setShowPassForm(false)
                setSnackbarMsg("Contraseña actualizada!")
        })
        .catch(error=>{
            setSnackbarMsg("Error al actualizar contraseña")
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })

    }

    const onSubmitStore = (data: StoreValues) => {
        api.patch(`${storesURL}byId/${user.storeProfile?.id}`, data, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res) => {
            setSnackbarMsg("Datos actualizados!");
            setUser((prevUser) => ({
                ...prevUser,
                storeProfile: res.data, // Update with the new storeProfile data
            }));
            handleCloseStoreForm()
        })
        .catch(error=>{
            setSnackbarMsg("Error al actualizar datos")
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })
    };

    const onSubmitExpert = (data: ExpertValues) => {
        api.patch(`${expertsURL}byId/${user.expertProfile?.id}`, data, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res) => {
            setSnackbarMsg("Datos actualizados!");
            setUser((prevUser) => ({
                ...prevUser,
                expertProfile: res.data, // Update with the new storeProfile data
            }));
            handleCloseExpertForm()
        })
        .catch(error=>{
            setSnackbarMsg("Error al actualizar datos")
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })
    };

    return (allDone && <Grid container 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
                
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
                        {/* <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Rol: </span>{user.userHasRole?.map((userRole: any) => userRole.role?.name).filter(Boolean).join(", ")}</li>
                        </Typography> */}
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
                                <Typography variant="subtitle2" sx={{color: "primary.contrastText"}}>
                                    Cambiar <br /> nombre
                                </Typography>
                        </Button>
                        <Button onClick={()=>setShowPassForm(true)} variant="contained"
                        sx={{
                            borderRadius: 0,
                            width:"50%",
                            
                            }}
                        >
                           <Typography variant="subtitle2" sx={{color: "primary.contrastText"}}>
                                Cambiar <br /> contraseña
                            </Typography>
                        </Button>
                    </Paper>
                    
            </Box>
                {user.expertProfile && (
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
                            pb: "5px",
                            justifyContent: "flex-start",
                            display: "flex",
                            textIndent: 10
                        }}>
                            <Typography variant='h6' color= "primary.contrastText">
                            Información profesional
                            </Typography>
                        </Paper>
                        <Paper elevation={0}>
                        <ul style={{ paddingLeft: 10 }}>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.expertProfile.description}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Especialidad: </span>{user.expertProfile.specialty}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.expertProfile.address}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Tel: </span>{user.expertProfile.phone}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Página web: </span>{user.expertProfile.webPage}</li>
                            </Typography>
                            <Typography variant='subtitle1' color="primary.dark">
                                <li>
                                    <span style={{fontWeight: "bold"}}>
                                    {user.expertProfile.isNutritionist?<>Es nutricionista</>:<>No es nutricionista</>}
                                    </span>
                                </li>
                            </Typography>
                            <Typography variant='subtitle1' color="primary.dark">
                                <li>
                                    <span style={{fontWeight: "bold"}}>
                                    {user.expertProfile.isCoach?<>Es coach</>:<>No es coach</>}
                                    </span>
                                </li>
                            </Typography>
                        </ul>
                        </Paper>
                        <Paper elevation={0} square={true} sx={{
                            bgcolor: "primary.main",
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            <Button variant="contained" onClick={handleOpenExpertForm}
                            sx={{
                                borderRadius: 0, 
                                }}>
                                <Typography fontFamily="Montserrat" fontSize={14}>
                                    Modificar información
                                </Typography>
                                
                            </Button>
                        </Paper> 
                    </Box> 
                )}
                {user.storeProfile && (
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
                            pb: "5px",
                            justifyContent: "flex-start",
                            display: "flex",
                            textIndent: 10
                        }}>
                            <Typography variant='h6' color= "primary.contrastText">
                            Información de tienda
                            </Typography>
                        </Paper>
                        <Paper elevation={0}>
                        <ul style={{ paddingLeft: 10 }}>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Descripción: </span>{user.storeProfile.description}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Dirección: </span>{user.storeProfile.address}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Tel: </span>{user.storeProfile.phone}</li>
                            </Typography>
                            <Typography variant='subtitle1' color= "primary.dark">
                                <li><span style={{fontWeight: "bold"}}>Página web: </span>{user.storeProfile.webPage}</li>
                            </Typography>
                        </ul>
                        </Paper>
                        <Paper elevation={0} square={true} sx={{
                            bgcolor: "primary.main",
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            <Button fullWidth variant="contained" onClick={handleOpenStoreForm}
                            sx={{
                                borderRadius: 0, 
                                }}>
                                <Typography fontFamily="Montserrat" fontSize={14}>
                                    Modificar información
                                </Typography>
                                
                            </Button>
                            <Button fullWidth variant="contained" onClick={handleStoreCatalogue}
                            sx={{
                                borderRadius: 0, 
                                }}>
                                <Typography fontFamily="Montserrat" fontSize={14}>
                                    Ver mi catálogo
                                </Typography>
                                
                            </Button>
                        </Paper> 
                    </Box> 
                )}
                <Box sx={{width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
                    {optionsUser.map((option) => (
                        <Button variant='dashed' key={option.name} onClick={option.function} 
                        sx={{display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "stretch",
                            width: "30%", 
                            maxWidth: "200px", 
                            fontWeight: "bold",
                        }}
                        > 
                            <Box width="70%">
                                {option.icon}
                            </Box>
                            
                            <Typography variant='subtitle1' sx={{fontSize:{xs: 12, sm:18}, fontStyle: "bold"}}>
                                {option.name}
                            </Typography>
                        </Button>
                    ))}
                </Box>
                

                <Dialog open={showNameForm} scroll='paper' 
                PaperProps={{
                    sx: {width: "100vw", 
                        maxWidth: "500px", 
                        margin: 0,
                        maxHeight: "85vh"
                    }
                }}
                >
                    <DialogTitle>
                        <Box sx={{display:"flex", justifyContent: "space-between"}}>
                            Cambiar nombre
                            <IconButton
                            color="inherit"
                            onClick={handleCloseNameForm}
                            sx={{p:0}}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>       
                    <DialogContent>
                        <TextField 
                        sx={{mt:2}}
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
                        <Button variant="contained" onClick={onSubmitName} disabled={newUserName==user.name || newUserName == ""} 
                        sx={{
                            
                        }} 
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
                    
                    <Dialog open={showPassForm} scroll='paper' 
                    PaperProps={{
                        sx: {width: "100vw", 
                            maxWidth: "500px", 
                            margin: 0,
                            maxHeight: "80vh"
                        }
                    }}>
                        <DialogTitle>
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                                Cambiar contraseña
                                <IconButton
                                color="inherit"
                                onClick={handleClosePassForm}
                                sx={{p:0}}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>    
                        <form onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate encType="multipart/form-data" autoComplete="off">
                        <DialogContent >
                            <TextField 
                            sx={{py: 1}}
                            id="oldPass"
                            label="Contraseña actual"
                            type={showOldPass ? 'text' : 'password'}
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            inputProps={{maxLength: 100}}
                            {...registerPassword("oldPass", {required: "Ingresar contraseña", 
                                minLength: {
                                    value: 8,
                                    message: "Mínimo 8 caractéres"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                                    message: "Contraseña inválida"
                                }

                                })}
                                error={!!passwordErrors.oldPass}
                                helperText = {passwordErrors.oldPass?.message}
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
                            inputProps={{maxLength: 100}}
                            autoComplete="off"
                            {...registerPassword("pass", {required: "Ingresar contraseña", 
                                minLength: {
                                    value: 8,
                                    message: "Mínimo 8 caractéres"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                    message: "Contraseña inválida"
                                }

                                })}
                                error={!!passwordErrors.pass}
                                helperText = {passwordErrors.pass?.message}
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
                            {password && (
                            <List>
                                {passwordRequirements.map((req, index) => (
                                <ListItem key={index} disableGutters>
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
                                sx={{py:1}}
                                id="confirmPass" 
                                label="Repetir contraseña nueva" 
                                type={showRepeatPass ? 'text' : 'password'}
                                fullWidth
                                variant="outlined" 
                                inputProps={{maxLength: 100}}
                                autoComplete="off"
                                {...registerPassword("confirmPass", {required: "Repetir contraseña",
                                                                validate: () => passWatch("pass")!=passWatch("confirmPass")?"Contraseñas no coinciden": true
                                })}
                                error={!!passwordErrors.confirmPass}
                                helperText = {passwordErrors.confirmPass?.message}
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
                        </DialogContent>
                        
                        <DialogActions>
                           
                            <Button variant="contained" type="submit" disabled={!isPasswordValid}  
                            sx={{
                                
                            }} 
                            >
                                Guardar
                            </Button>
                        </DialogActions>
                        </form>
                    </Dialog>

                    <Dialog open={showStoreForm} onClose={handleCloseStoreForm} 
                    PaperProps={{
                        sx: {width: "100vw", 
                            maxWidth: "500px", 
                            maxHeight: "80vh",
                            margin: 0
                        }
                    }}
                    >
                        <DialogTitle>
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                                Modificar información
                                <IconButton
                                color="inherit"
                                onClick={handleCloseStoreForm}
                                sx={{p:0}}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>      
                        <DialogContent sx={{
                            padding:0.5,
                            flex: 1, 
                            overflowY: 'auto'
                        }}>
                            <form onSubmit={handleSubmitStore(onSubmitStore)}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    inputProps={{maxLength: 150}}
                                    label="Descripción"
                                    {...registerStore("description", {required: "Ingresar descripción"})}
                                    error={!!storeErrors.description}
                                    helperText={
                                        storeErrors.description?.message ||
                                        `${storeDescription.length}/${150}`
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    inputProps={{maxLength: 100}}
                                    {...registerStore("address")}
                                    error={!!storeErrors.address}
                                    helperText={storeErrors.address?.message}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    inputProps={{maxLength: 20}}
                                    {...registerStore("phone")}
                                    error={!!storeErrors.phone}
                                    helperText={storeErrors.phone?.message}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Página Web"
                                    inputProps={{maxLength: 100}}
                                    {...registerStore("webPage")}
                                    error={!!storeErrors.webPage}
                                    helperText={storeErrors.webPage?.message}
                                    margin="normal"
                                />
                                
                                <DialogActions>
                                    <Button type="submit" variant="contained" disabled={!isStoreValid}>Guardar</Button>
                                </DialogActions>
                            </form>
                        </DialogContent>
                    </Dialog>         

                    <Dialog open={showExpertForm} onClose={handleCloseExpertForm}
                    PaperProps={{
                        sx: {width: "100vw", 
                            maxWidth: "500px", 
                            maxHeight: "80vh",
                            margin: 0
                        }
                    }}
                    >
                        <DialogTitle>
                            <Box sx={{display:"flex", justifyContent: "space-between"}}>
                                Modificar información
                                <IconButton
                                color="inherit"
                                onClick={handleCloseExpertForm}
                                sx={{p:0}}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>      
                        <DialogContent sx={{
                            padding:0.5,
                            flex: 1, 
                            overflowY: 'auto'
                        }}>
                            <form onSubmit={handleSubmitExpert(onSubmitExpert)}>
                                <TextField
                                    label="Descripción"
                                    {...registerExpert('description', {required: "Ingresar descripción"})}
                                    inputProps={{maxLength: 400}}
                                    helperText={
                                        expertErrors.description?.message ||
                                        `${expertDescription.length}/${400}`
                                    }
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Especialidad"
                                    inputProps={{maxLength: 100}}
                                    {...registerExpert("specialty", {required: "Ingresar especialidad"})}
                                    error={!!expertErrors.specialty}
                                    helperText={expertErrors.specialty?.message}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    inputProps={{maxLength: 100}}
                                    {...registerExpert("address")}
                                    error={!!expertErrors.address}
                                    helperText={expertErrors.address?.message}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    inputProps={{maxLength: 20}}
                                    {...registerExpert("phone")}
                                    error={!!expertErrors.phone}
                                    helperText={expertErrors.phone?.message}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Página Web"
                                    inputProps={{maxLength: 100}}
                                    {...registerExpert("webPage")}
                                    error={!!expertErrors.webPage}
                                    helperText={expertErrors.webPage?.message}
                                    margin="normal"
                                />
                                
                                <FormControlLabel
                                    control={<Checkbox {...registerExpert("isCoach")} defaultChecked={user.expertProfile?.isCoach} />}
                                    label="Coach"
                                />
                                <FormControlLabel
                                    control={<Checkbox {...registerExpert("isNutritionist")} defaultChecked={user.expertProfile?.isNutritionist} />}
                                    label="Nutricionista"
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSubmitExpert(onSubmitExpert)} variant="contained" disabled={!isExpertValid}>Guardar</Button>
                        </DialogActions>
                    </Dialog>         
                
                    <Snackbar
                        open = {snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        >
                        <Alert onClose={handleSnackbarClose} 
                        severity={snackbarMsg.includes("Error")?"error":"success"} 
                        variant="filled"
                        sx={{ 
                            width: '100%'
                        }}>
                            {snackbarMsg}
                        </Alert>
                    </Snackbar>   
        </Grid>
    )
}

export default UserAccount