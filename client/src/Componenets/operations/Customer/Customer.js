// Customer.js
import { useState } from "react";
import History from "./History/History";
import Profile from "./Profile/Profile";
import { useProfileContext } from "./ProfileContext";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../../TokenContext";
import styles from './Customer.module.css';

function Customer() {
   const { token, setToken } = useToken();
    const { profileId, setStatus } = useProfileContext();
    const [profile, setProfile] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const navigate = useNavigate();
 

   const showProfile = async () => {
    if (!profileId && !token ) {
        console.log("Empty profileId");
        setStatus(false);
        return;
    }
    try {
        const response = await fetch(` https://furniture-management-system-1.onrender.com/api/user/${profileId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errMsg = await response.text();
         
            console.error("Failed to fetch profile:", errMsg);
            return;
        }

        const data = await response.json();

        // Defensive check
        if (!data.user) {
            console.error("No user data in response", data);
            return;
        }

        setName(data.user.name);
        setEmail(data.user.email);
        setPhonenumber(data.user.phonenumber);
        setProfile("Profile");
    } catch (e) {
        console.error("Error in showProfile:", e);
    }
};

    const showOrders = () => {
        setProfile("History");
    };

    const handleLogout = () => {
        setStatus(false);
        navigate("/");
       
setToken(null);  // Clears from state and localStorage

    };

    return (
        <div className={styles.customerContainer}>
            <h1>Customer Details</h1>
            <div className={styles.sidebar}>
                <div className={styles.btnsCustomer}>
                    <button onClick={showProfile}>Profile</button>
                </div>
                <div className={styles.btnsCustomer}>
                    <button onClick={showOrders}>History</button>
                </div>
                <div className={styles.btnsCustomer}>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
            <div className={styles.userDetails}>
                {profile === "Profile" && <Profile name={name} email={email} phonenumber={phonenumber} />}
                {profile === "History" && <History />}
            </div>
        </div>
    );
}

export default Customer;
