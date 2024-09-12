import React from "react";
import { Button, Box, Alert, Grid, Dialog, DialogContent, DialogActions, TextField, Snackbar, InputAdornment, IconButton, Typography, DialogTitle, Tooltip} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener, GridFilterModel, GridRenderCellParams, GridToolbar } from "@mui/x-data-grid"
import { esES } from '@mui/x-data-grid/locales';
import { useForm } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserAccountEdit from "./UserAccountEdit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { UserFull } from "../interfaces/UserFull";
 
type FormValues = {
    name: string
    email: string
    pass: string
    confirmPassword: string
    profilePic: string
    roles: string[]
}

const UserList: React.FC<{isAppBarVisible:boolean}> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const url = "http://192.168.100.6:8080/users"
    const [users, setUsers] = useState<UserFull[]>([{id:""}])
    const [reloadUsers, setReloadUsers] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openNewTechDialog, setOpenNewTechDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filterModel, setFilterModel] = useState<GridFilterModel>({items: [] });
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const form = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            pass: "",
            confirmPassword: "",
            profilePic: "",
            roles: ["Core", "Tech"]
        }
    })   

    const { register, handleSubmit, formState, control, getValues, watch } = form
    const {errors} = formState

    useEffect(()=>{
        try {
            axios.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            })
            .then((res)=>{
                const transformedUsers = res.data.map((user: any) => ({
                    ...user,
                    createdAt: new Date(user.createdAt), // Convert `createdAt` to a Date object
                    lastLogin: new Date(user.lastLogin),
                    updatedAt: new Date(user.updatedAt),
                    activationExpire: new Date(user.activationExpire),
                }));
                setUsers(transformedUsers);       
            })
        }
        catch (error){
            console.log(error)
        }
    },[])

    const columns: GridColDef[] = [
        {field: "name", headerName: "Nombre", flex: 1.2, headerClassName: "header-colors", headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 2, headerClassName: "header-colors", headerAlign: "center"},
        {field: "roles", headerName: "Roles", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center"},
        {field: "createdAt", headerName: "Fecha", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "date"
        },
        {field: "isActive", headerName: "Estado", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Activada"}, 
                {value: false, label: "Desactivada"}, 
            ]
        },
        {field: "isPending", headerName: "Pendiente", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Sí"}, 
                {value: false, label: "No"}, 
            ]
        },
        {field: "isSuspended", headerName: "Suspendida", flex: 1, headerClassName: "header-colors", headerAlign: "center", align: "center", 
            type: "singleSelect",
            valueOptions: [
                {value: true, label: "Sí"}, 
                {value: false, label: "No"}, 
            ]
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center", 
            type: "actions",
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    height: '100%',
                }}>
                    <Tooltip title="Modificar cuenta" key="edit" placement="left" arrow={true}>
                        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar" key="delete" placement="right" arrow>
                        <IconButton color="error" onClick={() => {
                            setSelectedUser(params.row);
                            setOpenDeleteDialog(true);}}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    
                </Box>
            )
        }
    ]

    const handleRowClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
      ) => {
        return navigate("/users/" + params.row.id)
      };

      const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://192.168.100.6:8080/users/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            });
            setUsers(users.filter((user: UserFull) => user.id !== id));
            setSnackbarMessage('Usuario eliminado.');
        } catch (error) {
            console.log(error);
            setSnackbarMessage('Error al intentar eliminar usuario');
        } finally {
            setOpenDeleteDialog(false);
            setSnackbarOpen(true);
        }
    };

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCreateTech = (data: FormValues) => {
       
        try {
            axios.post(url, {
                name: data.name,
                email: data.email,
                pass: data.pass,
                profilePic: "default_profile.png",
                userRole: data.roles
            }, {withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            })
            .then((res)=>{
                console.log(res.data)
                if(res.data.name){
                    setUsers((prevUsers) => [...prevUsers,
                        {
                            ...res.data, 
                            createdAt: new Date(res.data.createdAt),
                            lastLogin: new Date(res.data.lastLogin),
                            updatedAt: new Date(res.data.updatedAt),
                            activationExpire: new Date(res.data.activationExpire),
                        }
                    ]);
                    setSnackbarMessage("Técnico creado con éxito")   
                    setOpenNewTechDialog(false)
                }                
            })
        }
        catch (error) {
            console.log(error)
            setSnackbarMessage("Error al crear técnico")   
            setOpenNewTechDialog(false)
        }
        finally{
            setSnackbarOpen(true)
        }
    }


    const handleStateChange = (id:string, newState: string) => {
        try {
            axios.post(`${url}/${id}`,
                {
                    isActive:newState==="Active"?true:false,
                    isPending:false
                }, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + window.localStorage.token
                    }
                }
            )
            .then((res)=>{     
                const updatedUsers:any = users.map((user:any) => 
                    user.id === id ? { 
                        ...user, 
                        isActive: newState==="Active"?true:false, 
                        isPending: false
                     } : user
                );
                setUsers(updatedUsers);
                console.log(updatedUsers)
                if (selectedUser?.id === id) {
                    setSelectedUser((prevUser:any) => ({
                        ...prevUser,
                        isActive: newState==="Active"?true:false,
                        isPending: false
                    }));
                }
            })
            
        }
        catch (error){
            console.log(error)
        }
        finally{
            setSnackbarMessage(newState==="Active"?'Cuenta activada correctamente':'Cuenta desactivada correctamente');
            setSnackbarOpen(true)
        }
       
    };

    const handleSuspendedChange = (id:string, newState: string) => {
        try {
            axios.post(`${url}/${id}`,
                {
                    isSuspended:newState==="Suspended"?true:false,
                }, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + window.localStorage.token
                    }
                }
            )
            .then((res)=>{     
                const updatedUsers:any = users.map((user:any) => 
                    user.id === id ? { 
                        ...user, 
                        isSuspended: newState==="Suspended"?true:false,
                     } : user
                );
                setUsers(updatedUsers);
                console.log(updatedUsers)
                if (selectedUser?.id === id) {
                    setSelectedUser((prevUser:any) => ({
                        ...prevUser,
                        isSuspended: newState==="Suspended"?true:false,
                    }));
                }
            })
            
        }
        catch (error){
            console.log(error)
        }
        finally{
            setSnackbarMessage(newState==="Suspended"?'Cuenta suspendida correctamente':'Cuenta restaurada correctamente');
            setSnackbarOpen(true)
        }
       
    };




      return ( 
        <Grid container 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        sx={{width: "100vw", maxWidth:"1000px", gap:"10px"}}>
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
                    Usuarios
                </Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width:"90vw",
                maxWidth: "1000px",
                overflow: "auto",
                marginTop: "60px",
                
            }}>
                <DataGrid 
                    rows={users}
                    columns={columns}
                    rowHeight={32}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    pageSizeOptions={[5, 10]}
                    filterModel={filterModel}
                    onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText} // Apply locale directly
                    sx={{
                        
                        width: "100%", 
                        minWidth: 0,
                        '& .MuiDataGrid-row:nth-of-type(odd)': {
                            backgroundColor: 'secondary.light', // Light grey for odd rows
                            fontFamily: "Montserrat"
                        },
                        '& .MuiDataGrid-row:nth-of-type(even)': {
                            backgroundColor: '#ffffff', // White for even rows
                            fontFamily: "Montserrat"
                        },
                        '& .MuiDataGrid-sortIcon': {
                            color: 'primary.contrastText', // Change sort icon color
                        },
                        '& .MuiDataGrid-menuIconButton': {
                            color: 'primary.contrastText', // Change column menu icon color
                        },
                        '& .header-colors': {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: "bold",
                            fontFamily: "Righteous",
                            whiteSpace: "normal"
                        },
                        
                    }}
                    />
                    
                    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                        <DialogTitle>Borrar usuario</DialogTitle>
                        <DialogContent>
                            ¿Seguro que desea borrar a este usuario?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                                No
                            </Button>
                            <Button onClick={() => handleDelete(selectedUser?.id)} variant="contained" color="primary">
                                Sí
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                        <DialogTitle>Modificar usuario</DialogTitle>
                        <DialogContent>
                            <UserAccountEdit selectedUser={selectedUser}/>
                        </DialogContent>
                        <DialogActions>
                            {selectedUser?.isPending && (
                                <Button variant="contained" onClick={()=>handleStateChange(selectedUser.id, "Active")} color="primary">Aceptar cuenta</Button>
                            )} 
                            {selectedUser?.isActive && (
                                <Button variant="contained" onClick={()=>handleStateChange(selectedUser.id, "Inactive")} color="primary">Desactivar cuenta</Button>
                            )}
                            {!selectedUser?.isActive && !selectedUser?.isPending && (
                                <Button variant="contained" onClick={()=>handleStateChange(selectedUser.id, "Active")} color="primary">Activar cuenta</Button>
                            )}  
                            {!selectedUser?.isPending && selectedUser?.isSuspended && (
                                <Button variant="contained" onClick={()=>handleSuspendedChange(selectedUser.id, "NotSuspended")} color="primary">Restaurar cuenta</Button>
                            )} 
                            {!selectedUser?.isPending && !selectedUser?.isSuspended && (
                                <Button variant="contained" onClick={()=>handleSuspendedChange(selectedUser.id, "Suspended")} color="primary">Suspender cuenta</Button>
                            )}         
                            <Button variant="contained" onClick={handleCloseEditDialog} color="primary">
                                Salir
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMessage}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes("Error")?"error":"success"} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                    <Button variant="contained" onClick={()=>setOpenNewTechDialog(true)} color="primary">
                        Crear técnico
                    </Button>
                    
                    <Dialog open={openNewTechDialog} onClose={()=>{setOpenNewTechDialog(false)}} sx={{width: "90%", maxWidth: "500px", margin: "auto"}}>
                        <form onSubmit={handleSubmit(handleCreateTech)} noValidate encType="multipart/form-data">
                        <DialogTitle>Crear nuevo técnico</DialogTitle>
                        <DialogContent>
                           
                                <TextField 
                                    id="name" 
                                    label="Nombre" 
                                    type="text" 
                                    variant="standard" 
                                    fullWidth
                                    sx={{my: 1}}
                                    {...register("name", {required: "Ingresar nombre"})}
                                    error={!!errors.name}
                                    helperText = {errors.name?.message}
                                />
                        
                                <TextField 
                                    id="email" 
                                    label="Email" 
                                    type="email" 
                                    variant="standard" 
                                    fullWidth
                                    sx={{my: 1}}
                                    {...register("email", {required: "Ingresar email"})}
                                    error={!!errors.email}
                                    helperText = {errors.email?.message}
                                />

                                <TextField 
                                    id="pass" 
                                    label="Contraseña" 
                                    type={showPass ? 'text' : 'password'}
                                    variant="standard" 
                                    fullWidth
                                    sx={{my: 1}}
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
                                    id="confirmPassword" 
                                    label="Repetir contraseña" 
                                    type={showConfirmPass ? 'text' : 'password'}
                                    variant="standard" 
                                    fullWidth
                                    sx={{my: 1}}
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
                            
                        </DialogContent>
                        <DialogActions>       
                            <Button type="submit" variant="contained" > Crear cuenta</Button>
                            <Button variant="contained" onClick={()=>setOpenNewTechDialog(false)} color="primary">
                                Salir
                            </Button>
                        </DialogActions>
                        
                        </form>
                    </Dialog>
                    
            </Box>
        </Grid>
    )

}

export default UserList