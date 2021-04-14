import React from "react";
import "./Recs.css";

const Recs = props => {


  return (
    <div className="App">
      <div className="main-div">
        {props.danceability > 0.5
        ? <p> You should listen to more upbeat songs! </p>
        : <p> You should listen to slow songs! </p>
        }
        {props.item.id == "2pn8dNVSpYnAtlKFC8Q0DJ"
        ? <p> also wow you have good taste in music</p>
        : <p> boo </p>
        }
      </div>
    </div>
  );
}

export default Recs;