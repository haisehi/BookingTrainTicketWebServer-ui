import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

import {PublicRoute} from './routes'
import mainLayout from './layout/mainLayout';
import LoginLayout from './layout/loginLayout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {PublicRoute.map((route,index) =>{
            const Page = route.componet
            let Layout = mainLayout
            if(route.layout){
              Layout=route.layout
            }
            else if(route.layout === LoginLayout){
              Layout = route.LoginLayout
            }
            return(
              <Route key={index} 
              path={route.path} 
              element={
              <Layout>
                <Page/>
              </Layout>
              }/>
            )
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
