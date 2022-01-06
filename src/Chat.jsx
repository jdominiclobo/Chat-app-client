import React, {useState} from 'react'

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    useMutation,
    gql
  } from "@apollo/client";
  import { Container, Row, Col, FormInput, Button } from 'shards-react'; 

  const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
  });

  const GET_MESSAGES = gql`
    query {
        messages {
            id
            content
            user
        }
    }
  `
    const POST_MESSAGE = gql`
        mutation($user:String!, $content:String!) {
            postMessage(user: $user, content: $content)
        }
    `


  const Messages = ({ user }) => {
      const { data } = useQuery(GET_MESSAGES, {
        pollInterval: 500,
      })
      if(!data) {
          return null
      }
    //   return JSON.stringify(data)
    return (
        <>
            {data.messages.map(({ id, user: messageUser, content }) => (
                <div style={{ display: "flex", 
                justifyContent: user == messageUser ? "flex-end" : "flex-start", 
                paddingBottom: "1rem" }}
                >
                    {user !== messageUser && (
                        <div 
                            style={{
                                height:40,
                                width:40,
                                marginRight: "0.5em",
                                border: "3px solid #e5e6ea",
                                borderRadius: 25,
                                textAlign: "center",
                                fontSize: "12pt",
                                paddingTop:5
                            }}
                        >
                            {messageUser.slice(0,2).toUpperCase()}
                        </div>
                    )}
                    <div style={{ background: user == messageUser? "#80ff72" : "#0cbaba",
                            color: user == messageUser ? "white" : "black",
                            padding: '1em',
                            borderRadius: '1em',
                            maxWidth: "60%" 
                    }}
                    >
                        {content}  
                    </div>
                </div>
            ))}
        </>
    )
  }


  const Chat = () => {
      const [state, stateSet] = useState({
          user: "joe",
          content: ""
      })

      const [postMessage] = useMutation(POST_MESSAGE)

      const handleSend = () => {
          if(state.content.length > 0) {
            postMessage({
                variables: state
            })
          }
          stateSet({
              ...stateSet,
              content: ""
          })
      }

      return (
          <Container>
              <Messages user={state.user} />
                <Row>
                    <Col xs={2} style={{padding: 0}}>
                        <FormInput 
                            label="User"
                            value={state.user}
                            onChange={(e) => stateSet({
                                ...state,
                                user: e.target.value
                            })}
                        />
                    </Col>
                    <Col xs={8} style={{padding: 0}}>
                        <FormInput 
                            label="User"
                            value={state.content}
                            onChange={(e) => stateSet({
                                ...state,
                                content: e.target.value
                            })}
                            onKeyUp={(e) => {
                                if(e.keyCode == 13){
                                    handleSend()
                                }
                            }}
                        />
                    </Col>
                    <Col xs={2} style={{padding: 0}}>
                        <Button onClick={() => handleSend()}>
                            Send
                        </Button>
                    </Col>
                </Row>
          </Container>
      )
  }

  export default () => (
      <ApolloProvider client={client}>
          <Chat />
      </ApolloProvider>
  )