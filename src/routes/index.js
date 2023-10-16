import config from '../config/index'

//pages
import Train from '../pages/Train'
import Room from '../pages/Room'
import Chair from '../pages/Chair'
import Ticket from '../pages/Ticket'
import Customer from '../pages/Customer'

const PublicRoute = [
    { path: config.routes.train, componet: Train },
    { path: config.routes.room, componet: Room },
    { path: config.routes.chair, componet: Chair },
    { path: config.routes.ticket, componet: Ticket },
    { path: config.routes.customer, componet: Customer }
]

const privateRoutes = []

export {PublicRoute,privateRoutes}