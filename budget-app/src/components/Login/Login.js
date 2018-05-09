import React from 'react';
import './Login.css'

export default  function Login(){
    return (
        <div className='login'>
            <h1>Welcome to ONvelope!</h1>
            <div className="logo_container">
                <img src="./icons/Onvelope.png" alt="" className="login_logo"/>
            </div>
            <h2>The best way to get ON top of you finances</h2>
            <h3>To get started, click  
                <a href='http://localhost:3005/auth'>
                    LOGIN
                </a>
            </h3>
            <div id="atribute">
                Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
            </div>
        </div>
    )
}