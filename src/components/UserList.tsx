import React from "react";
import { Button, Box, Alert, Grid, Dialog, DialogContent, DialogActions, TextField, 
    Snackbar, InputAdornment, IconButton, Typography, DialogTitle, Tooltip, FormGroup, FormControlLabel, Checkbox} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener, GridFilterModel, GridRenderCellParams, GridToolbar } from "@mui/x-data-grid"
import { esES } from '@mui/x-data-grid/locales';
import { useForm } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserAccountEdit from "./UserAccountEdit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from '@mui/icons-material/Add';
import { User } from "../interfaces/User"
import { Role } from "../interfaces/Role";
import { UserHasRole } from "../interfaces/UserHasRole";
 
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
    const usersURL = "/users"
    const rolesURL = "/roles"
    const [users, setUsers] = useState<User[]>([{id:""}])
    const [roles, setRoles] = useState<Role[]>([])
    const [showChangeRolesDialog, setShowChangeRolesDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openNewTechDialog, setOpenNewTechDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [reason, setReason] = useState("")
    const [filterModel, setFilterModel] = useState<GridFilterModel>({items: [] });
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
    const [showRejectDialog, setShowRejectDialog] = useState(false)
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
    const queryParams = "?ws=true&we=true&wr=true"

    useEffect(()=>{
        document.title = "Usuarios - EF Admin";
        
        api.get(`${usersURL}${queryParams}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then((res)=>{
            const transformedUsers = res.data.map((user: any) => (
                {
                ...user,
                createdAt: new Date(user.createdAt), // Convert `createdAt` to a Date object
                lastLogin: new Date(user.lastLogin),
                updatedAt: new Date(user.updatedAt),
                activationExpire: new Date(user.activationExpire),
            }));
            setUsers(transformedUsers);       
        })
        .catch(error => {
            console.log(error)
        })

    },[])

    useEffect(()=>{
        api.get(`${rolesURL}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            setRoles(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])

    useEffect(() => {
        if (selectedUser?.userHasRole) {
            const initialRoles = selectedUser.userHasRole.map((userHasRole: UserHasRole) => userHasRole.role);
            setSelectedRoles(initialRoles.filter(Boolean) as Role[]); // Ensure no null values
        }
    }, [selectedUser]);

    const columns: GridColDef[] = [
        {field: "name", headerName: "Nombre", flex: 1.2, headerClassName: "header-colors", headerAlign: "center"},
        {field: "email", headerName: "Email", flex: 2, headerClassName: "header-colors", headerAlign: "center"},
        {
            field: "roles",
            headerName: "Roles",
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center",
            align: "center",
            
            renderCell: (params: GridRenderCellParams) => {
                // Extract roles from userHasRole
                const roles = params.row.userHasRole?.map((userRole: any) => userRole.role?.name).filter(Boolean);
                // Join the roles into a comma-separated string
                return roles?.length > 0 ? roles.join(', ') : 'Sin roles'; // Handle case where there are no roles
            },
        },
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
        
        api.delete(`http://192.168.100.6:8080/users/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            setUsers(users.filter((user: User) => user.id !== id));
            setSnackbarMsg('Usuario eliminado.');
        })
        .catch (error => {
            setSnackbarMsg('Error al intentar eliminar usuario');
        }) 
        .finally(()=> {
            setOpenDeleteDialog(false);
            setSnackbarOpen(true);
        })
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
        api.post(usersURL, {
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
                setSnackbarMsg("Técnico creado con éxito")   
                setOpenNewTechDialog(false)
            }                
        })
        .catch(error => {
            setSnackbarMsg("Error al crear técnico")   
            setOpenNewTechDialog(false)
        })
        .finally(()=> {
            setSnackbarOpen(true)
        })
    }


    const handleStateChange = (id:string, newState: string) => {
        api.patch(`${usersURL}/${id}`,
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
            if (selectedUser?.id === id) {
                setSelectedUser((prevUser:any) => ({
                    ...prevUser,
                    isActive: newState==="Active"?true:false,
                    isPending: false
                }));
            }
        })
        .catch (error => {
            console.log(error)
        })
        .finally(()=>{
            setSnackbarMsg(newState==="Active"?'Cuenta activada correctamente':'Cuenta desactivada correctamente');
            setSnackbarOpen(true)
        })
       
    };

    const handleSuspendedChange = (id:string, newState: string) => {
        api.patch(`${usersURL}/${id}`,
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
            if (selectedUser?.id === id) {
                setSelectedUser((prevUser:any) => ({
                    ...prevUser,
                    isSuspended: newState==="Suspended"?true:false,
                }));
            }
            console.log(res.data)
            setSnackbarMsg(newState==="Suspended"?'Cuenta suspendida correctamente':'Cuenta restaurada correctamente');
        })
        .catch (error=>{
            console.log(error)
            setSnackbarMsg(error.response.data.message)
        })
        .finally(()=>{
            setSnackbarOpen(true)
        })
       
    };

    const onRoleUpdate = (updatedUser:User) =>{
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUser.id
                    ? { ...user, userHasRole: updatedUser.userHasRole } // Replace the roles
                    : user
            )
        );
        if (selectedUser?.id === updatedUser.id) {
            setSelectedUser((prevSelectedUser:User) => ({
                ...prevSelectedUser,
                userHasRole: updatedUser.userHasRole,
            }));
        }
    }

    const handleRoleToggle = (role: Role) => {
        setSelectedRoles((prev) =>
            prev.some((r) => r.id === role.id)
                ? prev.filter((r) => r.id !== role.id) // Remove if already selected
                : [...prev, role] // Add if not selected
        );
    };

    const handleChangeRoles = () => {
        // Logic to handle adding roles (e.g., making a request to the backend)
        api.patch(`${usersURL}/${selectedUser.id}/roles`,
            {
                userHasRoles: selectedRoles // Send the selected roles
            }, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            }
        )
        .then(res => {
            console.log(res);
            onRoleUpdate(res.data); // Call the parent or update function with new roles
            setSnackbarMsg("Roles actualizados");
        })
        .catch(error => {
            console.error(error);
            setSnackbarMsg(error.response.data.message);
        })
        .finally(() => {
            setSnackbarOpen(true);
            setShowChangeRolesDialog(false); // Close the dialog after updating roles
        });
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
                    <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
                        <DialogTitle>Rechazar cuenta</DialogTitle>
                        <DialogContent>
                            ¿Seguro que desea rechazar esta solicitud?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                                No
                            </Button>
                            <Button onClick={() => handleDelete(selectedUser?.id)} disabled={reason===""} variant="contained" color="primary">
                                Sí
                            </Button>
                            <TextField 
                            value={reason} 
                            label="Razón de rechazo"  
                            variant="standard"
                            onChange={(e) => setReason(e.target.value)}
                            multiline
                            rows={2}
                            />
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
                            {selectedUser?.isPending && (
                                <Button variant="contained" onClick={()=>setShowRejectDialog(true)} color="primary">Rechazar cuenta</Button>
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
                            <Button variant="contained" onClick={()=>{setShowChangeRolesDialog(true)}} color="primary">
                               Cambiar roles
                            </Button>        
                            <Button variant="contained" onClick={handleCloseEditDialog} color="primary">
                                Salir
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMsg}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarMsg.includes("Error")?"error":"success"} sx={{ width: '100%' }}>
                            {snackbarMsg}
                        </Alert>
                    </Snackbar>
                    <Button onClick={()=>setOpenNewTechDialog(true)}
                        variant="dark" 
                        sx={{
                            display: "flex",
                            position: 'fixed',
                            bottom: 0, // 16px from the bottom
                            zIndex: 100, // High zIndex to ensure it's on top of everything
                            height: "48px",
                            width: "50%",
                            maxWidth: "500px"
                        }}
                    >
                        <AddIcon sx={{fontSize: 40}}></AddIcon>
                        <Typography variant='subtitle1' color={"inherit"}>
                            Crear técnico
                        </Typography>
                        
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
                    <Dialog
                    open={showChangeRolesDialog}
                    onClose={() => setShowChangeRolesDialog(false)}
                    PaperProps={{ sx: { maxWidth: "500px", width: "95vw", }}}
                >
                    <DialogTitle>Cambiar roles del usuario {selectedUser?.name}</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                                {roles.map((role: Role) => (<div key={role.id}>
                                    <Box  sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                                        <FormControlLabel
                                            key={role.id}
                                            control={ 
                                                <Checkbox 
                                                    checked={selectedRoles.some(p => p.id === role.id)}
                                                    onChange={() => handleRoleToggle(role)}
                                                />
                                            }
                                            label={role.name}
                                        ></FormControlLabel>
                                    </Box>
                                    </div>
                                ))}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowChangeRolesDialog(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleChangeRoles}>Guardar</Button>
                    </DialogActions>
                </Dialog>
                    
            </Box>
        </Grid>
    )

}

export default UserList