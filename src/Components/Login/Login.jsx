import React, { useEffect, useState } from 'react'
import Joi from 'joi';
import $ from 'jquery';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Login({currentUser}) {
    
    let navigate = useNavigate();
    //Data
    const [apiFlag, setApiFlag] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password:'',
    });
    const [ErrList, setErrList] = useState([]);
    const [APIRes, setAPIRes] = useState(null);

    //Functions
    function getUser(e)
    {
        let newUser = {...user};
        let data = e.target.value;
        newUser[e.target.id] = data;
        setUser(newUser);
        checkInputs(newUser , e);
    }
    function checkInputs(newUser , e)
    {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        })
        let joiResponse = schema.validate(newUser , {abortEarly: true});
        if(joiResponse.error)
        {
            $(".saveData").attr("disabled" , true);
            $(".saveData").addClass("button-disabled");
            let errors = joiResponse.error.details;
            setErrList( joiResponse.error.details );
            
            if(errors[0].context.label == e.target.id)
            {
                $(e.target).next().next().addClass("fa-xmark");
                $(e.target).next().next().removeClass("fa-check");
                $(e.target).addClass("checked-wrong");
                $(e.target).removeClass("checked-right");
            }
            else
            {
                $(e.target).next().next().addClass("fa-check");
                $(e.target).next().next().removeClass("fa-xmark");
                $(e.target).addClass("checked-right");
                $(e.target).removeClass("checked-wrong");
            }
            
        }
        else
        {
            $(".saveData").attr("disabled" , false);
            $(".saveData").removeClass("button-disabled");
            $("input").next().next().addClass("fa-check");
            $("input").next().next().removeClass("fa-xmark");
            $("input").addClass("checked-right");
            $("input").removeClass("checked-wrong");
            setErrList([]);
        }
    }
    function getError(key)
    {
        for (const error of ErrList) {
            if(error.context.key == key)
            {
                return error.message;
            }
        }
        return '';
    }
    async function checkAPI(e)
    {
        setApiFlag(true);
        e.preventDefault();
        let { data } = await axios.post('https://route-egypt-api.herokuapp.com/signin' , user);
        if(data.message != "success")
        {
            setApiFlag(false);
            setAPIRes(data.message);
        }
        else
        {
            localStorage.setItem('noteToken' , data.token);
            currentUser();
            setApiFlag(false);
            setAPIRes(null);
            navigate('/home');
        }
    }
    
return <>
    <div className="sign-up-page d-flex align-items-center">
        <div className="Signup d-flex align-align-items-center  mx-auto w-100">
            <div className="register-form w-50 mx-auto">
                <form onSubmit={checkAPI}>
                    <div className="container">
                    <div className="row">
                        <div className="col-md-12 position-relative">
                            <div className="floating-label-group">
                                <input autoComplete="off" autoFocus required onChange={getUser} typeof="text"  className='form-control' id='email'/> <label className="floating-label">Email</label> <i className="fa-solid position-absolute"></i> <p className='text-danger wrong-input mb-2' id='email'>{getError('email')}</p>
                            </div>
                        </div>
                        <div className="col-md-12 position-relative">
                            <div className="floating-label-group mt-3">
                                <input autoComplete="off" autoFocus required onChange={getUser} type="password"  className='form-control' id='password'/> <label className="floating-label">Password</label> <i className="fa-solid position-absolute"></i> <label className="floating-label">Password</label> <p className='text-danger wrong-input mb-2' id='password'>{getError('password')}</p>
                            </div>
                        
                        </div>
                        
                        <div className="position-relative col-md-12 mt-2">
                        {apiFlag?<button typeof='submit' className='btn w-100 btn-info saveData btnMain'> Waiting... </button> : <button typeof='submit' className='btn w-100 btn-info my-2 saveData btnMain'> Log in </button>}
                            
                        </div>
                        {
                            APIRes? <div className="col-md-12">
                            <p className='text-danger'> { APIRes } </p>
                        </div> : ''
                        }
                        
                    </div>
                    </div>
                    
                    
                
                </form>
            </div>
        </div>
    </div>
</>
}
