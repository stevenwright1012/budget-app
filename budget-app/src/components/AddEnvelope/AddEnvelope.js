import React, {Component} from 'react';
import Nav from '../Nav/Nav';
// import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';


class AddEnvelope extends Component{
    constructor(){
        super()

        this.state={
            name: '',
            type: ''
        }
    }
    AddNewEnvelope(){
        if(!this.state.name || !this.state.type){
            alert("Finish entering information")
        }
        else{
            axios.post('/api/addenvelope', {
                user_id: this.props.user.user_id,
                name: this.state.name,
                type: this.state.type
            }).then(res => {
                this.props.history.push('/dashboard')
            })
        }
    }
    handleName(e){
        this.setState({
            name:e,
        })
    }
    handleType(e){
        this.setState({
            type: e
        })
    }
    render(){
        return(
            <div className='main'>
                <Nav />
                <div>
                    <h1>Add Envelope</h1>
                    <input type="text" placeholder='Envelope Name' value={this.state.name} onChange={(e) => this.handleName(e.target.value)}/>
                    <br/>
                    <select name="types" value={this.state.type} onChange={(e) => this.handleType(e.target.value)}>
                        <option value=''>Select Envelope Type</option>                 
                        <option value="Debt">Debt</option>
                        <option value="Everyday">Everyday spending</option>
                        <option value="Monthly bill">Monthly bill</option>
                        <option value="Saving">Saving</option>
                    </select>
                    <br/>
                    <button onClick={() => this.AddNewEnvelope()}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(AddEnvelope);