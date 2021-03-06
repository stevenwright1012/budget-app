import React from 'react';
import './TransactionCard.css';
import {connect} from 'react-redux';
import {deleteTrans, editTrans, getTransactions} from '../../ducks/reducer';
import axios from 'axios';
import CurrencyInput from 'react-currency-input';

class TransactionCard extends React.Component{
    constructor(){
        super()

        this.state ={
            edit: false,
            payee: '',
            amountOG: 0,
            amountNew:0,
            envelopeOG:0,
            envelopeNew:0,
            statusOG: null,
            statusNew: null,
            note: ''
        }
        this.handleAmount =this.handleAmount.bind(this)
    }
    componentDidMount(){
        const {payee, amount, envelope, status, note} = this.props;
        this.refs.btn.removeAttribute("disabled");
        this.props.getTransactions(this.props.user.user_id)        
        this.setState({
            payee: payee,
            amountOG: amount,
            amountNew: amount,
            envelopeOG: envelope,
            envelopeNew: envelope,
            statusOG: status,
            statusNew: status,
            note: note
        })
    }
    componentDidUpdate(){
        this.refs.btn.removeAttribute("disabled");
    }
    handleEdit(){
        this.setState({
            edit: true
        })
    }
    handleCancel(){
        this.setState({
            edit: false
        })
    }
    handlePayee(e){
        this.setState({
            payee: e
        })
    }
    handleAmount(e, mask, float){
        this.setState({
            amountNew: float
        })
    }
    handleEnvelopeNew(e){
        this.setState({
            envelopeNew: e
        })
    }
    handleStatusTrue(){
        this.setState({
            statusNew: true
        })
    }
    handleStatusFalse(){
        this.setState({
            statusNew: false
        })
    }
    handleNote(e){
        this.setState({
            note: e
        })
    }
    delete(id, amount, envelope, status){
        this.refs.btn.setAttribute("disabled", "disabled");  
        this.props.deleteTrans(id, amount, envelope, status)
    }
    saveChanges(){
        this.refs.btn.setAttribute("disabled", "disabled");  
        const {payee, amountOG, amountNew, envelopeOG, envelopeNew, statusOG, statusNew, note} = this.state
        axios.put('/api/edit', {
            trans_id: this.props.id,
            payee: payee,
            amountOG: +amountOG,
            amountNew: +amountNew,
            envelopeOG: +envelopeOG,
            envelopeNew: +envelopeNew,
            statusOG: statusOG,
            statusNew: statusNew,
            note: note
        }).then(res => {
            this.props.editTrans(res.data)
            this.props.getTransactions(this.props.user.user_id);     
            // window.location.reload();
            this.setState({
                edit: false,
            })
        })
    }
    render(){
        
        const {id, payee, amount, envelope, name, status, note} = this.props;

        var pending = '';
        if(status){
            pending = 'Cleared'
        }
        else{
            pending = "Pending"
        }
        var source = ''
        var sign = null
        if(amount<0){
            source = 'Payee'
            sign = '-'
        }
        else{ source = 'Source'}

        var userEnvelopes = null;
        if(this.props.envelopes){
            userEnvelopes = this.props.envelopes.map((enve, i) => {
                return <option key={i} value={+enve.id}>{enve.name}</option>
            })
        }


        return (
            <div className="tran_card">
                {
                    !this.state.edit
                ?
                    <div id={this.props.styles} className="tran_content">
                        <h4>
                            {payee}
                        </h4>
                        <p>
                                <u>
                                    Amount: 
                                </u>
                                &nbsp; {sign}${Math.abs(+amount).toFixed(2)}
                            </p>
                        <div className="info" >
                            
                            <div className="info-content" >
                            <p>

                                <u>
                                    Envelope:
                                </u>
                                &nbsp;{name}
                            </p>
                            </div>
                            <div className="info-content" >
                                <p>
                                    <u>
                                        Status: 
                                    </u>
                                    &nbsp;{pending}
                                </p>
                            </div>
                            <div className="info-content">
                                <p>
                                    <u>
                                        Note: 
                                    </u>
                                    &nbsp;{note}
                                </p>
                            </div>
                        </div>
                        <div className='trans_card_butts'>
                            <button  ref="btn" className="trans_card_button"
                            onClick={() => this.delete(id, amount, envelope, status)}>Delete</button>
                            <button className="trans_card_button"
                            onClick={() => this.handleEdit()}>Edit</button>
                        </div>
                    </div>
                :
                <div id={this.props.styles} className="tran_content" >
                    <p>
                        {source}: <input className="trans_card_input"
                        type="text" value={this.state.payee} onChange={(e) => this.handlePayee(e.target.value)}/>
                    </p>
                        <p>Amount: <CurrencyInput className="trans_card_input"
                                    value={this.state.amountNew} 
                                    onChangeEvent={this.handleAmount}
                                    prefix="$"
                                    /></p>
                        <p>
                        Envelope: 
                        <select className="trans_card_dropdown"
                        name="envelopes" 
                        value={this.state.envelopeNew} 
                        onChange={(e) => this.handleEnvelopeNew(e.target.value)}>
                            <option value={this.state.envelopeOG}>{name}</option>
                            {userEnvelopes}
                        </select>
                        </p>
                        <p className="trans_card_radio">
                            <label >
                                <input type="radio" name='status' onClick={() => this.handleStatusTrue()}/>
                                Cleared
                            </label>
                            <label>
                                <input type="radio" name='status' onClick={() => this.handleStatusFalse()}/>
                                Pending
                            </label>
                        </p>
                        <p className="trans_card_note_container">
                            <textarea  className="trans_card_note"
                            cols="20" rows="2"  
                            value={this.state.note} 
                            onChange={(e) => this.handleNote(e.target.value)}>
                            </textarea>
                        </p>
                        <div className='trans_card_butts'>
                            <button className="trans_card_button" ref="btn"
                            onClick={() => this.saveChanges()}>Save Changes</button>
                            <button className="trans_card_button"
                            onClick={() => this.handleCancel()}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user,
        envelopes: state.envelopes
    }
}

export default  connect(mapStateToProps, {deleteTrans, editTrans, getTransactions})(TransactionCard);