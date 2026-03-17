const express = require('express')
const supabaseJS = require('@supabase/supabase-js')
const jwt = require('jsonwebtoken');


const app = express()
app.use(express.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do supabase estão vazias')
  process.exit(1)
}

const supabase = supabaseJS.createClient(supabaseUrl, supabaseAnonKey)

app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('itens').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


app.post('/cadastro', async (req, res) => {
  const { email, password, ...metadata } = req.body;
  const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,       
      }
    })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)    
})


app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error){ 
    if(error.code === "email_not_confirmed"){
      await supabase.auth.resend({
        email: email,
        type: 'signup',
      })
      console.log(error);
      console.log(error.message);
      
      return res.status(401).json({ error: 'email não confirmado, um novo email de confirmação está sendo enviado para o seu email.'}) 
    }
    return res.status(401).json({ error: error.message }) 
  }
  
  // The session object contains the access token (JWT) and refresh token
  const { session } = data;


  res.json({ 
    message: 'Logado!', 
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    user: session.user 
  })

})



const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
 
  
  if (!authHeader) {
    return res.status(401).json({ error: 'token não fornecido' })
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  console.log(token)
  const decoded = jwt.decode(token) 
  console.log(decoded)
  
 
  const { data: { user }, error } = await supabase.auth.getUser(token)
  console.log(user)
  
  if (error) {
    console.log(error)
    
    return res.status(401).json({ error: 'token inválido' })
  }
  req.user = user
  next()

}


app.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] 
  if (!token) return res.sendStatus(204) 

  const { error } = await supabase.auth.admin.signOut(token)

  if (error) {
    console.log(error)
    if(error.code === 'bad_jwt') return res.status(403).json({ error: 'token inválido' })

    return res.status(401).json({ error: 'token não fornecido' })
  }

  res.json({ message: 'Deslogado!' })
})



//testando rota para verificar se a RLS está funcionando
app.delete('/itens/:id', async (req, res) => {
  const itemId  = req.params.id 
  console.log(itemId)
  const {data, error} = await supabase.from('itens').delete().eq('id', itemId)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server executando na porta ${port}`))
