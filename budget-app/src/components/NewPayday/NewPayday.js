import React, {Component} from 'react';
import Nav from '../Nav/Nav';
import {connect} from 'react-redux';
import PaydayEnvelope from '../PaydayEnvelope/PaydayEnvelope';
import {addTrans, redirectFalse, getUser} from '../../ducks/reducer';
import './NewPayday.css'
import CurrencyInput from 'react-currency-input';


class NewPayday extends Component{
    constructor(){
        super()

        this.state ={
            amount:0,
            depoEnvelopes: []
        }
    this.calculateTotal = this.calculateTotal.bind(this);
    this.handleAmount = this.handleAmount.bind(this);
    }
    componentDidMount(){
        window.scrollTo(0, 0);
        this.props.redirectFalse();
        this.props.getUser()
        var arr = this.props.envelopes.map(env => {
            let {id, name, type} = env
            var envObj ={
                id: id,
                amount: (+this.props.payday[id]),
                name: name,
                type: type,
            }
            return envObj
        })
        this.setState({
            amount: (+this.props.payday.amount).toFixed(2),
            depoEnvelopes: arr
        })
    }
    handleAmount(e, mask, float){
        console.log(this.state);
        
        this.setState({
            amount: float
        })
    }
    calculateTotal(obj){
        console.log(this.state);
        
        var filtArr = this.state.depoEnvelopes.filter( env => env.id !== obj.id);
        
        var newArr = [...filtArr, obj];
        
        this.setState({
            depoEnvelopes: newArr,
        })

    }
    submitToTrans(){
        var date = new Date();
        var month = date.getMonth() +1;
        var day = date.getDate();
        var year = date.getFullYear();
        let subtractor = this.state.depoEnvelopes.reduce((prev, next) => {
            return prev + next.amount
        },0)
        if(this.state.amount - subtractor === 0){
            this.refs.btn.setAttribute("disabled", "disabled");
            for(let i=0; i< this.state.depoEnvelopes.length; i++){
                let obj = this.state.depoEnvelopes[i]
                if(obj.amount){
                    this.props.addTrans(`Paycheck ${month}/${day}/${year}`, (obj.amount*-1), obj.id, true, `Paycheck submited on ${month}/${day}/${year}`)
                }
            }
        }
        else{
            alert("Every dollar must be assigned to an envelope before you can submit")
        }
    }
    componentDidUpdate(){
        if(this.props.redirect){
            setTimeout(() => {this.props.history.push('/transactions')}, 2000)
        }
    }
    render(){
        let subtractor = this.state.depoEnvelopes.reduce((prev, next) => {
            return prev + next.amount
        },0)
        let enevlopeRows = this.props.envelopes.map( (envelope, i) => {
            let {id, name, type, amount} = envelope;
            if(!type){
                return null
            }
            return (
                <div className="payday_envelope">
                    <PaydayEnvelope
                    key={i}
                    id={id}
                    name={name}
                    type={type}
                    amount={+amount}
                    budgetedAmount={+this.props.payday[id]}
                    totalFn={this.calculateTotal}
                    />
                </div>
            )
        }) 
        
        let sign = null
        if((+this.state.typicalPay - subtractor) < 0){
            sign = '-'
        }     
        return(
            <div className='payday_container'>
                <Nav />
                <div className="payday_main">
                    <div className="payday_fixed">
                        <h1>New Payday</h1>
                        <hr className='line'/>
                        <label>
                            Paycheck Amount: &nbsp;
                            <CurrencyInput className="payday_input"
                                value={this.state.amount} 
                                placeholder="$0.00"
                                onChangeEvent={this.handleAmount}
                                prefix="$"
                                />
                        </label>
                        <br/>
                        Unbudgeted: {sign}${Math.abs(this.state.amount - subtractor).toFixed(2)}
                        <hr className='line'/>
                    </div>
                    <div className='payday_cards'>
                        {enevlopeRows}
                        <br/>
                        <button className="depo_button" ref="btn"
                        onClick={() => this.submitToTrans()}>Send To Transactions</button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user,
        envelopes: state.envelopes,
        payday: state.payday,
        redirect: state.redirect 
    }
}

export default connect(mapStateToProps, {addTrans, redirectFalse, getUser})(NewPayday);