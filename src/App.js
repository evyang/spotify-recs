import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Recs from "./Recs";
import Player from "./Player";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }],
          id: "",
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
      },
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
      danceability: 0,
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.getCurrentFeatures = this.getCurrentFeatures.bind(this);
    this.tick = this.tick.bind(this);
  }



  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
      this.getCurrentFeatures(_token);
    }

    // set interval for polling every 5 seconds
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
      this.getCurrentFeatures(this.state.token);
    }
  }


  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }

        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  getCurrentFeatures(token) {
    $.ajax({
      url: "https://api.spotify.com/v1/audio-features/" + this.state.item.id,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if data is not empty
        if (!data) {
          this.setState({
            no_data: true,
          });
          return;
        }

        this.setState({
          danceability: data.danceability,
          no_data: false

        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-h1">Now Playing</h1>
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && !this.state.no_data && (
            <div>
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />
            <Recs
              danceability={this.state.danceability}
              item={this.state.item}
            /></div>
          )}
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}

      
        </header>
      </div>
    );
  }
}

export default App;