import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { createNodeWebSocket } from '@hono/node-ws'
import { db } from './database.js'




//Når en bruger opretter forbindelse

const app = new Hono()
const { injectWebSocket, upgradeWebSocket } =
  createNodeWebSocket({ app })

const users = new Map();

app.get('/messages/:user/:contact', (c) => {
  const user = c.req.param('user');
  const contact = c.req.param('contact');

  const messages = db.prepare(`
    SELECT * FROM messages 
    WHERE (sender =? AND receiver = ?)
    OR (sender = ? AND receiver = ?)
    ORDER BY created_at ASC, id ASC
    `).all(user, contact, contact, user);
  return c.json(messages);

});

app.get('/test', (c) => {
  return c.text('Hono virker!');
});

app.get('/ws',

  upgradeWebSocket((c) => {
    const username = c.req.query('user')
    return {
      onOpen(event, ws) {
        if (!username) {
          ws.close()
          return
        }
        users.set(username, ws)
        console.log('En bruger har oprettet forbindelse!')
      },

      onMessage(event, ws) {
        if (!username) {
          console.log('Brugernavn mangler!')
          return
        }
        const data = JSON.parse(String(event.data))
        const receiver = users.get(data.to)
        const insert = db.prepare(`
          INSERT INTO messages (sender, receiver, message)
          VALUES(?,?,?)
          `);
        insert.run(username, data.to, data.message);
        console.log('Besked gemt i SQlite:', data.message)

        if (receiver && receiver.readyState === 1) {
          receiver.send(JSON.stringify({
            from: username,
            to: data.to,
            message: data.message
          }));

          console.log('Afsender:', username);
          console.log('Modtager:', data.to);
          console.log('Modtager fundet:', !!receiver);
          console.log('Modtagerens status:', receiver?.readyState);

          console.log('Besked sendt videre til:', data.to)
        }
        if (typeof event.data === 'string') {
          console.log('Modtaget besked:', event.data)

        }

        //Sender beskeden tilbage til brugeren

      },
      onClose() {
        console.log('Forbindelsen er lukket!')
      }
    }
  })
)
app.use('*', serveStatic({ root: './public' }))


app.get('/about', (c) => {
  return c.html(`
    <h1>About Hono Chat</h1>
    <p> Jeg lærer Hono og routing.</p>`)
})

app.get('/user/:name/:age', (c) => {
  const name = c.req.param('name')
  const age = c.req.param('age')

  return c.text(`Hej ${name}! Du er ${age} år gammel.`)
})


app.post('/message', async (c) => {
  const body = await c.req.json()

  return c.json({
    received: body
  })
})

const port = Number(process.env.PORT) || 3000;
const server = serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
injectWebSocket(server)



