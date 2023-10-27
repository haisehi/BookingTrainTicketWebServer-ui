import config from '../config/index'

import LoginLayout from '../layout/loginLayout'

//pages
import Train from '../pages/Train'
import Room from '../pages/Room'
import Station from '../pages/Station'
import Ticket from '../pages/Ticket'
import Customer from '../pages/Customer'
import Login from '../pages/Login'
import Register from '../pages/Register'

const PublicRoute = [
    { path: config.routes.login, componet: Login ,layout: LoginLayout },
    { path: config.routes.register, componet: Register ,layout: LoginLayout },
    { path: config.routes.train, componet: Train },
    { path: config.routes.room, componet: Room },
    { path: config.routes.station, componet: Station },
    { path: config.routes.ticket, componet: Ticket },
    { path: config.routes.customer, componet: Customer }
]

const privateRoutes = [

]

export {PublicRoute,privateRoutes}