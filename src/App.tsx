import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Fallback from "./comps/Fallback";
import "semantic-ui-css/semantic.min.css";
import "tailwindcss/dist/tailwind.min.css";
import "./lib/rollbar";
import "./index.css";

const Home = React.lazy(() => import("./pages/Home"));
const SyncSimple = React.lazy(() => import("./pages/SyncSimple"));
const SyncAdvanced = React.lazy(() => import("./pages/SyncAdvanced"));
const Eula = React.lazy(() => import("./pages/Eula"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Fallback />}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/sync-simple" component={SyncSimple} />
          <Route path="/sync-advanced" component={SyncAdvanced} />
          <Route path="/eula" component={Eula} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
