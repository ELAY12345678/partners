import React, { Component } from 'react';
 

class Field extends Component {
  state = {
    namefield : '',
    contenido : '',
    columnas : ''
  }


  constructor(props){
    super(props);
    //console.log(props);

    /*this.setState({
      namefield:this.props.namefield,
      contenido:this.props.contenido,
      columnas:2
    });*/
  }
  
  render() {
    
      this.state.namefield = this.props.namefield;
      this.state.contenido = this.props.contenido;
      this.state.columnas = this.props.columnas;

      var none = "dnone";
      var colmodelo = 2;
      var contenido = "";
      var signo = "";
      var signosq = "";

      //var arr_protype_sqft = ['Approx Sqft Total Area','Property SqFt','Sq Ft Occupied','Sq Ft Total','Aprox Size'];
      
      var arr_sqft = ["Approximate Lot Size","SqFt Liv Area","Lot Sq Footage","Property SqFt","Aprox Size","ApproximateLotSize"];
      var arr_money = ["Tax","LP$/SqFt","Insurance Expense","Price/Unit","Total Move In Dollars"];
      //var arr_no_money = ["Tax Year","Inc/Exp Statement Period","Year Established","Year Built"];

      if(this.state.columnas === 1){
        colmodelo = "col-md-12 col-xs-12";
      }

      if(this.state.columnas === 2){
        colmodelo = "col-md-6 col-xs-12";
      }

      if(this.state.contenido === "0" || this.state.contenido === "No Data" || this.state.contenido === "No D" || this.state.contenido === "No Da"  || this.state.contenido === "No Dat" || this.state.contenido === "No" || this.state.contenido === "No " || this.state.contenido === "" || this.state.contenido === "N" || this.state.contenido === "0.0000" || this.state.contenido === "0.00"){
        none = "dnone";
      }else{
        none = "";
      }


      if(isNaN(this.state.contenido)){ // es string
        contenido = this.state.contenido;
      }else{ // es integer
        if(this.in_array(this.state.namefield,arr_sqft)){
            signosq = " Sqft"; 
            console.log(this.state.namefield+' es sqft');
            contenido = this.formatNumber(this.state.contenido);
        }else{

          if(this.in_array(this.state.namefield,arr_money)){
              signo="$";
              contenido = this.formatNumber(this.state.contenido);
          }else{
            if(this.state.namefield === "Stories"){
                signo="";
                contenido = parseInt(this.state.contenido);
            }else{
                signo="";
                contenido = this.state.contenido;
            }
              
          }
        }  
      }

      /*if(this.state.namefield == "List Date"){
        var datcon = this.state.contenido;
        contenido = datcon.replace(" 00:00:00", "");
      }*/


      return (
        <div className={none}>
        <li className={colmodelo}><div style={{'display':'table-cell','paddingRight':4+'px'}}>{this.state.namefield}:</div><div style={{'display':'table-cell','textAlign':'left','paddingLeft':10+'px'}}>{signo}{contenido}{signosq}</div></li>
        </div>
      );
  }

  formatNumber (num){

        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  in_array(needle, haystack) {

        for(var i in haystack) {
            if(haystack[i] === needle) return true;
        }
        return false;
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.contenido !== this.props.contenido) {
      this.setState({
        namefield:this.props.namefield,
        contenido:this.props.contenido,
        columnas:this.props.columnas
      });
    }
    //console.log(this.state);
  }

}
 
export default Field;