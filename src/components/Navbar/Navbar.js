import React, {useState, useEffect} from 'react';
import classes from '../../CSS/Main.module.css'
import Logo from '../../Assets/Navbar/Logo.png'
import Progress from './LoadingElem';
import {NavLink} from 'react-router-dom';
import fire from '../Login/fire';

const Navbar = props => {
    const [user, setUser] = useState('');
    const [loadState, setloadState] = useState({
        loadprog: 0,
        opacity: 0
        
    });
    
    const LoadPage = () =>{
        setloadState({
            loadprog: 0,
            opacity: 0
        })
        setTimeout(() =>{
            setloadState({
                loadprog: 70,
                opacity: 1
            })
        },50)
        setTimeout(() =>{
            setloadState({
                loadprog: 100,
            })
        },300)
        setTimeout(() =>{
            setloadState({
                loadprog: 101,
                opacity: 0
            })
        },1500)
        setTimeout(() =>{
            setloadState({
                loadprog: 0,
            })
        },1700)
         
    }
    const logOutHandler = () => {
        console.log()
        fire.auth().signOut();
        setUser('');
        LoadPage();
    }
    const authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                
            }
            else {
                setUser('');
            }
        })
    }
    useEffect(()=>{
        LoadPage();
        authListener();
    },[])
    
    return(
       <main className={classes.Navbar}>
            <nav className={classes.NavbarBody}>
                <span><img className={classes.Logo} src={Logo} alt="Logo"></img></span>
                <ul className={classes.NavButtons}>
                    <li className={classes.NavButton}>
                            <span onClick={LoadPage}><NavLink to="/Game">PLAY</NavLink></span></li>
                    <li className={classes.NavButton}>
                        <span onClick={LoadPage}><NavLink to="/Rankings">RANKINGS</NavLink></span></li>
                </ul>
                <ul className={classes.NavButtonLogin}>
                    { user?(<li className={classes.NavButton}>
                            <NavLink onClick={logOutHandler} to="/Login">{user.email.split('@')[0].toUpperCase()}  LOGOUT</NavLink></li>)
                        :(
                        <li className={classes.NavButton}>
                            <NavLink onClick={LoadPage} to="/Login">LOGIN</NavLink></li>
                        )}
                </ul>
            </nav>
            <Progress opacity={loadState.opacity} complete={loadState.loadprog} loadbar={loadState.loadprog}/>
        </main> 
    )
};
export default Navbar;