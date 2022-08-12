import logo from './logo.svg';
import './App.css';
import './AppRes.css';
import Navbar from './Components/Navbar/Navbar';
import { Routes, Route, useNavigate , Navigate} from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Provider } from 'react-redux';
import { MyStore } from './Redux/StoreConfig';
import  jwtDecode  from 'jwt-decode'
import { useState, useEffect } from 'react';

function App() {

    function ProtectedRoute(props)
    {
        if(localStorage.getItem("noteToken"))
        {
            return props.children;
        }
        else
        {
            return <Navigate to='/login' />
        }
    }
    function ProtectedLogin(props)
    {
        if(!(localStorage.getItem("noteToken")))
        {
            return props.children;
        }
        else
        {
            return <Navigate to='/home' />
        }
    }

    let navigate = useNavigate();
    const [crrUser, setCrrrUser] = useState(null);
    function currentUser()
    {
        let user = jwtDecode(localStorage.getItem("noteToken"));
        setCrrrUser(user);    
    }
    function removeUser()
    {
        setCrrrUser(null);
        localStorage.removeItem("noteToken");
        navigate('/login');
    }

    useEffect( () => {
        if(localStorage.getItem("noteToken"))
        {
            currentUser();
        }
        else
        {
            removeUser();
        }
    },[])
    const particlesInit = async (main) => {
        // console.log(main);

        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
    };

    const particlesLoaded = (container) => {
        // console.log(container);
    };
    return <>
    {
        !crrUser ?
        <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                    color: {
                        value: "#1F2833",
                    },
                    },
                    fpsLimit: 120,
                    interactivity: {
                    events: {
                        onClick: {
                        enable: false,
                        mode: "push",
                        },
                        onHover: {
                        enable: true,
                        mode: "bubble",
                        "parallax" :{
                            "enable" : true,
                            "force" : 5,
                            "smooth" : 50,
                        }
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                        quantity: 4,
                        },
                        repulse: {
                        distance: 500,
                        duration: 0.4,
                        },
                    },
                    },
                    particles: {
                    color: {
                        value: "#666666",
                    },
                    links: {
                        color: "#666666",
                        distance: 140,
                        enable: true,
                        opacity: 0.5,
                        width: 3,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                        default: "bounce",
                        },
                        random: true,
                        speed: 3,
                        straight: true,
                    },
                    number: {
                        density: {
                        enable: true,
                        area: 600,
                        },
                        value: 50,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                    },
                    detectRetina: true,
                }}
                
            />
        : ''

    }
    
    <Provider store={MyStore}>
        <Navbar crrUser = {crrUser} removeUser = {removeUser}/>
        <Routes>
                <Route path = '/' element = {<ProtectedLogin> <Login currentUser = {currentUser}/> </ProtectedLogin>} />
                <Route path= 'home' element = {<ProtectedRoute><Home crrUser = { crrUser }/> </ProtectedRoute>}/>
                <Route path= 'login' element = {<ProtectedLogin> <Login currentUser = {currentUser}/> </ProtectedLogin>}/>
                <Route path= 'signup' element = {<ProtectedLogin> <Signup/> </ProtectedLogin> }/>
                
        </Routes>
    </Provider>

</>
}

export default App;
