import React, { useEffect, useState } from 'react';
import api from '../api';
import { Badge } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const UserPendingCount: React.FC<{height?: string, width?:string}> = ({height="100%", width="100%"}) => {
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const currentUserId = window.sessionStorage.getItem("id") || window.localStorage.getItem("id")
    const [pendingCount, setPendingCount] = useState(0)
    const userCountURL = "/users"
    const queryParams = "?pending=true&count=true"
    
    useEffect(() => {
        if (currentUserId){
            api.get(`${userCountURL}${queryParams}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(res => {
                setPendingCount(res.data.count)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
        }
        
    }, []);

    return ( 
        <Badge
            badgeContent={pendingCount}
            color={pendingCount > 0 ? "warning" : "default"} // red if count > 0, grey otherwise
            overlap="circular"
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <AccountCircleRoundedIcon color={"primary"} sx={{width: width, height: height}}/>
        </Badge> 
    )
}

export default UserPendingCount;