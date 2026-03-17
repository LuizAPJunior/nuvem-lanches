const express = require('express')
const supabaseJS = require('@supabase/supabase-js')



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
