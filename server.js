// Importando framework express
const express = require('express');

// Cookies e sessões
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Inicializar express
const app = express();

// Servir arquivos estáticos
app.use(express.static('public'));

// Configurando a biblioteca do cookie
app.use(cookieParser());

// Configurando a sessão
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'myKey', // Chave secreta para os cookies
    resave: false, // Evita regravar as sessões
    saveUninitialized: true // Salva sessões anônimas
}));

// Configurando usuários
const users = [
    { id: 1, nome: 'Paulo', email: 'engs-paulodomingues@camporeal.edu.br', senha: '123456' },
    { id: 2, nome: 'Luis', email: 'engs-luisnovakoski@camporeal.edu.br', senha: '654321' }
];

// Configurando a rota de login
app.get('/login', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/styles.css">
        <div class="login-container">
            <h1>Login</h1>
            <form action="/login" method="post">
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="senha" placeholder="Senha" required>
                <button type="submit">Login</button>
            </form>
    `);
});

app.get('/pagina', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const user = users.find(user => user.id === req.session.userId);
    res.send(`
        <link rel="stylesheet" href="/styles.css">
        <div class="pag-container">
            <h1>Bem-vindo, ${user.nome}</h1>
            <p>Você está na página protegida!</p>
            <p>Deseja sair?</p>
            <button type="submit"><a href="/logout">Sair</a></button>
        </div>
    `);
});

// Configurando a rota de Logout

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/pagina');
        }
        res.redirect('/login');
    });
});

// Configurando a rota de login

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const user = users.find(user => user.email === email && user.senha === senha);
    if (user) {
        req.session.userId = user.id;
        return res.redirect('/pagina');
    }
    res.send(`
        <link rel="stylesheet" href="/styles.css">
        <div class="tentednv-container">
            <h1>Usuário ou senha inválidos</h1>
            <button type="submit"><a href="/login">Tentar novamente</a></button> 
        </div>
    `);
});

// Configurando a porta do servidor
app.listen(3000, () => { console.log("http://localhost:3000/login"); });
