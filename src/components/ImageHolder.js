import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import {
  Button,
  Card,
  Grid,
  Container,
  Image,
  CardContent,
} from 'semantic-ui-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore'
import ModelComponent from './ModelComponent'

const Home = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({})
  //   const navigate = useNavigate()

  const handleModel = (item) => {
    setOpen(true)
    setUser(item)
  }
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure that you want to delete this image?')) {
      try {
        setOpen(false)
        await deleteDoc(doc(db, 'Images', id))
        setUsers(users.filter((user) => user.id !== id))
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    const unsub = onSnapshot(
      collection(db, 'Images'),
      (snapshot) => {
        let list = []
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() })
        })
        setUsers(list)
        setLoading(false)
      },
      (error) => {
        console.log(error.message)
      }
    )
    return () => {
      unsub()
    }
  }, [])
  return (
    <Container>
      <Grid columns={5} stackable>
        {users &&
          users.map((item) => (
            <Grid.Column key={item.id}>
              <Card>
                <Card.Content>
                  <Image
                    src={item.img}
                    size='medium'
                    style={{
                      height: '150px',
                      width: '200px',
                      borderRadius: '50%',
                    }}
                  ></Image>
                  <Card.Header style={{ marginTop: '10px' }}>
                    {item.name}
                  </Card.Header>
                  <Card.Description>{item.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button
                      color='green'
                      onClick={() => {
                        alert('You cannot perform this action')
                      }}
                    >
                      Update
                    </Button>
                    <Button color='purple' onClick={() => handleModel(item)}>
                      View
                    </Button>
                    {open && (
                      <ModelComponent
                        open={open}
                        setOpen={setOpen}
                        handleDelete={handleDelete}
                        {...user}
                      ></ModelComponent>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
      </Grid>
    </Container>
  )
}

export default Home
