import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = { numJokesToGet: 5 }
  constructor(props) {
    super(props);

    this.state = { jokes: [] }
    this.generateNewJokes = this.generateNewJokes.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {

    let j = this.state.jokes;
    console.log(j);

    let seenJokes = new Set();

    try {
      while (j.length < this.props.numJokesToGet) {

        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: {
            Accpet: "application/json"
          }
        });
        console.log(`RESPONSE ${res}`);
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 })
        }
        else {
          console.error("Duplicate Found")
        }

        this.setState({ j });
      }
    } catch (error) {
      console.log(error);
    }
  }

  vote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    }));
  }

  generateNewJokes() {
    this.setState({ jokes: [] })
  }

  render() {


    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);


    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>
        {sortedJokes.map(j => (
          <Joke text={j.text} id={j.id} key={j.id} votes={j.votes} vote={this.vote} />
        ))}
      </div>
    )
  }
}


export default JokeList;
