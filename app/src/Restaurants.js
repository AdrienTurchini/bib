import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom"
  import Img from 'react-image'


import listOfPhone from "./listOfPhone";
import listOfNameCity from "./listOfNameCity";
import './bulma.min.css'

import logoBib from './Michelin_Bib_Gourmand.png'
import logoMr from './logo-maitre-restaurateur.png'



   

class Restaurants extends Component {
    
    render() {

        return (
            
            <div>
                <section class="hero is-primary is-bold">
                            <div class="hero-body">
                                <div class="container">
                                    <h1 class="title">
                                        EatWell - by Adrien Turchini
                                    </h1>
                                    <h2 class="subtitle">
                                        You can find every French restaurants which have both the Bib Gourmand certification from Michelin and Maître Restaurateurs certification from the French State.
                                    </h2>
                                    <h2 class="subtitle">
                                        Click on a name to get redirected to the Michelin website of the restaurant
                                    </h2>
                                </div>
                            </div>
                </section>
                        
                        <section class="section has-background-grey-lighter">
                        
                            <div class="container center">
                                <div class="column is-half is-vcentered is-centered">
				                    {listOfPhone.sort((a, b)=> a.name > b.name).map((restauDetail, index) => {
                                        return (
                                            <div class="notification has-background-grey-dark ">
                                                <Router>
                                                    <a style={{ color: 'inherit', textDecoration: 'inherit'}} href={restauDetail.link} >
                                                <h1 class="title has-text-danger is-size-4 center">{restauDetail.name}</h1>
                                                </a>
                                                </Router>
                                                <p class="center has-text-grey">-</p>
                                                <p class="is-size-6 center has-text-white">{restauDetail.phone}</p>
                                                <p class="is-size-7 center has-text-white">{restauDetail.address}</p>
                                            </div>
                                        )
                                    })}
                                    {listOfNameCity.sort((a, b)=> a.name > b.name).map((restauDetail, index) => {
                                        return (
                                        <div class="notification has-background-grey-dark">
                                            <Router>
                                            <a style={{ color: 'inherit', textDecoration: 'inherit'}} href={restauDetail.link} >
                                            <h1 class="title has-text-danger is-size-4 center">{restauDetail.name}</h1>
                                            </a>
                                            </Router>
                                            <p class="center has-text-grey">-</p>
                                            <p class="is-size-6 center has-text-white">{restauDetail.phoneBib !== "no phone" && restauDetail.phoneBib} {restauDetail.phoneMr !== "no phone" && " / "} {restauDetail.phoneMr !== "no phone" && restauDetail.phoneMr} </p>
                                            <p class="is-size-7 center has-text-white">{restauDetail.address}</p>
                                        </div>
                                        )
                                    })}
                                    
                                </div>
                                <div class="column is-centered center">
                                <img class="banner" src={logoBib}/>
                                <img class = "banner2" src={logoMr}/>
                                </div>
                            </div>
                        </section>
            </div>
        );
    }
}
 


export default Restaurants



